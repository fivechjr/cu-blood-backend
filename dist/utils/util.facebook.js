"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graph = require("fbgraph");
graph.setVersion(process.env.FACEBOOK_API_VERSION);
graph.setAccessToken(process.env.FACEBOOK_API_PAGE_ACCESS_TOKEN);
function getFacebookPosts() {
    return new Promise((resolve, reject) => {
        let options = {
            fields: 'id,message,created_time,full_picture,permalink_url',
            limit: 5
        };
        graph.get(`${process.env.FACEBOOK_API_PAGE_ID}/posts`, options, (err, res) => {
            if (err) {
                reject();
                return;
            }
            if (res.data != null) {
                res.data.forEach(d => {
                    d.message = d.message.replace(/\n/g, ' ');
                    d.message = d.message.replace(/ +/g, ' ');
                });
            }
            resolve(res.data);
            return;
        });
    });
}
exports.getFacebookPosts = getFacebookPosts;
function getFacebookAlbums() {
    return new Promise((resolve, reject) => {
        graph.get(`${process.env.FACEBOOK_API_PAGE_ID}/albums`, (err, res) => {
            if (err) {
                reject();
                return;
            }
            resolve(res.data);
            return;
        });
    });
}
exports.getFacebookAlbums = getFacebookAlbums;
function getFacebookPhotos(albumId) {
    return new Promise((resolve, reject) => {
        let options = {
            fields: 'id,link,updated_time,images'
        };
        graph.get(`${albumId}/photos`, options, (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(res.data);
            return;
        });
    });
}
exports.getFacebookPhotos = getFacebookPhotos;
//# sourceMappingURL=util.facebook.js.map