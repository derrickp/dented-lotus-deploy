"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TeamModel = (function () {
    /**
     *
     */
    function TeamModel(teamResponse) {
        this.key = teamResponse.key;
        this.abbreviation = teamResponse.abbreviation;
        this.headquartersCity = teamResponse.headquartersCity;
        this.name = teamResponse.name;
        this.points = teamResponse.points;
        this.value = this;
    }
    Object.defineProperty(TeamModel.prototype, "display", {
        get: function () {
            return this.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TeamModel.prototype, "json", {
        /**
         * Returns the json of the Team. Does not include driver information.
         */
        get: function () {
            var team = {
                key: this.key,
                name: this.name,
                abbreviation: this.name,
                headquartersCity: this.headquartersCity,
                trivia: this.trivia,
                points: this.points
            };
            return team;
        },
        enumerable: true,
        configurable: true
    });
    TeamModel.prototype.update = function () {
    };
    return TeamModel;
}());
exports.TeamModel = TeamModel;
//# sourceMappingURL=Team.js.map