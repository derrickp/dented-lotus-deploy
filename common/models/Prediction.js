"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PredictionResponse_1 = require("../responses/PredictionResponse");
var PredictionModel = (function () {
    function PredictionModel(response, modifiers, context) {
        this.predictionResponse = response;
        this.choices = modifiers.map(function (modifier) {
            if (response.type === PredictionResponse_1.PredictionTypes.DRIVER) {
                var driver = context.getDriver(modifier.choice);
                return {
                    display: driver.display,
                    key: driver.key,
                    multiplier: modifier.modifier ? modifier.modifier : 1.0
                };
            }
            var team = context.getTeam(modifier.choice);
            return {
                display: team.display,
                key: team.key,
                multiplier: modifier.modifier ? modifier.modifier : 1.0
            };
        });
        this._context = context;
    }
    PredictionModel.prototype.saveUserPicks = function () {
        return this._context.saveUserPicks(this);
    };
    Object.defineProperty(PredictionModel.prototype, "json", {
        get: function () {
            return this.predictionResponse;
        },
        enumerable: true,
        configurable: true
    });
    return PredictionModel;
}());
//Errors 
PredictionModel.CHOICE_NOT_FOUND_ERROR = new Error("ChoiceNotFound");
exports.PredictionModel = PredictionModel;
//# sourceMappingURL=Prediction.js.map