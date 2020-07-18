"use strict";
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");
const serverless = require("serverless-http");
const app = express();

const TARGET = "http://180.76.114.135:8080/api";

const router = express.Router();
app.use(
  "/.netlify/functions/server/api",
  // "/api",
  createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
    pathRewrite: {
      "^/.netlify/functions/server/api": "/",
    },
  })
);
app.use("/", (req, res) => res.sendFile(path.join(__dirname, "../index.html")));

module.exports = app;
module.exports.handler = serverless(app);
