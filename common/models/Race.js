"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var date_1 = require("../utils/date");
var RaceModel = (function () {
    function RaceModel(race, context) {
        this.raceResponse = race;
        // Putting here for ease of use
        this.key = race.key;
        if (race.raceDate) {
            this.raceDate = race.raceDate;
        }
        if (race.qualiDate)
            this.qualiDate = race.qualiDate;
        if (race.cutoff) {
            this.cutoff = race.cutoff;
        }
        else {
            this.cutoff = this.raceDate;
        }
        var d = date_1.getDurationFromNow(this.cutoff);
        this.complete = d.timeRemaining <= 0;
        this.imageUrl = race.imageUrl;
        this._context = context;
    }
    Object.defineProperty(RaceModel.prototype, "winner", {
        get: function () {
            return this._context.getDriver(this.raceResponse.winner);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RaceModel.prototype, "track", {
        get: function () {
            return this._context.getTrack(this.raceResponse.track);
        },
        enumerable: true,
        configurable: true
    });
    RaceModel.prototype.refresh = function () {
        return this._context.refresh(this).then(function (raceResponse) {
        });
    };
    RaceModel.prototype.save = function () {
        if (!this._context || !this._context.saveRace) {
            return Promise.reject(new Error("Need valid context to save"));
        }
        return this._context.saveRace(this);
    };
    Object.defineProperty(RaceModel.prototype, "json", {
        get: function () {
            var raceResponse = {
                key: this.raceResponse.key,
                trivia: this.raceResponse.trivia,
                track: this.track ? this.track.key : null,
                season: this.raceResponse.season,
                laps: this.raceResponse.laps,
                qualiDate: this.qualiDate ? this.qualiDate.toString() : null,
                raceDate: this.raceDate ? this.raceDate.toString() : null,
                displayName: this.raceResponse.displayName,
                winner: this.winner ? this.winner.key : null,
                imageUrl: "",
                info: this.info
            };
            return raceResponse;
        },
        enumerable: true,
        configurable: true
    });
    return RaceModel;
}());
exports.RaceModel = RaceModel;
//# sourceMappingURL=Race.js.map