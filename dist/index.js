"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./src/app"));
var dotenv_1 = __importDefault(require("dotenv"));
var app_2 = require("firebase/app");
var firebaseConfig_1 = require("./firebaseConfig");
dotenv_1.default.config();
var port = process.env.PORT || 3001;
(0, app_2.initializeApp)(firebaseConfig_1.firebaseConfig);
app_1.default.listen(port, function () {
    console.log("Listening on port=".concat(port));
});
