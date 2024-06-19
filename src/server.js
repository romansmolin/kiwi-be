//db config
require("./config/db");

const app = require("express")();
const cors = require("cors");
const bodyParser = require("express").json;
const routes = require("./routes");

//cors
app.use(cors())
//for accepting post form data
app.use(bodyParser());
//registerin routes
app.use(routes);

module.exports = app