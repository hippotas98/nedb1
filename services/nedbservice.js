const Datastore = require("nedb");
const Users = new Datastore({ filename: "users.db", autoload: true });

const Insert =  number => {
  let start = Date.now();
  let objs = [];
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
            objs.push(user);
            console.log(`Take ${Date.now() - start}`);
            return objs;
          }
        });
          
      });
    }
  }
  run();
  
};
const BulkInsert = number => {
  let start = Date.now();
  let objs = [];

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
            console.log(`Take ${Date.now() - start}`);
            return objs;
          }
          //users = [];
        });
      });
    }
  };
  run();
};
const Get = async (min, max) => {
  let start = Date.now();
  //console.log("Start at: ", start);
  console.log(min + ' ' + max)
  await Users.find({ 'k': {$gte: min, $lte: max} }, (err, docs) => {
    if (err) console.log(err);
    console.log(docs.length)
    for(let doc of docs){
      console.log(doc.k + ' '+doc.c)
    }
    
    console.log(`Total Time: ${Date.now()-start}`)
    return docs;
  });  
}
const Update = (min, max) => {
  let objs = []
  let start = Date.now()
   Users.update(
    { k: { $lte: max, $gte: min } },
    { $set: { c: "0" } },
    (err, docs) => {
      docs.forEach(d => {
        console.log(d.c);
        // iter += 1
        objs += d
      });
      console.log(docs.length)
      console.log(`Total Time: ${Date.now()-start}`)
      return docs;
      if (err) console.log(err)
    }
  );
}
const Delete =  (min, max) => {
  let start = Date.now();
   Users.remove(
    { k: { $lte: max, $gte: min } },
    { multi: true },
    (err, docs) => {
      docs.forEach(d => {
        console.log(d.k, " ", d.c);
        // iter += 1
      });
      console.log(docs.length)
      if (err) console.log(err)
      console.log(`Total Time: ${Date.now()-start}`)
      return true;
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