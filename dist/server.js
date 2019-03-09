"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const PORT = process.env.API_PORT;
app_1.default.listen(PORT, () => {
    console.log('🚀 API is running!');
});
//# sourceMappingURL=server.js.map