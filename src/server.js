//db config
require("./config/db");

const app = require("express")();
const cors = require("cors");
const bodyParser = require("express").json;
const cookieParser = require("cookie-parser");
const routes = require("./routes");

//cors
//kiwi-psi.vercel.app/
https: app.use(
  cors({
    origin: ["http://localhost:3000", "https://kiwi-psi.vercel.app"],
    credentials: true, // Allow credentials
  })
);
//for accepting post form data
app.use(bodyParser());
app.use(cookieParser());
//registerin routes
app.use(routes);

module.exports = app;
