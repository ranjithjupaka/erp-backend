var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var Enquiry = require("./routes/enquiry");
var Purchase = require("./routes/purchase");
var Admin = require("./routes/admin");
var Client = require('./routes/client')
const passport = require("passport")
const { mongo } = require("./configs/dbConnect");
const bodyParser = require("body-parser");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// DB connection

mongo();

app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.text());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
// app.use("/admin/login", indexRouter);

app.use(passport.initialize());

require('./middlewares/passport')(passport);


app.use("/user", usersRouter);
app.use("/admin/purchase", Purchase);
app.use('/admin/admin', Admin)
app.use('/admin', Enquiry)
app.use('/admin', Client)


const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("server is listening on port: " + port);
});

module.exports = app;
