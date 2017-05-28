"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DriverModel = (function () {
    /**
     *
     */
    function DriverModel(driverResponse, context) {
        this.key = driverResponse.key;
        this.firstName = driverResponse.firstName;
        this.lastName = driverResponse.lastName;
        this.nationality = driverResponse.nationality;
        this.flag = driverResponse.flag;
        this.birthdate = driverResponse.birthdate;
        this.number = driverResponse.number;
        this.abbreviation = driverResponse.abbreviation;
        this.active = driverResponse.active;
        this.trivia = driverResponse.trivia;
        this.wins = driverResponse.wins;
        this.points = driverResponse.points;
        this.team = driverResponse.team && context.getTeam(driverResponse.team);
        this._context = context;
    }
    DriverModel.prototype.update = function () {
        return this._context.saveDriver(this);
    };
    Object.defineProperty(DriverModel.prototype, "display", {
        get: function () {
            return this.name + (this.team && " - " + this.team.name);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DriverModel.prototype, "name", {
        get: function () {
            return this.firstName + " " + this.lastName;
        },
        enumerable: true,
        configurable: true
    });
    DriverModel.prototype.addPoints = function (inPoints) {
        if (inPoints < 0) {
            return;
        }
        this.points += inPoints;
    };
    Object.defineProperty(DriverModel.prototype, "json", {
        get: function () {
            var driver = {
                key: this.key ? this.key : "",
                lastName: this.lastName,
                firstName: this.firstName,
                flag: this.flag,
                abbreviation: this.abbreviation,
                active: this.active,
                birthdate: this.birthdate,
                points: +this.points,
                nationality: this.nationality,
                team: this.team.json.key,
                trivia: this.trivia,
                wins: this.wins
            };
            return driver;
        },
        enumerable: true,
        configurable: true
    });
    return DriverModel;
}());
exports.DriverModel = DriverModel;
//# sourceMappingURL=Driver.js.map