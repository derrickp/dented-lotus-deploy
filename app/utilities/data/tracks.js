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
var db = new sqlite3.Database('app/Data/' + process.env.DBNAME);
var trackSelect = "SELECT * from tracks_vw";
function getTrackResponses(keys) {
    return __awaiter(this, void 0, void 0, function () {
        var trackRows, tracks, _i, trackRows_1, trackRow, track;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getTracks(keys)];
                case 1:
                    trackRows = _a.sent();
                    tracks = [];
                    for (_i = 0, trackRows_1 = trackRows; _i < trackRows_1.length; _i++) {
                        trackRow = trackRows_1[_i];
                        track = {
                            key: trackRow.key,
                            latitude: trackRow.latitude,
                            longitude: trackRow.longitude,
                            name: trackRow.name,
                            country: trackRow.country,
                            trivia: trackRow.trivia ? JSON.parse(trackRow.trivia) : [],
                            length: trackRow.length,
                            title: trackRow.title,
                            info: trackRow.info,
                            image: trackRow.image
                        };
                        tracks.push(track);
                    }
                    return [2 /*return*/, tracks];
            }
        });
    });
}
exports.getTrackResponses = getTrackResponses;
function saveTracks(tracks) {
    return new Promise(function (resolve, reject) {
        try {
            var insert_1 = "INSERT OR REPLACE INTO tracks (key, name, country, title, latitude, longitude, trivia, tracklength, description, info) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)";
            db.serialize(function () {
                db.exec("BEGIN;", function (beginError) {
                    if (beginError) {
                        reject(beginError);
                        return;
                    }
                    tracks.forEach(function (track) {
                        var valuesObject = {
                            1: track.key,
                            2: track.name,
                            3: track.country,
                            4: track.title,
                            5: track.latitude,
                            6: track.longitude,
                            7: track.trivia ? JSON.stringify(track.trivia) : "",
                            8: track.length,
                            9: track.description,
                            10: track.info
                        };
                        db.run(insert_1, valuesObject);
                    });
                    db.exec("COMMIT;", function (err) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(true);
                    });
                });
            });
        }
        catch (exception) {
            console.error(exception);
            db.exec("ROLLBACK;");
            reject(exception);
        }
    });
}
exports.saveTracks = saveTracks;
function getTracks(keys) {
    return new Promise(function (resolve, reject) {
        var statement = trackSelect;
        if (keys && keys.length) {
            var innerKeys = keys.join("','");
            statement = statement + (" where key IN ('" + innerKeys + "')");
        }
        db.all(statement, function (err, rows) {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}
exports.getTracks = getTracks;
//# sourceMappingURL=tracks.js.map