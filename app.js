// A lot of the code for this came from https://auth0.com/blog/2016/03/07/hapijs-authentication-secure-your-api-with-json-web-tokens/
// Specifically mostly the code around the security bits.
// To access secured routes, an Authorization header must be set. 
// ex: Authorization: Bearer <TOKEN>
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var hapi_1 = require("hapi");
var config_1 = require("./app/config");
var hapiAuthJwt = require("hapi-auth-jwt");
// Routes import
var races_1 = require("./app/routes/races");
var predictions_1 = require("./app/routes/predictions");
var drivers_1 = require("./app/routes/drivers");
var users_1 = require("./app/routes/users");
var blogs_1 = require("./app/routes/blogs");
var tracks_1 = require("./app/routes/tracks");
var teams_1 = require("./app/routes/teams");
var picks_1 = require("./app/routes/picks");
var scores_1 = require("./app/routes/scores");
// Start the server
var PORT = process.env.PORT || 8080;
var server = new hapi_1.Server();
server.connection({ port: PORT });
server.register([{
        register: hapiAuthJwt,
        options: {}
    }, {
        register: require('inert'),
        options: {}
    }], function (err) {
    if (err) {
        throw err;
    }
    server.auth.strategy('jwt', 'jwt', {
        key: config_1.key,
        verifyOptions: { algorithms: ['HS256'] }
    });
});
server.route(races_1.raceRoutes);
server.route(predictions_1.predictionsRoutes);
server.route(drivers_1.driverRoutes);
server.route(users_1.userRoutes);
server.route(blogs_1.blogRoutes);
server.route(tracks_1.trackRoutes);
server.route(teams_1.teamRoutes);
server.route(picks_1.pickRoutes);
server.route(scores_1.scoreRoutes);
server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: 'dist',
            redirectToSlash: false,
            index: true
        }
    }
});
server.start(function (err) {
    if (err) {
        throw err;
    }
    console.log('server running on port ' + PORT);
});
//# sourceMappingURL=app.js.map