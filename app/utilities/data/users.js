"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sqlite3 = require("sqlite3");
var db = new sqlite3.Database('app/Data/' + process.env.DBNAME);
var userSelect = "select * from full_user_vw";
var allPublicUsersSelect = "select * from public_users_vw";
var userInsert = "INSERT INTO users (key, email, displayname, firstname, lastname, role, points, imageurl)";
function getUsersByEmail(emails) {
    return new Promise(function (resolve, reject) {
        var statement = userSelect;
        if (emails && emails.length) {
            var innerEmails = emails.join("','");
            statement = statement + (" where email IN ('" + innerEmails + "')");
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
exports.getUsersByEmail = getUsersByEmail;
function getFullUsers(keys) {
    return new Promise(function (resolve, reject) {
        var statement = userSelect;
        if (keys && keys.length > 0) {
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
exports.getFullUsers = getFullUsers;
function getAllPublicUsers() {
    return new Promise(function (resolve, reject) {
        var statement = allPublicUsersSelect;
        db.all(statement, function (err, rows) {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}
exports.getAllPublicUsers = getAllPublicUsers;
function getUsersByKeys(keys) {
    return new Promise(function (resolve, reject) {
        var statement = userSelect;
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
exports.getUsersByKeys = getUsersByKeys;
function deleteUser(key) {
    return new Promise(function (resolve, reject) {
        var deleteStatement = "DELETE FROM users where key = '" + key + "'";
        db.run(deleteStatement, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        });
    });
}
exports.deleteUser = deleteUser;
function saveUser(user) {
    return new Promise(function (resolve, reject) {
        if (!user) {
            reject(new Error("must have a user to save"));
            return;
        }
        var valuesStatement = "VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8);";
        var valuesObject = {
            1: user.key,
            2: user.email,
            3: user.display ? user.display : "",
            4: user.firstName ? user.firstName : "",
            5: user.lastName ? user.lastName : "",
            6: user.role,
            7: user.points ? user.points : 0,
            8: user.imageUrl
        };
        var insertStatement = userInsert + " " + valuesStatement;
        db.run(insertStatement, valuesObject, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        });
    });
}
exports.saveUser = saveUser;
function updateUser(user) {
    return new Promise(function (resolve, reject) {
        if (!user) {
            reject(new Error("must have a user to update"));
            return;
        }
        var updateStatement = "UPDATE users SET ";
        var updateFields = [];
        var updateObject = {};
        if (user.display) {
            updateFields.push("displayname = ?1");
            updateObject[1] = user.display;
        }
        if (user.firstName) {
            updateFields.push("firstname = ?2");
            updateObject[2] = user.firstName;
        }
        if (user.lastName) {
            updateFields.push("lastname = ?3");
            updateObject[3] = user.lastName;
        }
        if (user.role) {
            updateFields.push("role = ?4");
            updateObject[4] = user.role;
        }
        if (user.points != undefined) {
            updateFields.push("points = ?5");
            updateObject[5] = user.points;
        }
        if (user.imageUrl) {
            updateFields.push("imageurl = ?6");
            updateObject[6] = user.imageUrl;
        }
        if (user.faveDriver) {
            updateFields.push("favedriver = ?7");
            updateObject[7] = user.faveDriver;
        }
        if (user.faveTeam) {
            updateFields.push("faveteam = ?8");
            updateObject[8] = user.faveTeam;
        }
        if (user.numCorrectPicks >= 0) {
            updateFields.push("numcorrectpicks = ?9");
            updateObject[9] = user.numCorrectPicks;
        }
        if (user.position >= 0) {
            updateFields.push("position = ?10");
            updateObject[10] = user.position;
        }
        if (user.positionChange !== undefined || user.positionChange !== null) {
            updateFields.push("positionchange = ?11");
            updateObject[11] = user.positionChange;
        }
        if (!updateFields.length) {
            reject("nothing to update");
            return;
        }
        var fieldStatement = updateFields.join(",");
        updateStatement += fieldStatement;
        var where = " WHERE key = ?12";
        updateObject[12] = user.key;
        updateStatement += where;
        db.run(updateStatement, updateObject, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        });
    });
}
exports.updateUser = updateUser;
//# sourceMappingURL=users.js.map