"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const port = parseInt(process.env.PORT ?? "3000", 10);
app_1.default.listen(port, "0.0.0.0", () => {
    console.log(`API listening on port ${port}`);
});
