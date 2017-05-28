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
var drivers_1 = require("../utilities/data/drivers");
var teams_1 = require("../utilities/data/teams");
var predictions_1 = require("../utilities/data/predictions");
exports.predictionsRoutes = [
    // Get modifiers for race/prediction
    {
        method: "GET",
        path: "/predictions/modifiers/{raceKey}/{predictionKey}",
        config: {
            cors: true,
            handler: function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                var credentials, userKey, raceKey, predictionKey, modifiers, exception_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            credentials = request.auth.credentials;
                            userKey = credentials.key;
                            raceKey = request.params["raceKey"];
                            predictionKey = request.params["predictionKey"];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, predictions_1.getModifiers(raceKey, predictionKey)];
                        case 2:
                            modifiers = _a.sent();
                            reply(modifiers);
                            return [3 /*break*/, 4];
                        case 3:
                            exception_1 = _a.sent();
                            reply(Boom.badRequest(exception_1));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); },
            auth: {
                strategies: ['jwt'],
                scope: ['user']
            }
        }
    },
    {
        method: "POST",
        path: "/admin/predictions/modifiers/{raceKey}/{predictionKey}",
        config: {
            cors: true,
            handler: function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                var adds, raceKey, predictionKey, exception_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            adds = request.payload;
                            raceKey = request.params["raceKey"];
                            predictionKey = request.params["predictionKey"];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, predictions_1.savePredictionModifiers(predictionKey, raceKey, adds)];
                        case 2:
                            _a.sent();
                            reply({ success: true }).code(201);
                            return [3 /*break*/, 4];
                        case 3:
                            exception_2 = _a.sent();
                            reply(Boom.badRequest(exception_2));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); },
            auth: {
                strategies: ['jwt'],
                scope: ['admin']
            }
        }
    },
    {
        method: "GET",
        path: "/predictions/{raceKey}",
        config: {
            cors: true,
            handler: function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                var credentials, userKey, raceKeys, predictions, exception_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            credentials = request.auth.credentials;
                            userKey = credentials.key;
                            raceKeys = request.params["raceKey"] ? [request.params["raceKey"]] : [];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, predictions_1.getPredictionResponses(raceKeys, credentials.key)];
                        case 2:
                            predictions = _a.sent();
                            reply(predictions);
                            return [3 /*break*/, 4];
                        case 3:
                            exception_3 = _a.sent();
                            reply(Boom.badRequest(exception_3));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); },
            auth: {
                strategies: ['jwt'],
                scope: ['user']
            }
        }
    },
    {
        method: "POST",
        path: "/admin/predictions",
        config: {
            cors: true,
            handler: function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                var predictions, _i, predictions_2, prediction, success, newPredictions, exception_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            predictions = request.payload;
                            for (_i = 0, predictions_2 = predictions; _i < predictions_2.length; _i++) {
                                prediction = predictions_2[_i];
                                if (prediction.key) {
                                    reply(Boom.badRequest("can't create new predictions with existing key"));
                                    return [2 /*return*/];
                                }
                                if (!prediction.title) {
                                    reply(Boom.badRequest("new predictions need a title"));
                                    return [2 /*return*/];
                                }
                                prediction.key = prediction.title.replace(/\s+/g, '-').replace(/\)+/g, '').replace(/\(+/g, '').toLowerCase();
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, predictions_1.updatePredictions(predictions)];
                        case 2:
                            success = _a.sent();
                            return [4 /*yield*/, predictions_1.getPredictions()];
                        case 3:
                            newPredictions = _a.sent();
                            reply(newPredictions);
                            return [3 /*break*/, 5];
                        case 4:
                            exception_4 = _a.sent();
                            reply(Boom.badRequest(exception_4));
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); },
            auth: {
                strategies: ['jwt'],
                scope: ['admin']
            }
        }
    },
    {
        method: "GET",
        path: "/allseason/predictions",
        config: {
            cors: true,
            handler: function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                var credentials, keys, predictions, values, drivers, teams, userPicks, _loop_1, _i, predictions_3, prediction, exception_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            credentials = request.auth.credentials;
                            keys = request.params["key"] ? [request.params["key"]] : [];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 7, , 8]);
                            return [4 /*yield*/, predictions_1.getAllSeasonPredictions()];
                        case 2:
                            predictions = _a.sent();
                            return [4 /*yield*/, predictions_1.getAllSeasonValues()];
                        case 3:
                            values = _a.sent();
                            return [4 /*yield*/, drivers_1.getDriverResponses()];
                        case 4:
                            drivers = _a.sent();
                            return [4 /*yield*/, teams_1.getTeamResponses()];
                        case 5:
                            teams = _a.sent();
                            return [4 /*yield*/, predictions_1.getUserPicks(credentials.key, ["2017-season"])];
                        case 6:
                            userPicks = _a.sent();
                            _loop_1 = function (prediction) {
                                var value = values.filter(function (v) {
                                    return v.prediction === prediction.key;
                                })[0];
                                if (value) {
                                    prediction.value = value.value;
                                    prediction.raceKey = value.race;
                                }
                                prediction.allSeason = true;
                                prediction.userPick = userPicks.filter(function (p) {
                                    return p.prediction === prediction.key;
                                }).map(function (p) { return p.choice; })[0];
                            };
                            for (_i = 0, predictions_3 = predictions; _i < predictions_3.length; _i++) {
                                prediction = predictions_3[_i];
                                _loop_1(prediction);
                            }
                            reply(predictions);
                            return [3 /*break*/, 8];
                        case 7:
                            exception_5 = _a.sent();
                            reply(Boom.badRequest(exception_5));
                            return [3 /*break*/, 8];
                        case 8: return [2 /*return*/];
                    }
                });
            }); },
            auth: {
                strategies: ['jwt'],
                scope: ['user']
            }
        }
    }
];
//# sourceMappingURL=predictions.js.map