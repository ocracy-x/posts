"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var app_1 = __importDefault(require("./src/app"));
var inversify_express_utils_1 = require("inversify-express-utils");
dotenv_1.default.config();
var port = process.env.PORT || 3001;
(0, inversify_express_utils_1.cleanUpMetadata)();
app_1.default.listen(port, function () {
    console.log("Listening on port=".concat(port));
});
