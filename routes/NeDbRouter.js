const express = require("express");
const nedbservice = require("../services/nedbservice");
const async = require('async')

const router = express.Router();

router.post("/:number", (req, res, next) => {
  let num = req.params.number
  //console.log(num)
  async.waterfall([nedbservice.InsertUsers(num) 
  , (results) => res.send(results)], (err) => {
    if(err) console.log(err)
    
  })
});

router.post("/bulk/:number", async (req, res, next) => {
  let num = req.params.number
  
  async.waterfall([
    nedbservice.BulkInsertUsers(num)
   
  , (results) => res.send(results)], (err) => {
    if(err) console.log(err)
    
  })
});

router.get("/:min/:max", async (req, res, next) => {
  let min = req.params.min
  let max = req.params.max
  let objs = await nedbservice.GetUsers(min, max)
  res.send(objs);
});

router.put("/:min/:max", async (req, res, next) => {
  let min = req.params.min;
  let max = req.params.max;
  let objs = await nedbservice.UpdateUsers(min, max)
  res.send(objs);
});

router.delete("/:min/:max", async (req, res, next) => {
  let min = req.params.min;
  let max = req.params.max;
  let objs = await nedbservice.DeleteUsers(min, max)
  res.send(objs);
});

module.exports = router;
