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
var predictionsSelect = "select * from predictions_vw";
var racePredictionSelect = "select * from racepredictions_vw";
var userPicksSelect = "select * from userpicks_vw";
var modifierSelect = "select choice, modifier from modifiers";
function getPredictionResponses(raceKeys, userKey) {
    return __awaiter(this, void 0, void 0, function () {
        var predictionResponses, racePredictionRows, predictionKeys, predictions, userPicks, _loop_1, _i, racePredictionRows_1, racePredictionRow;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    predictionResponses = [];
                    return [4 /*yield*/, getRacePredictions(raceKeys)];
                case 1:
                    racePredictionRows = _a.sent();
                    predictionKeys = racePredictionRows.filter(function (rp) { return rp.prediction; }).map(function (rp) { return rp.prediction; });
                    return [4 /*yield*/, getPredictions(predictionKeys)];
                case 2:
                    predictions = _a.sent();
                    return [4 /*yield*/, getUserPicks(userKey, raceKeys)];
                case 3:
                    userPicks = _a.sent();
                    _loop_1 = function (racePredictionRow) {
                        var thisPrediction = predictions.filter(function (p) {
                            return p.key === racePredictionRow.prediction;
                        })[0];
                        // If we don't have a base prediction, then we won't add this.
                        if (!thisPrediction) {
                            return "continue";
                        }
                        var prediction = {
                            allSeason: thisPrediction.allSeason ? true : false,
                            key: thisPrediction.key,
                            value: racePredictionRow.value,
                            description: thisPrediction.description,
                            title: thisPrediction.title,
                            type: thisPrediction.type,
                            outcome: [],
                            userPick: "",
                            raceKey: racePredictionRow.race
                        };
                        // Get all of the user picks for this prediction
                        prediction.userPick = userPicks.filter(function (up) {
                            return up.prediction === prediction.key;
                        }).map(function (up) {
                            return up.choice;
                        })[0];
                        predictionResponses.push(prediction);
                    };
                    for (_i = 0, racePredictionRows_1 = racePredictionRows; _i < racePredictionRows_1.length; _i++) {
                        racePredictionRow = racePredictionRows_1[_i];
                        _loop_1(racePredictionRow);
                    }
                    return [2 /*return*/, predictionResponses];
            }
        });
    });
}
exports.getPredictionResponses = getPredictionResponses;
function getModifiers(raceKey, predictionKey) {
    return __awaiter(this, void 0, void 0, function () {
        var modifierResponses;
        return __generator(this, function (_a) {
            modifierResponses = [];
            if (!raceKey || !predictionKey) {
                return [2 /*return*/, modifierResponses];
            }
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var statement = modifierSelect + (" where race = '" + raceKey + "' AND prediction = '" + predictionKey + "' order by choice asc");
                    db.all(statement, function (err, rows) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(rows);
                    });
                })];
        });
    });
}
exports.getModifiers = getModifiers;
function savePredictionModifiers(prediction, race, modifiers) {
    return new Promise(function (resolve, reject) {
        if (!prediction || !race) {
            reject(new Error("need race key and prediction key"));
            return;
        }
        var deleteStatement = "DELETE FROM modifiers where race == '" + race + "' AND prediction == '" + prediction + "'";
        db.run(deleteStatement, function (err) {
            if (err) {
                reject(err);
                return;
            }
            try {
                var insert_1 = "INSERT OR REPLACE INTO modifiers\n            (race, prediction, choice, modifier)\n            VALUES (?1, ?2, ?3, ?4);";
                db.serialize(function () {
                    db.exec("BEGIN;", function (beginError) {
                        if (beginError) {
                            reject(beginError);
                            return;
                        }
                        for (var _i = 0, modifiers_1 = modifiers; _i < modifiers_1.length; _i++) {
                            var modifier = modifiers_1[_i];
                            var valuesObject = {
                                1: race,
                                2: prediction,
                                3: modifier.choice,
                                4: modifier.modifier
                            };
                            db.run(insert_1, valuesObject);
                        }
                        db.exec("COMMIT;", function (commitError) {
                            if (commitError) {
                                reject(commitError);
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
        });
    });
}
exports.savePredictionModifiers = savePredictionModifiers;
function getUserPicks(userKey, raceKeys) {
    return new Promise(function (resolve, reject) {
        var statement = userPicksSelect + " where user = '" + userKey + "'";
        if (raceKeys && raceKeys.length) {
            statement = statement + " and race in ('" + raceKeys.join("','") + "')";
        }
        db.all(statement, function (err, rows) {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}
exports.getUserPicks = getUserPicks;
function getAllSeasonValues() {
    return new Promise(function (resolve, reject) {
        var statement = racePredictionSelect + " where race == '2017-season'";
        db.all(statement, function (err, rows) {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}
exports.getAllSeasonValues = getAllSeasonValues;
function getAllSeasonPredictions() {
    return new Promise(function (resolve, reject) {
        var statement = predictionsSelect + " where allseason == 1";
        db.all(statement, function (err, rows) {
            if (err) {
                reject(err);
                return;
            }
            var predictions = [];
            for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                var row = rows_1[_i];
                var prediction = {
                    key: row.key,
                    allSeason: row.allSeason != 0 ? true : false,
                    title: row.title,
                    description: row.description,
                    type: row.type
                };
                predictions.push(prediction);
            }
            resolve(predictions);
            return;
        });
    });
}
exports.getAllSeasonPredictions = getAllSeasonPredictions;
function getPredictions(keys) {
    return new Promise(function (resolve, reject) {
        var whereStatement;
        if (keys && keys.length) {
            var innerKeys = keys.join("','");
            whereStatement = "where key IN ('" + innerKeys + "')";
        }
        db.all(predictionsSelect + " " + whereStatement, function (err, rows) {
            if (err) {
                reject(err);
                return;
            }
            var predictions = [];
            for (var _i = 0, rows_2 = rows; _i < rows_2.length; _i++) {
                var row = rows_2[_i];
                var prediction = {
                    key: row.key,
                    allSeason: row.allSeason != 0 ? true : false,
                    title: row.title,
                    description: row.description,
                    type: row.type
                };
                predictions.push(prediction);
            }
            resolve(predictions);
            return;
        });
    });
}
exports.getPredictions = getPredictions;
function getPredictionsForRace(raceKey) {
    return new Promise(function (resolve, reject) {
        var statement = racePredictionSelect + " WHERE race = '" + raceKey + "'";
        db.all(statement, function (err, rows) {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
            return;
        });
    });
}
exports.getPredictionsForRace = getPredictionsForRace;
function getRacePredictions(raceKeys) {
    return new Promise(function (resolve, reject) {
        var statement;
        if (raceKeys && raceKeys.length) {
            var innerKeys = raceKeys.join("','");
            statement = racePredictionSelect + " WHERE race in ('" + innerKeys + "')";
        }
        else {
            statement = racePredictionSelect;
        }
        db.all(statement, function (err, rows) {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
            return;
        });
    });
}
exports.getRacePredictions = getRacePredictions;
function saveUserPicks(userPicks) {
    return new Promise(function (resolve, reject) {
        try {
            var insert_2 = "INSERT OR REPLACE INTO userpicks\n            (user, race, prediction, choice)\n            VALUES (?1, ?2, ?3, ?4)";
            db.serialize(function () {
                db.exec("BEGIN;", function (beginError) {
                    if (beginError) {
                        reject(beginError);
                        return;
                    }
                    for (var _i = 0, userPicks_1 = userPicks; _i < userPicks_1.length; _i++) {
                        var userPick = userPicks_1[_i];
                        if (!userPick.choice) {
                            continue;
                        }
                        var valuesObject = {
                            1: userPick.user,
                            2: userPick.race,
                            3: userPick.prediction,
                            4: userPick.choice
                        };
                        db.run(insert_2, valuesObject);
                    }
                    db.exec("COMMIT;", function (commitError) {
                        if (commitError) {
                            reject(commitError);
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
    });
}
exports.saveUserPicks = saveUserPicks;
function deleteRacePredictions(race, keys) {
    return new Promise(function (resolve, reject) {
        var joinedKeys = keys.join("','");
        var deleteStatement = "DELETE FROM racepredictions WHERE \n        race == '" + race + "' && prediction in ('" + joinedKeys + "')";
        db.run(deleteStatement, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    });
}
exports.deleteRacePredictions = deleteRacePredictions;
function updateRacePredictions(race, updates) {
    return new Promise(function (resolve, reject) {
        try {
            var insert_3 = "INSERT OR REPLACE INTO racepredictions\n            (prediction, race, value, modifier)\n            VALUES (?1, ?2, ?3, ?4)";
            db.serialize(function () {
                db.exec("BEGIN;", function (beginError) {
                    if (beginError) {
                        reject(beginError);
                        return;
                    }
                    for (var _i = 0, updates_1 = updates; _i < updates_1.length; _i++) {
                        var racePrediction = updates_1[_i];
                        var valuesObject = {
                            1: racePrediction.prediction,
                            2: race,
                            3: racePrediction.value
                        };
                        db.run(insert_3, valuesObject);
                    }
                    db.exec("COMMIT;", function (commitError) {
                        if (commitError) {
                            reject(commitError);
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
    });
}
exports.updateRacePredictions = updateRacePredictions;
function updatePredictions(predictions) {
    return new Promise(function (resolve, reject) {
        try {
            var insert_4 = "INSERT OR REPLACE INTO predictions\n            (key, description, title, type, allseason) \n            VALUES (?1, ?2, ?3, ?4, ?5)";
            db.serialize(function () {
                db.exec("BEGIN;", function (beginError) {
                    if (beginError) {
                        reject(beginError);
                        return;
                    }
                    for (var _i = 0, predictions_1 = predictions; _i < predictions_1.length; _i++) {
                        var prediction = predictions_1[_i];
                        var valuesObject = {
                            1: prediction.key,
                            2: prediction.description,
                            3: prediction.title,
                            4: prediction.type,
                            5: prediction.allSeason ? 1 : 0
                        };
                        db.run(insert_4, valuesObject);
                    }
                    db.exec("COMMIT;", function (commitError) {
                        if (commitError) {
                            reject(commitError);
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
    });
}
exports.updatePredictions = updatePredictions;
//# sourceMappingURL=predictions.js.map