"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TrackModel = (function () {
    function TrackModel(trackResponse, context) {
        this.trackResponse = trackResponse;
        this.key = trackResponse.key;
    }
    Object.defineProperty(TrackModel.prototype, "json", {
        get: function () {
            return this.trackResponse;
        },
        enumerable: true,
        configurable: true
    });
    return TrackModel;
}());
exports.TrackModel = TrackModel;
//# sourceMappingURL=Track.js.map