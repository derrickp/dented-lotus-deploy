'use strict';
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var Boom = require("boom");
var races_1 = require("../utilities/data/races");
var predictions_1 = require("../utilities/data/predictions");
var users_1 = require("../utilities/data/users");
exports.scoreRoutes = [
    {
        method: "POST",
        path: "/admin/score",
        config: {
            cors: true,
            handler: function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                var users, raceKeys, _i, users_2, user, points, numCorrect, userPicks, _loop_1, _a, raceKeys_1, raceKey, sorted, i, user, position, previousPosition, positionChange, exception_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 15, , 16]);
                            return [4 /*yield*/, users_1.getFullUsers()];
                        case 1:
                            users = _b.sent();
                            return [4 /*yield*/, races_1.getRaceKeys(2017)];
                        case 2:
                            raceKeys = _b.sent();
                            console.log(raceKeys);
                            _i = 0, users_2 = users;
                            _b.label = 3;
                        case 3:
                            if (!(_i < users_2.length)) return [3 /*break*/, 10];
                            user = users_2[_i];
                            points = 0;
                            numCorrect = 0;
                            return [4 /*yield*/, predictions_1.getUserPicks(user.key, raceKeys)];
                        case 4:
                            userPicks = _b.sent();
                            _loop_1 = function (raceKey) {
                                var finalPicks, racePredictions, _loop_2, _i, racePredictions_1, rp;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, races_1.getFinalRacePredictions(raceKey)];
                                        case 1:
                                            finalPicks = _a.sent();
                                            return [4 /*yield*/, predictions_1.getPredictionsForRace(raceKey)];
                                        case 2:
                                            racePredictions = _a.sent();
                                            _loop_2 = function (rp) {
                                                var finalPick, modifiers, userPick, modifierIndex, modifier, predictionPoints;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            finalPick = finalPicks.filter(function (fp) {
                                                                return fp.prediction === rp.prediction;
                                                            })[0];
                                                            return [4 /*yield*/, predictions_1.getModifiers(rp.race, rp.prediction)];
                                                        case 1:
                                                            modifiers = _a.sent();
                                                            // If we don't have a final pick, then this prediction hasn't been finalized...
                                                            if (!finalPick) {
                                                                return [2 /*return*/, "continue"];
                                                            }
                                                            userPick = userPicks.filter(function (up) { return up.prediction === rp.prediction && up.race === raceKey; })[0];
                                                            // If user pick doesn't exist, the user didn't make a pick for this prediction. Continue
                                                            if (!userPick) {
                                                                return [2 /*return*/, "continue"];
                                                            }
                                                            // 3. Compare their pick choice to finals
                                                            if (finalPick.final.includes(userPick.choice)) {
                                                                modifierIndex = modifiers.findIndex(function (m) { return m.choice === finalPick.final; });
                                                                modifier = 1.0;
                                                                if (modifierIndex >= 0) {
                                                                    modifier = modifiers[modifierIndex].modifier;
                                                                }
                                                                predictionPoints = Math.round(rp.value * modifier);
                                                                points += predictionPoints;
                                                                numCorrect += 1;
                                                            }
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            };
                                            _i = 0, racePredictions_1 = racePredictions;
                                            _a.label = 3;
                                        case 3:
                                            if (!(_i < racePredictions_1.length)) return [3 /*break*/, 6];
                                            rp = racePredictions_1[_i];
                                            return [5 /*yield**/, _loop_2(rp)];
                                        case 4:
                                            _a.sent();
                                            _a.label = 5;
                                        case 5:
                                            _i++;
                                            return [3 /*break*/, 3];
                                        case 6: return [2 /*return*/];
                                    }
                                });
                            };
                            _a = 0, raceKeys_1 = raceKeys;
                            _b.label = 5;
                        case 5:
                            if (!(_a < raceKeys_1.length)) return [3 /*break*/, 8];
                            raceKey = raceKeys_1[_a];
                            return [5 /*yield**/, _loop_1(raceKey)];
                        case 6:
                            _b.sent();
                            _b.label = 7;
                        case 7:
                            _a++;
                            return [3 /*break*/, 5];
                        case 8:
                            if (points != user.points || numCorrect != user.numCorrectPicks) {
                                user.points = points;
                                user.numCorrectPicks = numCorrect;
                                // await updateUser({ key: user.key, points: points, numCorrectPicks: numCorrect });
                            }
                            _b.label = 9;
                        case 9:
                            _i++;
                            return [3 /*break*/, 3];
                        case 10:
                            sorted = users.sort(function (user1, user2) {
                                if (user2.points === user1.points) {
                                    return user1.display.localeCompare(user2.display);
                                }
                                return user2.points - user1.points;
                            });
                            i = 0;
                            _b.label = 11;
                        case 11:
                            if (!(i < users.length)) return [3 /*break*/, 14];
                            user = users[i];
                            position = i + 1;
                            previousPosition = user.position;
                            if (previousPosition) {
                                positionChange = position - previousPosition;
                                user.positionChange = positionChange;
                            }
                            user.position = position;
                            return [4 /*yield*/, users_1.updateUser(user)];
                        case 12:
                            _b.sent();
                            _b.label = 13;
                        case 13:
                            i++;
                            return [3 /*break*/, 11];
                        case 14:
                            // Once we're here all user info has been saved
                            reply({ success: true });
                            return [3 /*break*/, 16];
                        case 15:
                            exception_1 = _b.sent();
                            reply(Boom.badRequest(exception_1));
                            return [3 /*break*/, 16];
                        case 16: return [2 /*return*/];
                    }
                });
            }); },
            auth: {
                strategies: ["jwt"],
                scope: ["admin"]
            }
        }
    }
];
//# sourceMappingURL=scores.js.map