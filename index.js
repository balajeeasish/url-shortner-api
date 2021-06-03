const express = require("express");
const app = express();
const cors = require("cors");
const AppConstants = require("./App.constants");
const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const urlsModel = require("./urls.model");

app.use(cors());

app.use(express.json());

mongoose.connect(
  AppConstants.DB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (error) {
    if (error) {
      console.log("MongoDB connection error:!" + error);
    } else {
      console.log("MongoDB connected");
    }
  }
);

app.get("/", (req, res) => {
  res.send("Service is connected");
});

app.post("/urls", async (req, res) => {
  const { longURL } = req.body;
  console.log("longURL", longURL);
  console.log("req.body", req.body);
  let originalUrl;
  try {
    originalUrl = new URL(longURL);
  } catch (err) {
    return res.status(400).send({ errorMessage: "Invalid URL" });
  }
  try {
    const shortUrlAlreadyExists = await urlsModel.findOne({ longURL }).exec();
    if (shortUrlAlreadyExists) {
      res.send({
        longURL: shortUrlAlreadyExists.longURL,
        shortId: shortUrlAlreadyExists.shortId,
      });
    } else {
      const shortId = nanoid();
      const newUrlsRecord = new urlsModel({
        longURL,
        shortId,
      });
      const data = await newUrlsRecord.save();
      res.send({
        longURL: data.longURL,
        shortId: data.shortId,
      });
    }
  } catch (err) {
    return res.status(400).send({
      errorMessage: "Error in generating Short Url. Please try again..",
    });
  }
});

app.get("/urls/:short_id", async (req, res) => {
  const shortId = req.params.short_id;
  try {
    const data = await urlsModel.findOne({ shortId }).exec();
    console.log("data is", data);
    if (data) {
      res.send({
        longURL: data.longURL,
        shortId: data.shortId,
      });
    } else {
      return res.status(400).send({
        errorMessage:
          "Long URL doesnot exist for given short URL. PLease create a new one..",
      });
    }
  } catch (error) {
    return res.status(400).send({
      errorMessage: "Error in fetching data. Please try again",
    });
  }
});

const port = AppConstants.APP_PORT;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
