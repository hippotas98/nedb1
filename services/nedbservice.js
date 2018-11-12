const Datastore = require("nedb");
const Users = new Datastore({ filename: "users.db", autoload: true });

const InsertSampleUsers = async (start,limit) => {
    let listUsers = []
    for(var i = start;i<=limit;++i){
        let randomName = "Hello";
        let randomNumber = i;
        let user = {
            Name: randomName,
            _id: randomNumber,
            Class: {
                _id: randomNumber,
                userId: randomNumber
            }
        }
        listUsers.push(user);
    }
    let startTime = Date.now();
    await Users.insert(listUsers, (err, docs) => {
        docs.forEach(d => {
          //console.log(d.Phone)
        });
      });
    return Date.now()-startTime;
}
const Insert = async () => {
    let start = 1;
    let userNumPerInsert = 100000;
    var totalMilSeconds = 0;
    for(start, totalMilSeconds; start < 100000000; start += userNumPerInsert ){
      let time = await InsertSampleUsers(start, start - 1 + userNumPerInsert)
      totalMilSeconds += time;
      console.log(`Start: ${start}, Take: ${totalMilSeconds}`)
    }
    return totalMilSeconds;
}
const Get = async(min, max) => {
  let start = Date.now();
  var iter = 0;
  console.log("Start at: ", start);
  await Users.find({ _id: { $lte: max, $gte: min } }, (err, docs) => {
    docs.forEach(d => {
      console.log(d._id, " ", d.Name);
      //iter += 1
    });
    iter = docs.length;
    if (err) console.log(err);
  });
  let end = Date.now();
  return end - start;
}
const Update = async(min, max) => {
  let start = Date.now();
  console.log("Start at: ", start);
  await Users.update(
    { _id: { $lte: max, $gte: min } },
    { $set: { Name: "Updated" } },
    (err, docs) => {
      docs.forEach(d => {
        console.log(d._id, " ", d.Name);
        // iter += 1
      });
      console.log(docs.length)
      if (err) console.log(err)
    }
  );
  let end = Date.now()
  return end - start
}
const Delete = async (min, max) => {
      let start = Date.now()
  console.log("Start at: ", start)
  await Users.remove(
    { _id: { $lte: max, $gte: min } },
    { multi: true },
    (err, docs) => {
      docs.forEach(d => {
        console.log(d._id, " ", d.Name);
        // iter += 1
      });
      console.log(docs.length)
      if (err) console.log(err)
    }
  );
  let end = Date.now();
  return end - start
}
function makeRandomNumber() {
    var text = "";
    var possible = "0123456789";
  
    for (var i = 0; i < 2; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
  
module.exports = {
    InsertUsers: Insert,
    GetUsers: Get,
    UpdateUsers: Update,
    DeleteUsers: Delete
};