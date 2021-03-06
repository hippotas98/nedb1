var createError = require("http-errors");
var express = require("express");

var nedbRouter = require(`./routes/NeDbRouter`);
var app = express();

// view engine setup

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/nedb", nedbRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  
});

app.listen(8000, () => console.log("Listern on port 8000"));
module.exports = app;
