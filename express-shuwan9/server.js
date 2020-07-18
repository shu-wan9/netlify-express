const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const app = express();
const db = require("./db");
const { clearState, getState, setState } = require("./query");
// const { read } = require('./db')
app.use((req, res, next) => {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-headers", "content-type");
  next();
});
// app.use(bodyParser.urlencoded({ extended: false }))
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
app.get("/", (req, res) => {
  res.send("hi");
});
app.get("/api/exercise/getState", async (req, res) => {
  try {
    const data = await getState();
    res.sendData(data, "查询成功");
  } catch (e) {
    console.log(e);
    res.sendMsg("查询失败");
  }
});
app.post("/api/exercise/setState", async (req, res) => {
  try {
    const { exerciseData } = req.body;
    await setState({
      exerciseData,
    });
    res.sendMsg("成功");
  } catch (e) {
    console.log(e);
    res.sendMsg("失败");
  }
});
app.get("/api/exercise/get", (req, res) => {
  const data = db.read();
  res.header("Content-Type", "application/json;chartset=utf-8");
  res.send({
    code: 10000,
    msg: "查询成功",
    data,
  });
});
app.post("/api/exercise/add", (req, res) => {
  const { sendExerciseData } = req.body;
  console.log(sendExerciseData);
  if (!sendExerciseData) {
    res.sendMsg("任务名必传");
    return;
  }
  try {
    const exerciseData = db.get("exerciseData").value();
    if (exerciseData.some((item) => item === sendExerciseData)) {
      res.sendMsg("任务已存在");
    } else {
      db.defaults({ exerciseData: [] }).write();
      db.set("exerciseData", sendExerciseData).write();
      res.sendMsg("添加成功");
    }
  } catch (e) {
    console.log(e);
    res.sendMsg("添加失败");
  }
});
app.post("/api/exercise/remove", (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.sendMsg("任务名必传");
    return;
  }
  try {
    const todos = db.get("todos").value();
    if (todos.every((item) => item != name)) {
      res.sendMsg("任务不存在");
    } else {
      const index = todos.indexOf(name);
      todos.splice(index, 1);
      db.set("todos", todos).write();
      res.sendMsg("删除成功");
    }
  } catch (e) {
    console.log(e);
    res.sendMsg("删除失败");
  }
});
app.post("/api/exercise/clear", async (req, res) => {
  try {
    await clearState();
    res.sendMsg("清除成功");
  } catch (e) {
    console.log(e);
    res.sendMsg("清除失败");
  }
});
// app.listen(8080)
module.exports = app;
module.exports.handler = serverless(app);
