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
var users_1 = require("./users");
var db = new sqlite3.Database('app/Data/' + process.env.DBNAME);
var blogSelect = "select * from blogs_vw";
function getBlogResponses() {
    return __awaiter(this, void 0, void 0, function () {
        var basicUsers, blogs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, users_1.getUsersByEmail()];
                case 1:
                    basicUsers = _a.sent();
                    if (!basicUsers || !basicUsers.length) {
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            try {
                                db.all(blogSelect, function (err, blogRows) {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    var blogs = [];
                                    var _loop_1 = function (blogRow) {
                                        var user = basicUsers.filter(function (basicUser) { return basicUser.key === blogRow.author; })[0];
                                        if (!user) {
                                            return "continue";
                                        }
                                        var blog = {
                                            message: blogRow.message,
                                            imageUrl: blogRow.imageUrl,
                                            postDate: blogRow.postDate,
                                            title: blogRow.title,
                                            author: user
                                        };
                                        blogs.push(blog);
                                    };
                                    for (var _i = 0, blogRows_1 = blogRows; _i < blogRows_1.length; _i++) {
                                        var blogRow = blogRows_1[_i];
                                        _loop_1(blogRow);
                                    }
                                    resolve(blogs);
                                });
                            }
                            catch (exception) {
                                reject(exception);
                            }
                        })];
                case 2:
                    blogs = _a.sent();
                    return [2 /*return*/, blogs];
            }
        });
    });
}
exports.getBlogResponses = getBlogResponses;
function saveNewBlog(blog) {
    return new Promise(function (resolve, reject) {
        var insert = "\n        INSERT INTO blogs\n        (message, title, userkey, postdate)\n        VALUES (?1, ?2, ?3, ?4)";
        try {
            var valuesObject = {
                1: blog.message,
                2: blog.title,
                3: blog.author.key,
                4: blog.postDate
            };
            db.run(insert, valuesObject);
            resolve(true);
        }
        catch (exception) {
            reject(exception);
        }
    });
}
exports.saveNewBlog = saveNewBlog;
//# sourceMappingURL=blogs.js.map