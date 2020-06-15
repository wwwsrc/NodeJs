const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
require = require("esm")(module);

const Server = require("./server");
new Server().start();
