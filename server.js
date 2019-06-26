"use strict";
// @flow

import express from "express";
import expressBoom from "express-boom";
import bodyParser from "body-parser";
import timeout from "connect-timeout";
import morgan from "morgan";
import axios from "axios";

const port = process.env.PORT || 5790;

let app = express();

app.use(morgan("dev"));

app.use(bodyParser.json({ limit: "500kb" }));
app.use(expressBoom());
app.use(timeout("5s"));

app.get("/health", (req, res) => res.status(204).send());

const SERVER_TO_PROXY = "https://bobs-epic-drone-shack-inc.herokuapp.com";

const cache = {};

app.all("*", async (req, res) => {
  console.log("asdfasd", req.url);

  const path = req.url;

  const url = `${SERVER_TO_PROXY}${path}`;

  const fetchServerResponse = () => {
    console.log("req");
    return axios.get(url);
  };

  let pollAttempts = 0;
  const pollServerResponse = () => {
    return fetchServerResponse().catch(_err => {
      if (pollAttempts < 4) {
        pollAttempts++;
        return pollServerResponse();
      } else {
        throw new Error("number of polls exceeded");
      }
    });
  };

  console.log("url", url);

  try {
    const response = await pollServerResponse();
    cache[req.url] = response.data;
    res.status(200).send(cache[req.url]);
  } catch (err) {
    if (cache[req.url]) {
      res.status(200).send(cache[req.url]);
    } else {
      res.status(504).send("try again later");
    }
  }
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(500).send(err.message);
  }
});

app.listen(port, () => console.log("listening on port", port));
