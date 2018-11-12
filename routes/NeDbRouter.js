const express = require("express");
const nedbservice = require("../services/nedbservice");


const router = express.Router();

router.post("/InsertRandom", async (req, res, next) => {
  let totalTime = await nedbservice.InsertUsers();
  res.send(`Take ${totalTime} to finish`)
});

router.get("/", async (req, res, next) => {
  let min = req.params.min
  let max = req.params.max
  let totalTime = await nedbservice.GetUsers(min, max)
  res.send(`Take ${totalTime} to finish`);
});

router.put("/", async (req, res, next) => {
  let min = req.params.min;
  let max = req.params.max;
  let totalTime = await nedbservice.UpdateUsers(min, max)
  res.send(`Take ${totalTime} to finish`);
});

router.delete("/", async (req, res, next) => {
  let min = req.params.min;
  let max = req.params.max;
  let totalTime = await nedbservice.DeleteUsers(min, max)
  res.send(`Take ${totalTime} to finish`);
});

module.exports = router;
