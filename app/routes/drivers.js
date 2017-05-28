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
exports.driverRoutes = [
    {
        method: 'GET',
        path: '/drivers/{key?}',
        config: {
            cors: true,
            handler: function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                var keys, drivers, exception_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            keys = request.params["key"] ? [request.params["key"]] : [];
                            return [4 /*yield*/, drivers_1.getDriverResponses(false, keys)];
                        case 1:
                            drivers = _a.sent();
                            reply(drivers);
                            return [3 /*break*/, 3];
                        case 2:
                            exception_1 = _a.sent();
                            reply(Boom.badRequest(exception_1));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); }
        }
    },
    {
        method: 'GET',
        path: '/drivers/active/{key?}',
        config: {
            cors: true,
            handler: function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                var drivers;
                return __generator(this, function (_a) {
                    try {
                        drivers = drivers_1.getDriverResponses(true, [request.params["key"]]);
                        reply(drivers);
                    }
                    catch (exception) {
                        reply(Boom.badRequest(exception));
                    }
                    return [2 /*return*/];
                });
            }); }
        }
    },
    {
        method: "PUT",
        path: "/admin/drivers/{key}",
        config: {
            cors: true,
            handler: function (request, reply) {
                var driver = request.payload;
                drivers_1.saveDrivers([driver]).then(function (success) {
                    return drivers_1.getDrivers(false, [driver.key]);
                }).then(function (driver) {
                    reply(driver);
                }).catch(function (error) {
                    reply(Boom.badRequest(error.message)).code(400);
                });
            },
            auth: {
                strategies: ['jwt'],
                scope: ['admin']
            }
        }
    },
    {
        method: "POST",
        path: "/admin/drivers",
        config: {
            cors: true,
            handler: function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                var drivers, _i, drivers_2, driver, success, driverKeys, newDrivers, exception_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            drivers = request.payload;
                            for (_i = 0, drivers_2 = drivers; _i < drivers_2.length; _i++) {
                                driver = drivers_2[_i];
                                if (!driver.lastName) {
                                    reply(Boom.badRequest("need a driver last name"));
                                    return [2 /*return*/];
                                }
                                driver.key = driver.lastName.toLowerCase();
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, drivers_1.saveDrivers(drivers)];
                        case 2:
                            success = _a.sent();
                            driverKeys = drivers.map(function (d) { return d.key; });
                            return [4 /*yield*/, drivers_1.getDriverResponses(false, driverKeys)];
                        case 3:
                            newDrivers = _a.sent();
                            reply(newDrivers);
                            return [3 /*break*/, 5];
                        case 4:
                            exception_2 = _a.sent();
                            reply(Boom.badRequest(exception_2));
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
    }
];
//# sourceMappingURL=drivers.js.map