//could be deleted

const user = {
  name: "Alex",
  age: 34,
};

const user2 = {
  name: "vasya",
};
console.log("path to dir here", __dirname);

module.exports = {
  user: user,
  sayHello() {
    console.log("hi!");
  },
};
