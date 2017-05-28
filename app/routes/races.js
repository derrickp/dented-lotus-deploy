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
exports.raceRoutes = [
    {
        method: 'GET',
        path: '/races/{season}/{key?}',
        config: {
            cors: true,
            handler: function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                var season, races, raceKeys, raceRows, _i, raceRows_1, raceRow, race, exception_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            season = Number.parseInt(request.params["season"]);
                            if (isNaN(season)) {
                                reply(Boom.badRequest("Invalid season"));
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            races = [];
                            raceKeys = request.params["key"] ? [request.params["key"]] : [];
                            return [4 /*yield*/, races_1.getRaces(season, raceKeys)];
                        case 2:
                            raceRows = _a.sent();
                            for (_i = 0, raceRows_1 = raceRows; _i < raceRows_1.length; _i++) {
                                raceRow = raceRows_1[_i];
                                race = getRaceResponse(season, raceRow);
                                races.push(race);
                            }
                            reply(races);
                            return [3 /*break*/, 4];
                        case 3:
                            exception_1 = _a.sent();
                            reply(Boom.badRequest(exception_1));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); }
        }
    },
    {
        method: "POST",
        path: "/admin/races/{season}",
        config: {
            cors: true,
            handler: function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                var races, season, _i, races_2, race, success, exception_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            races = request.payload;
                            season = Number.parseInt(request.params["season"]);
                            if (isNaN(season)) {
                                reply(Boom.badRequest("Invalid season"));
                                return [2 /*return*/];
                            }
                            for (_i = 0, races_2 = races; _i < races_2.length; _i++) {
                                race = races_2[_i];
                                if ((!race.track)) {
                                    reply(Boom.badRequest("Need track to save new race"));
                                    return [2 /*return*/];
                                }
                                if (!race.key)
                                    race.key = season + "-" + race.track;
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, races_1.saveRaces(season, races)];
                        case 2:
                            success = _a.sent();
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
        method: "POST",
        path: "/admin/races/{raceKey}/predictions",
        config: {
            cors: true,
            handler: function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                var adds, raceKey, dbAdds, _i, adds_1, add, dbAdd, exception_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            adds = request.payload;
                            raceKey = request.params["raceKey"];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            dbAdds = [];
                            for (_i = 0, adds_1 = adds; _i < adds_1.length; _i++) {
                                add = adds_1[_i];
                                dbAdd = {
                                    race: raceKey,
                                    prediction: add.prediction,
                                    value: add.value
                                };
                                dbAdds.push(dbAdd);
                            }
                            return [4 /*yield*/, predictions_1.updateRacePredictions(raceKey, dbAdds)];
                        case 2:
                            _a.sent();
                            reply({ success: true }).code(201);
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
                scope: ['admin']
            }
        }
    },
    {
        method: "POST",
        path: "/admin/races/{raceKey}/predictions/finals",
        config: {
            cors: true,
            handler: function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                var raceKey, finalPredictionPicks, exception_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            raceKey = request.params["raceKey"];
                            finalPredictionPicks = request.payload;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, races_1.saveFinalRacePredictions(raceKey, finalPredictionPicks)];
                        case 2:
                            _a.sent();
                            reply({ success: true });
                            return [3 /*break*/, 4];
                        case 3:
                            exception_4 = _a.sent();
                            reply(Boom.badRequest(exception_4));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); },
            auth: {
                strategies: ["jwt"],
                scope: ["admin"]
            }
        }
    },
    {
        method: "DELETE",
        path: "/admin/races/predictions/{raceKey}",
        config: {
            cors: true,
            handler: function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                var raceKey, predictionKeys, exception_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            raceKey = request.params["raceKey"];
                            predictionKeys = request.payload;
                            if (!predictionKeys || !predictionKeys.length) {
                                reply("done");
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, predictions_1.deleteRacePredictions(raceKey, predictionKeys)];
                        case 2:
                            _a.sent();
                            reply("done");
                            return [3 /*break*/, 4];
                        case 3:
                            exception_5 = _a.sent();
                            reply(Boom.badRequest(exception_5));
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
    }
];
function getRaceResponse(season, raceRow) {
    var race = {
        key: raceRow.key,
        displayName: raceRow.displayName,
        laps: raceRow.laps,
        qualiDate: raceRow.qualiDate,
        raceDate: raceRow.raceDate,
        cutoff: raceRow.cutoff,
        season: season,
        track: raceRow.track,
        trivia: raceRow.trivia ? JSON.parse(raceRow.trivia) : [],
        winner: raceRow.winner,
        imageUrl: "",
        info: raceRow.info
    };
    return race;
}
//# sourceMappingURL=races.js.map