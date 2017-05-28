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
Object.defineProperty(exports, "__esModule", { value: true });
var Boom = require("boom");
var node_fetch_1 = require("node-fetch");
var users_1 = require("./data/users");
var config_1 = require("../config");
var base64url = require("base64-url");
function verifyUniqueUser(req, res) {
    // Find an entry from the database that
    // matches the email
    var email = req.payload.email;
    users_1.getUsersByEmail([email]).then(function (users) {
        if (users && users.length > 0) {
            var user = users[0];
            if (user) {
                if (user.email === req.payload.email) {
                    res(Boom.badRequest('Email taken'));
                    return;
                }
            }
        }
        // If everything checks out, send the payload through
        // to the route handler
        res(req.payload);
    });
}
exports.verifyUniqueUser = verifyUniqueUser;
function verifyFacebook(token) {
    var fields = ["id", "name", "email", "first_name", "last_name"];
    var urlFields = fields.join("%2C");
    return new Promise(function (resolve, reject) {
        return node_fetch_1.default("https://graph.facebook.com/v2.8/me?access_token=" + token + "&debug=all&fields=" + urlFields + "&format=json&method=get&pretty=0")
            .then(function (response) {
            if (response.ok) {
                return response.json().then(function (json) {
                    resolve(json);
                });
            }
            else {
                reject(new Error(response.statusText));
            }
        }).catch(reject);
    });
}
function verifyGoogleId(token) {
    return new Promise(function (resolve, reject) {
        var GoogleAuth = require('google-auth-library');
        var auth = new GoogleAuth;
        var client = new auth.OAuth2(config_1.GOOGLE_CLIENT_ID, '', '');
        client.verifyIdToken(token, config_1.GOOGLE_CLIENT_ID, 
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
        function (error, login) {
            if (error) {
                console.error(error);
                reject(error);
                return;
            }
            var payload = login.getPayload();
            var userid = payload['sub'];
            // If request specified a G Suite domain:
            //var domain = payload['hd'];
            resolve(payload);
        });
    });
}
function verifyCredentials(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var authPayload, authResponse, _a, googlePayload, facebookPayload, users, key, user, success, exception_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    authPayload = req.payload;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 12, , 13]);
                    authResponse = void 0;
                    _a = authPayload.authType;
                    switch (_a) {
                        case "google": return [3 /*break*/, 2];
                        case "facebook": return [3 /*break*/, 4];
                    }
                    return [3 /*break*/, 6];
                case 2: return [4 /*yield*/, verifyGoogleId(authPayload.auth_token)];
                case 3:
                    googlePayload = _b.sent();
                    authResponse = {
                        email: googlePayload.email,
                        first_name: googlePayload.given_name,
                        last_name: googlePayload.family_name,
                        name: googlePayload.name
                    };
                    return [3 /*break*/, 7];
                case 4: return [4 /*yield*/, verifyFacebook(authPayload.auth_token)];
                case 5:
                    facebookPayload = _b.sent();
                    authResponse = {
                        email: facebookPayload.email,
                        first_name: facebookPayload.first_name,
                        last_name: facebookPayload.last_name,
                        name: facebookPayload.name
                    };
                    return [3 /*break*/, 7];
                case 6:
                    res(Boom.badRequest("Invalid authentication type"));
                    return [2 /*return*/];
                case 7: return [4 /*yield*/, users_1.getUsersByEmail([authResponse.email])];
                case 8:
                    users = _b.sent();
                    if (!(users && users.length > 0)) return [3 /*break*/, 9];
                    // We have a user. So let's return it.
                    res(users[0]);
                    return [2 /*return*/];
                case 9:
                    key = base64url.encode(authResponse.email);
                    user = {
                        key: key,
                        email: authResponse.email,
                        display: authResponse.name,
                        firstName: authResponse.first_name,
                        lastName: authResponse.last_name,
                        role: "user"
                    };
                    return [4 /*yield*/, users_1.saveUser(user)];
                case 10:
                    success = _b.sent();
                    if (!success) {
                        res(Boom.badRequest("Failed to save new user"));
                        return [2 /*return*/];
                    }
                    res(user);
                    _b.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    exception_1 = _b.sent();
                    res(Boom.badRequest(exception_1));
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    });
}
exports.verifyCredentials = verifyCredentials;
//# sourceMappingURL=userFunctions.js.map