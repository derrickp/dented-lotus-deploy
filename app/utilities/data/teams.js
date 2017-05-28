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
var teamSelect = "select * from teams_vw";
function getTeams(keys) {
    return new Promise(function (resolve, reject) {
        var statement = teamSelect;
        if (keys && keys.length) {
            var innerKeys = keys.join("','");
            statement = statement + " where key IN ('" + innerKeys + "')";
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
exports.getTeams = getTeams;
function saveTeams(teams) {
    return __awaiter(this, void 0, void 0, function () {
        var keys, existingTeams;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Only save the teams with a key
                    teams = teams.filter(function (t) { return t.key; });
                    if (!teams.length) {
                        return [2 /*return*/, true];
                    }
                    keys = teams.map(function (t) { return t.key; });
                    return [4 /*yield*/, getTeams(keys)];
                case 1:
                    existingTeams = _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            try {
                                var insert_1 = "INSERT OR REPLACE INTO teams \n            (key, name, trivia, headquarterscity, points, abbreviation) \n            VALUES (?1, ?2, ?3, ?4, ?5, ?6)";
                                db.serialize(function () {
                                    db.exec("BEGIN;");
                                    var _loop_1 = function (team) {
                                        var existingTeam = existingTeams.filter(function (t) {
                                            return t.key === team.key;
                                        })[0];
                                        var values = {
                                            1: team.key
                                        };
                                        // name
                                        if (team.name) {
                                            values[2] = team.name;
                                        }
                                        else {
                                            values[2] = existingTeam ? existingTeam.name : null;
                                        }
                                        // trivia
                                        if (team.trivia) {
                                            values[3] = JSON.stringify(team.trivia);
                                        }
                                        else {
                                            values[3] = existingTeam ? JSON.stringify(existingTeam.trivia) : JSON.stringify([]);
                                        }
                                        //headquarterscity
                                        if (team.headquartersCity) {
                                            values[4] = team.headquartersCity;
                                        }
                                        else {
                                            values[4] = existingTeam ? existingTeam.headquartersCity : null;
                                        }
                                        // points
                                        if (team.points) {
                                            values[5] = team.points;
                                        }
                                        else {
                                            values[5] = existingTeam ? existingTeam.points : 0;
                                        }
                                        // abbreviation
                                        if (team.abbreviation) {
                                            values[6] = existingTeam.abbreviation;
                                        }
                                        else {
                                            values[6] = existingTeam ? existingTeam.abbreviation : null;
                                        }
                                        db.run(insert_1, values);
                                    };
                                    for (var _i = 0, teams_1 = teams; _i < teams_1.length; _i++) {
                                        var team = teams_1[_i];
                                        _loop_1(team);
                                    }
                                    db.exec("COMMIT;", function (commitError) {
                                        if (commitError) {
                                            reject(commitError);
                                        }
                                        else {
                                            resolve(true);
                                        }
                                    });
                                });
                            }
                            catch (exception) {
                                console.error(exception);
                                db.exec("ROLLBACK;");
                                reject(exception);
                            }
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, true];
            }
        });
    });
}
exports.saveTeams = saveTeams;
function getTeamResponses(keys) {
    return __awaiter(this, void 0, void 0, function () {
        var teams, teamRows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    teams = [];
                    return [4 /*yield*/, getTeams(keys)];
                case 1:
                    teamRows = _a.sent();
                    if (teamRows && teamRows.length) {
                        teamRows.forEach(function (teamRow) {
                            var team = {
                                key: teamRow.key,
                                name: teamRow.name,
                                trivia: teamRow.trivia ? JSON.parse(teamRow.trivia) : []
                            };
                            teams.push(team);
                        });
                    }
                    return [2 /*return*/, teams];
            }
        });
    });
}
exports.getTeamResponses = getTeamResponses;
//# sourceMappingURL=teams.js.map