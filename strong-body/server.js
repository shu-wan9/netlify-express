"use strict";
const express = require("express");
const path = require("path");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");
const got = require("got");

const TARGET = "http://180.76.114.135:8080/api";
const GET_URL = "/exercise/getState";
const POST_URL = "/exercise/setState";

async function getState() {
  return got.get(TARGET + GET_URL).then((res) => {
    return res.body;
  });
}
async function setState(exerciseData) {
  const options = {
    json: {
      exerciseData,
    },
    responseType: "json",
  };
  return got.post(TARGET + POST_URL, options).then((res) => res.body);
}

const router = express.Router();
router.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>Hello from Express.js!</h1>");
  res.end();
});
router.get(GET_URL, async (req, res) => {
  try {
    const data = await getState();
    res.send(JSON.parse(data));
  } catch (e) {
    console.log(e);
    res.sendMsg("查询失败");
  }
});
router.post(POST_URL, async (req, res) => {
  try {
    const { exerciseData } = req.body;
    await setState(exerciseData);
    res.sendMsg("成功");
  } catch (e) {
    console.log(e);
    res.sendMsg("失败");
  }
});
app.use((req, res, next) => {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-headers", "content-type");
  next();
});
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.sendMsg = function (msg) {
    res.set("Content-Type", "application/json;chartset=utf-8");
    res.json({
      code: 100,
      msg,
    });
  };
  res.sendData = function (data, msg = "查询成功") {
    res.set("Content-Type", "application/json;chartset=utf-8");
    res.json({
      code: 100,
      msg,
      data,
    });
  };
  next();
});
app.use("/.netlify/functions/server/api", router); // path must route to lambda

app.use("/", (req, res) => res.sendFile(path.join(__dirname, "../index.html")));

module.exports = app;
module.exports.handler = serverless(app);
