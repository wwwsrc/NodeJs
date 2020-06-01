// const argv = require("yargs").argv;
const express = require("express");
const server = express();
const cors = require("cors");
const morgan = require("morgan");
const apiRouter = require("./apiRouter");
const PORT = 3000;

//HW2
const ALLOWED_ORIGIN = "http://localhost:3000";
server.use(cors({ origin: ALLOWED_ORIGIN }));
server.use(morgan("dev"));
server.use(express.json());

server.listen(PORT, () => console.log(`Server APP listening on port ${PORT}!`));

server.use("/api", apiRouter);

//HW1
// console.log("it is started!");
// function invokeAction({ action, id, name, email, phone }) {
//   switch (action) {
//     case "list":
//       console.table(contacts.listContacts());
//       break;

//     case "get":
//       const userGet = contacts.getContactById(id);
//       console.log(userGet);
//       //... id
//       break;

//     case "add":
//       contacts.addContact(name, email, phone);
//       console.log(contacts.listContacts());

//       // ... name email phone
//       break;

//     case "remove":
//       contacts.removeContact(id);
//       console.log(contacts.listContacts());
//       // ... id
//       break;

//     default:
//       console.warn("\x1B[31m Unknown action type!");
//   }
// }
// invokeAction(argv);
