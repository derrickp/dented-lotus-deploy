"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var numbers_1 = require("../utils/numbers");
var images_1 = require("../utils/images");
var roles_1 = require("../roles");
var User = (function () {
    function User(dentedLotusUser, id_token, context) {
        this._loggedIn = false;
        if (!dentedLotusUser) {
            this._loggedIn = false;
            return;
        }
        this.key = dentedLotusUser.key;
        this.display = dentedLotusUser.display;
        if (dentedLotusUser.role === roles_1.UserRoles.ADMIN) {
            this.isAdmin = true;
        }
        this.email = dentedLotusUser.email;
        this.firstName = dentedLotusUser.firstName;
        this.lastName = dentedLotusUser.lastName;
        this.imageUrl = dentedLotusUser.imageUrl;
        this.faveDriver = dentedLotusUser.faveDriver;
        this.faveTeam = dentedLotusUser.faveTeam;
        this.numCorrectPicks = dentedLotusUser.numCorrectPicks;
        this.display = dentedLotusUser.display;
        this.position = dentedLotusUser.position;
        this.points = dentedLotusUser.points;
        this.positionChange = dentedLotusUser.positionChange;
        this._loggedIn = true;
        this.id_token = id_token;
        this._context = context;
    }
    User.prototype.save = function () {
        if (!this._context) {
            return Promise.reject(new Error("need context"));
        }
        return this._context.saveUser(this);
    };
    Object.defineProperty(User.prototype, "isLoggedIn", {
        get: function () {
            return this._loggedIn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "name", {
        get: function () {
            if (this.display)
                return this.display;
            return this.firstName + " " + this.lastName.substr(0, 1) + ".";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "json", {
        get: function () {
            return {
                key: this.key,
                display: this.display,
                lastName: this.lastName,
                email: this.email,
                firstName: this.firstName,
                imageUrl: this.usingDefaultImage ? "" : this.imageUrl,
                faveDriver: this.faveDriver,
                faveTeam: this.faveTeam
            };
        },
        enumerable: true,
        configurable: true
    });
    User.prototype.setDefaultImage = function () {
        var num = numbers_1.getRandomInt(0, 2);
        this.imageUrl = images_1.DEFAULT_IMAGES[num];
        this.usingDefaultImage = true;
    };
    User.prototype.logOut = function () {
        console.log("Not Implemented");
        return Promise.resolve(false);
    };
    return User;
}());
exports.User = User;
var GoogleUser = (function (_super) {
    __extends(GoogleUser, _super);
    function GoogleUser(googleUser, dentedLotusUser, id_token, context) {
        var _this = _super.call(this, dentedLotusUser, id_token, context) || this;
        var profile = googleUser.getBasicProfile();
        _this.email = _this.email || profile.getEmail();
        _this.firstName = _this.firstName || profile.getGivenName();
        _this.lastName = _this.lastName || profile.getFamilyName();
        _this._loggedIn = true;
        if (!_this.imageUrl) {
            _this.setDefaultImage();
        }
        // !TEMP! just for testing purposes
        window["googleLogOut"] = _this.logOut;
        return _this;
    }
    GoogleUser.prototype.logOut = function () {
        return new Promise(function (resolve, reject) {
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
                console.log('User signed out.');
                resolve(true);
            }, function (reason) {
                reject(new Error(reason));
            });
        });
    };
    return GoogleUser;
}(User));
exports.GoogleUser = GoogleUser;
var FacebookUser = (function (_super) {
    __extends(FacebookUser, _super);
    function FacebookUser(fbResponse, dentedLotusUser, id_token, context) {
        var _this = _super.call(this, dentedLotusUser, id_token, context) || this;
        _this.authToken = fbResponse.authResponse.accessToken;
        // We could maybe get some facebook info here if we wanted it.
        _this._loggedIn = true;
        if (!_this.imageUrl) {
            _this.setDefaultImage();
        }
        return _this;
    }
    FacebookUser.prototype.logOut = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            FB.logout(function (response) {
                _this._loggedIn = false;
                resolve(true);
            });
        });
    };
    return FacebookUser;
}(User));
exports.FacebookUser = FacebookUser;
//# sourceMappingURL=User.js.map