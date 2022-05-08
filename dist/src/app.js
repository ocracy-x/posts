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
var comments_repo_1 = require("./comments/comments_repo");
var communities_repo_1 = require("./communities/communities.repo");
// load services
var comments_service_1 = require("./comments/comments_service");
// load controllers
require("./comments/comments_controller");
require("./communities/communities.controller");
// inject dependencies
var container = new inversify_1.Container();
container.bind(comments_repo_1.FirebaseCommentsRepo).toSelf();
container.bind(communities_repo_1.CommunitiesRepo).to(communities_repo_1.CommunitiesFirestore);
container.bind(comments_service_1.CommentsService).to(comments_service_1.RedisCommentsService);
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
// export server
var app = server.build();
exports.default = app;
