const Datastore = require("nedb");
const Users = new Datastore({ filename: "users.db", autoload: true });

const Insert =  (req, res) => {
  let number = req.params.number
  let start = Date.now();
  //console.log(number);
  const run = () => {
    for (let i = 1; i <= number; ++i) {
      
      setImmediate(() => {
        let user = {
          k: i,
          c: makeRandomNumber(), 
          name: {
            c: makeRandomNumber()
          }
        };
        Users.insert(user, err => {
          if (err) console.log(err);
          if (i >= number) {
            let time =  Date.now() - start
            console.log(`Take ${time}`)
            res.send(`Take ${time}`)
          }
        });
          
      });
    }
  }
  run();
  
};
const BulkInsert = (req, res) => {
  let number = req.params.number
  let start = Date.now();

  console.log(number);
  const run = () => {
    
    for (let i = 1; i <= number; i = i+100) {
      let incr = number - i < 100 ? number - i : 100;
      let users = [];
      for (let j = i; j < i + incr; ++j) {
        users.push({
          k: j,
          c: makeRandomNumber(),
          name: {
            c: makeRandomNumber()
          }
        });
      }
      setImmediate(() => {
        Users.insert(users, err => {
          if (err) console.log(err);
          //console.log(i)
          users=[]
          if (i >= number - incr) {
            let time = Date.now() - start
            console.log(`Take ${time}`);
            res.send(`Take ${time}`)
          }
          //users = [];
        });
      });
    }
  };
  run();
};
const Get = async (req, res, cb) => {
  let min = req.params.min
  let max = req.params.max
  let start = Date.now();
  //console.log("Start at: ", start);
  console.log(min + ' ' + max)
  await Users.find({k: {$gte: parseInt(min), $lte: parseInt(max)}}, (err, docs) => {
    if (err) console.log(err);
    console.log(docs.length)
    for(let doc of docs){
      console.log(doc.k + ' '+doc.c)
    }
    console.log(`Total Time: ${Date.now()-start}`)
    res.send(docs)
    
  });  
}
const Update = (req, res) => {
  let min = req.params.min
  let max = req.params.max
  let start = Date.now()
   Users.update(
    { k: { $lte: parseInt(max), $gte: parseInt(min) } },
    { $set: { c: "0" } },
    { multi: true},
    (err, numReplaced) => {
      if (err) console.log(err)
      // for(let doc of docs)
      //   console.log(doc.k + ' ' + doc.c)
      console.log(numReplaced)
      console.log(`Total Time: ${Date.now()-start}`)
      res.send(`Update ${numReplaced} objects`)
      
    }
  );
}
const Delete =  (req, res) => {
  let min = req.params.min
  let max = req.params.max
  let start = Date.now();
   Users.remove(
    { k: { $lte: parseInt(max), $gte: parseInt(min) } },
    { multi: true },
    (err, numRemoved) => {
      if (err) console.log(err)
      console.log(numRemoved)
      console.log(`Total Time: ${Date.now()-start}`)
      res.send(`Delete ${numRemoved} objects`)
    }
  );
  
}
function makeRandomNumber() {
    var text = "";
    var possible = "0123456789";
  
    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
  
module.exports = {
    InsertUsers: Insert,
    BulkInsertUsers: BulkInsert,
    GetUsers: Get,
    UpdateUsers: Update,
    DeleteUsers: Delete
};