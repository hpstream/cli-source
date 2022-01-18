"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Bundle_1 = __importDefault(require("./Bundle"));
// import fs from 'fs';
module.exports = gulpSource;
function gulpSource(entry, filename) {
    // TODO\
    var bundle = new Bundle_1.default({ entry: entry });
    bundle.build(filename);
}
