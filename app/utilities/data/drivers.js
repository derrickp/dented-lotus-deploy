"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var sqlite3 = require("sqlite3");
var db = new sqlite3.Database('app/Data/' + process.env.DBNAME);
var driverSelect = "SELECT * from drivers_vw";
function saveDrivers(drivers) {
    return new Promise(function (resolve, reject) {
        try {
            var insert_1 = "INSERT OR REPLACE INTO drivers \n            (key, active, firstname, lastname, team, trivia, nationality, flag, birthdate, abbreviation, wins, number) \n            VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)";
            var driverPromise = new Promise(function (res, rej) {
                db.serialize(function () {
                    db.exec("BEGIN;");
                    drivers.forEach(function (driver) {
                        var valuesObject = {
                            1: driver.key,
                            2: driver.active ? 1 : 0,
                            3: driver.firstName ? driver.firstName : "",
                            4: driver.lastName,
                            5: driver.team ? driver.team : "",
                            6: driver.trivia ? JSON.stringify(driver.trivia) : "",
                            7: driver.nationality ? driver.nationality : "",
                            8: driver.flag ? driver.flag : "",
                            9: driver.birthdate ? driver.birthdate : "",
                            10: driver.abbreviation ? driver.abbreviation : "",
                            11: driver.wins ? driver.wins : 0,
                            12: driver.number ? driver.number : 0
                        };
                        db.run(insert_1, valuesObject);
                    });
                    db.exec("COMMIT;");
                    return res(true);
                });
            });
            var pointsPromise = new Promise(function (res, rej) {
                var year = new Date(Date.now()).getFullYear();
                db.serialize(function () {
                    db.exec("BEGIN;");
                    drivers.forEach(function (d) {
                        var values = {
                            1: d.key,
                            2: year,
                            3: d.points
                        };
                        var pointsInsert = "REPLACE INTO driver_season_points (driver, season, points) VALUES (?1, ?2, ?3)";
                        db.run(pointsInsert, values);
                    });
                    db.exec("COMMIT;");
                    res(true);
                });
            });
            return Promise.all([driverPromise, pointsPromise]).then(function () {
                return resolve(true);
            });
        }
        catch (exception) {
            console.error(exception);
            db.exec("ROLLBACK;");
            reject(exception);
        }
    });
}
exports.saveDrivers = saveDrivers;
function getDriverResponses(active, keys) {
    return __awaiter(this, void 0, void 0, function () {
        var driverRows, drivers, _i, driverRows_1, driverRow, driver;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getDrivers(false, keys)];
                case 1:
                    driverRows = _a.sent();
                    drivers = [];
                    for (_i = 0, driverRows_1 = driverRows; _i < driverRows_1.length; _i++) {
                        driverRow = driverRows_1[_i];
                        driver = {
                            abbreviation: driverRow.abbreviation,
                            active: driverRow.active ? true : false,
                            birthdate: driverRow.birthdate,
                            firstName: driverRow.firstName,
                            lastName: driverRow.lastName,
                            flag: driverRow.flag,
                            points: +driverRow.points,
                            nationality: driverRow.nationality,
                            team: driverRow.team,
                            trivia: driverRow.trivia ? JSON.parse(driverRow.trivia) : [],
                            key: driverRow.key
                        };
                        drivers.push(driver);
                    }
                    return [2 /*return*/, drivers];
            }
        });
    });
}
exports.getDriverResponses = getDriverResponses;
function getDrivers(active, keys) {
    return new Promise(function (resolve, reject) {
        var whereStatement;
        if (active) {
            whereStatement = "where active = 1";
        }
        else {
            whereStatement = "where active >= 0";
        }
        if (keys && keys.length) {
            var innerKeys = keys.join("','");
            whereStatement = whereStatement + " and key IN ('" + innerKeys + "')";
        }
        db.all(driverSelect + " " + whereStatement, function (err, rows) {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}
exports.getDrivers = getDrivers;
;
//# sourceMappingURL=drivers.js.map