"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATE_FORMAT = "MM/DD/YYYY";
exports.FULL_FORMAT = "MM/DD/YYYY HH:mm";
var moment = require("moment");
function getDurationFromNow(date) {
    var cutoffTime = moment(date, exports.DATE_FORMAT);
    var now = moment();
    var timeRemaining = cutoffTime.diff(now);
    var duration = moment.duration(timeRemaining, "milliseconds");
    var days = duration.days();
    var hours = duration.hours();
    var minutes = duration.minutes();
    var seconds = duration.seconds();
    var strHours = ("0" + hours.toString()).slice(-2);
    var strMinutes = ("0" + minutes.toString()).slice(-2);
    var strSeconds = ("0" + seconds.toString()).slice(-2);
    var dayString = days === 1 ? "day" : "days";
    var output = days + " " + dayString + " : " + strHours + " : " + strMinutes + " : " + strSeconds;
    return {
        timeRemaining: timeRemaining,
        duration: duration,
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        fullDuration: output
    };
}
exports.getDurationFromNow = getDurationFromNow;
//# sourceMappingURL=date.js.map