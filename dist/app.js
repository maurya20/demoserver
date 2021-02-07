"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRuter = require("./routes/Users");
const app = express_1.default();
app.use("/", (req, res, next) => {
    res.json({ user: "Mike", age: "77" });
});
app.listen(5000, () => console.log("server is running at port 5000"));
