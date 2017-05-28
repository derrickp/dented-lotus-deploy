'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var sqlite3 = require("sqlite3");
var db = new sqlite3.Database('app/Data/' + process.env.DBNAME);
var blogQuery = "select blogs.message, blogs.title, blogs.userkey as userKey, blogs.postdate as postDate from blogs";
var topMessage = "select * from messageoftherace order by created_date DESC LIMIT 1 ";
var addRadioMessage = "INSERT OR REPLACE INTO messageoftherace (image_url, message, created_by, created_date, season_id, race_id)";
function getLatestRadioMessage() {
    return new Promise(function (resolve, reject) {
        var statement = topMessage;
        db.all(statement, function (err, rows) {
            if (err) {
                reject(err);
            }
            resolve(rows[0]);
        });
    });
}
exports.getLatestRadioMessage = getLatestRadioMessage;
function addNewRadioMessage(newMessage) {
    return new Promise(function (resolve, reject) {
        try {
            var insertStatement_1 = addRadioMessage + " VALUES (?1, ?2, ?3, ?4, ?5, ?6);";
            db.serialize(function () {
                db.exec("BEGIN;");
                var valuesObject = {
                    1: newMessage.image_url,
                    2: encodeURIComponent(newMessage.message),
                    3: newMessage.created_by,
                    4: newMessage.created_date,
                    5: newMessage.season_id,
                    6: newMessage.race_id
                };
                db.run(insertStatement_1, valuesObject);
                db.exec("COMMIT;");
                resolve(true);
            });
        }
        catch (exception) {
            console.error(exception);
            db.exec("ROLLBACK;");
            reject(exception);
        }
    });
}
exports.addNewRadioMessage = addNewRadioMessage;
//# sourceMappingURL=sqliteUtilities.js.map