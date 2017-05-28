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
var raceSelect = "select * from races_vw";
function getRaceKeys(season) {
    return new Promise(function (resolve, reject) {
        var statement = "select key from races_vw where season = " + season;
        db.all(statement, function (err, rows) {
            if (err) {
                reject(err);
                return;
            }
            var keys = [];
            for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                var row = rows_1[_i];
                keys.push(row.key);
            }
            resolve(keys);
        });
    });
}
exports.getRaceKeys = getRaceKeys;
function getRaces(season, keys) {
    return new Promise(function (resolve, reject) {
        var selectStatement = raceSelect + " where season = " + season;
        var whereStatement = "";
        if (keys && keys.length) {
            var innerKeys = keys.join("','");
            whereStatement = " and key IN ('" + innerKeys + "')";
        }
        db.all(selectStatement + " " + whereStatement, function (err, rows) {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}
exports.getRaces = getRaces;
function getFinalRacePredictions(raceKey) {
    return new Promise(function (resolve, reject) {
        var select = "select * from racepredictionsfinals where race = '" + raceKey + "'";
        db.all(select, function (err, rows) {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    });
}
exports.getFinalRacePredictions = getFinalRacePredictions;
function saveFinalRacePredictions(raceKey, finalPicks) {
    return new Promise(function (resolve, reject) {
        var insert = "INSERT OR REPLACE INTO racepredictionsfinals \n        (prediction, race, final)\n        VALUES (?1, ?2, ?3)";
        try {
            db.serialize(function () {
                db.exec("BEGIN;", function (beginError) {
                    if (beginError) {
                        reject(beginError);
                        return;
                    }
                    for (var _i = 0, finalPicks_1 = finalPicks; _i < finalPicks_1.length; _i++) {
                        var finalPick = finalPicks_1[_i];
                        var values = {
                            1: finalPick.prediction,
                            2: raceKey,
                            3: finalPick.final
                        };
                        db.run(insert, values);
                    }
                    db.exec("COMMIT;", function (err) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve();
                    });
                });
            });
        }
        catch (exception) {
            console.error(exception);
            db.exec("ROLLBACK;");
            reject(exception);
        }
    });
}
exports.saveFinalRacePredictions = saveFinalRacePredictions;
function saveRaces(season, newRaces) {
    return __awaiter(this, void 0, void 0, function () {
        var raceKeys, existingRaces;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    raceKeys = newRaces.filter(function (r) { return r.key; }).map(function (r) { return r.key; });
                    return [4 /*yield*/, getRaces(season, raceKeys)];
                case 1:
                    existingRaces = _a.sent();
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            try {
                                var insert_1 = "INSERT OR REPLACE INTO races \n            (key, trackkey, season, trivia, cutoff, racedate, qualidate, winner, displayname, laps) \n            VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)";
                                db.serialize(function () {
                                    db.exec("BEGIN;", function (beginError) {
                                        if (beginError) {
                                            reject(beginError);
                                            return;
                                        }
                                        var _loop_1 = function (race) {
                                            var existingRace = existingRaces.filter(function (r) {
                                                r.key === race.key;
                                            })[0];
                                            var values = {
                                                1: race.key
                                            };
                                            // track
                                            if (race.track) {
                                                values[2] = race.track;
                                            }
                                            else {
                                                values[2] = existingRace ? existingRace.track : null;
                                            }
                                            // season
                                            values[3] = season;
                                            // trivia
                                            if (race.trivia) {
                                                values[4] = JSON.stringify(race.trivia);
                                            }
                                            else {
                                                values[4] = existingRace ? existingRace.trivia : JSON.stringify([]);
                                            }
                                            // cutoff
                                            if (race.cutoff) {
                                                values[5] = race.cutoff;
                                            }
                                            else {
                                                values[5] = existingRace ? existingRace.cutoff : null;
                                            }
                                            // raceDate
                                            if (race.raceDate) {
                                                values[6] = race.raceDate;
                                            }
                                            else {
                                                values[6] = existingRace ? existingRace.raceDate : null;
                                            }
                                            // qualiDate
                                            if (race.qualiDate) {
                                                values[7] = race.qualiDate;
                                            }
                                            else {
                                                values[7] = existingRace ? existingRace.qualiDate : null;
                                            }
                                            // winner
                                            if (race.winner) {
                                                values[8] = race.winner;
                                            }
                                            else {
                                                values[8] = existingRace ? existingRace.winner : null;
                                            }
                                            // displayName
                                            if (race.displayName) {
                                                values[9] = race.displayName;
                                            }
                                            else {
                                                values[9] = existingRace ? existingRace.displayName : null;
                                            }
                                            // laps
                                            if (race.laps) {
                                                values[10] = race.laps;
                                            }
                                            else {
                                                values[10] = existingRace ? existingRace.laps : null;
                                            }
                                            db.run(insert_1, values);
                                        };
                                        for (var _i = 0, newRaces_1 = newRaces; _i < newRaces_1.length; _i++) {
                                            var race = newRaces_1[_i];
                                            _loop_1(race);
                                        }
                                        db.exec("COMMIT;", function (err) {
                                            if (err) {
                                                reject(err);
                                                return;
                                            }
                                            resolve(true);
                                        });
                                    });
                                });
                            }
                            catch (exception) {
                                console.error(exception);
                                db.exec("ROLLBACK;");
                                reject(exception);
                            }
                        })];
            }
        });
    });
}
exports.saveRaces = saveRaces;
//# sourceMappingURL=races.js.map