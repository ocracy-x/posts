"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var helmet_1 = __importDefault(require("helmet"));
var morgan_1 = __importDefault(require("morgan"));
var inversify_1 = require("inversify");
var inversify_express_utils_1 = require("inversify-express-utils");
// load repos
var profiles_repo_1 = require("./profiles/profiles.repo");
// inject dependencies
var container = new inversify_1.Container();
container.bind(profiles_repo_1.ProfilesRepo).to(profiles_repo_1.FirestoreProfilesRepo);
// load controllers
require("./profiles/profiles.controller");
// build server
var server = new inversify_express_utils_1.InversifyExpressServer(container, null, {
    rootPath: '/api',
});
// inject middleware
server.setConfig(function (app) {
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use((0, helmet_1.default)());
    app.use((0, morgan_1.default)('tiny'));
});
// build server
var app = server.build();
exports.default = app;
