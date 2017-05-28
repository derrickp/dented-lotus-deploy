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
var createUser_1 = require("../utilities/createUser");
var userFunctions_1 = require("../utilities/userFunctions");
var authenticateUserSchema_1 = require("../utilities/authenticateUserSchema");
var token_1 = require("../utilities/token");
var users_1 = require("../utilities/data/users");
var base64url = require("base64-url");
exports.userRoutes = [
    {
        method: 'PUT',
        path: '/users/{key}',
        config: {
            cors: true,
            handler: function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var credentials, isAdmin, key, userPayload, fullUsers, existingUser, newUser, exception_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            credentials = req.auth.credentials;
                            isAdmin = credentials.scope.indexOf('admin') >= 0;
                            key = req.params["key"];
                            // If someone tries to save info for a different user, don't allow it, unless the person saving is an admin
                            if (key !== credentials.key && !isAdmin) {
                                res(Boom.badRequest("cannot save values for a different user"));
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            userPayload = req.payload;
                            return [4 /*yield*/, users_1.getFullUsers([key])];
                        case 2:
                            fullUsers = _a.sent();
                            existingUser = fullUsers[0];
                            if (!existingUser) {
                                res(Boom.badRequest("user key provided was not found"));
                                return [2 /*return*/];
                            }
                            newUser = {
                                key: key,
                                display: userPayload.display ? userPayload.display : existingUser.display,
                                firstName: userPayload.firstName ? userPayload.firstName : existingUser.firstName,
                                lastName: userPayload.lastName ? userPayload.lastName : existingUser.lastName,
                                imageUrl: userPayload.imageUrl ? userPayload.imageUrl : existingUser.imageUrl,
                                faveDriver: userPayload.faveDriver ? userPayload.faveDriver : existingUser.faveDriver,
                                faveTeam: userPayload.faveTeam ? userPayload.faveTeam : existingUser.faveTeam
                            };
                            newUser.role = userPayload.role && isAdmin ? userPayload.role : existingUser.role;
                            newUser.points = userPayload.points && isAdmin ? userPayload.points : existingUser.points;
                            return [4 /*yield*/, users_1.updateUser(newUser)];
                        case 3:
                            _a.sent();
                            res({ success: true });
                            return [3 /*break*/, 5];
                        case 4:
                            exception_1 = _a.sent();
                            console.error(exception_1);
                            res(Boom.badRequest(exception_1));
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
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
        method: 'POST',
        path: '/users',
        config: {
            // Before the route handler runs, verify that
            // the user is unique and assign the result to 'user'
            pre: [
                { method: userFunctions_1.verifyUniqueUser, assign: 'user' }
            ],
            cors: true,
            handler: function (req, res) {
                var user = {
                    key: base64url.encode(req.payload.email)
                };
                user.email = req.payload.email;
                user.display = req.payload.display;
                user.role = "user";
                user.firstName = req.payload.firstName;
                user.lastName = req.payload.lastName;
                users_1.saveUser(user).then(function (success) {
                    if (success) {
                        res({
                            id_token: token_1.createToken(user),
                            user: user
                        }).code(201);
                    }
                    else {
                        res(Boom.badRequest("unable to save user"));
                    }
                }).catch(function (error) {
                    res(Boom.badRequest(error));
                });
            },
            // Validate the payload against the Joi schema
            validate: {
                payload: createUser_1.createUserSchema
            }
        }
    },
    {
        method: 'POST',
        path: '/users/authenticate',
        config: {
            // Check the user's password against the DB
            pre: [
                {
                    method: userFunctions_1.verifyCredentials, assign: 'user'
                }
            ],
            cors: true,
            handler: function (req, res) {
                // If we get here with a user, then we are good to go. Let's issue that token
                // If not, then the error bubbles up from the verify step 
                res({
                    id_token: token_1.createToken(req.pre["user"]),
                    user: req.pre["user"]
                }).code(200);
            },
            validate: {
                payload: authenticateUserSchema_1.authenticateUserSchema
            }
        }
    },
    {
        method: 'DELETE',
        path: '/users/{key}',
        config: {
            cors: true,
            handler: function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var credentials, exception_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            credentials = req.auth.credentials;
                            if (req.params["key"] === credentials.key) {
                                res(Boom.badRequest("cannot delete own user"));
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, users_1.deleteUser(req.params["key"])];
                        case 2:
                            _a.sent();
                            res({ success: true });
                            return [3 /*break*/, 4];
                        case 3:
                            exception_2 = _a.sent();
                            res(Boom.badRequest(exception_2));
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
        method: 'GET',
        path: '/users/{key?}',
        config: {
            cors: true,
            handler: function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var credentials, isAdmin, keys, users, exception_3, users, exception_4, users, exception_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            credentials = req.auth.credentials;
                            isAdmin = credentials.scope.indexOf('admin') >= 0;
                            keys = req.params["key"] ? [req.params["key"]] : [];
                            if (!(keys.length === 1 && keys[0] === credentials.key)) return [3 /*break*/, 5];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, users_1.getFullUsers(keys)];
                        case 2:
                            users = _a.sent();
                            res(users);
                            return [3 /*break*/, 4];
                        case 3:
                            exception_3 = _a.sent();
                            res(Boom.badRequest(exception_3));
                            return [3 /*break*/, 4];
                        case 4: return [3 /*break*/, 13];
                        case 5:
                            if (!isAdmin) return [3 /*break*/, 10];
                            _a.label = 6;
                        case 6:
                            _a.trys.push([6, 8, , 9]);
                            return [4 /*yield*/, users_1.getFullUsers(keys)];
                        case 7:
                            users = _a.sent();
                            res(users);
                            return [3 /*break*/, 9];
                        case 8:
                            exception_4 = _a.sent();
                            res(Boom.badRequest(exception_4));
                            return [3 /*break*/, 9];
                        case 9: return [3 /*break*/, 13];
                        case 10:
                            _a.trys.push([10, 12, , 13]);
                            return [4 /*yield*/, users_1.getUsersByKeys(keys)];
                        case 11:
                            users = _a.sent();
                            res(users);
                            return [3 /*break*/, 13];
                        case 12:
                            exception_5 = _a.sent();
                            res(Boom.badRequest(exception_5));
                            return [3 /*break*/, 13];
                        case 13: return [2 /*return*/];
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
        method: 'GET',
        path: '/allusers',
        config: {
            cors: true,
            handler: function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var users;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, users_1.getAllPublicUsers()];
                        case 1:
                            users = _a.sent();
                            res(users);
                            return [2 /*return*/];
                    }
                });
            }); }
        }
    }
];
//# sourceMappingURL=users.js.map