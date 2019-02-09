import * as moment from 'moment'

export function utcOffset (time) {
    return time == null ? null : moment(time).utcOffset('420').format()
}