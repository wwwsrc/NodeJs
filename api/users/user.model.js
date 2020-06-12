// import mongoose, { Schema } from "mongoose";

const mongoose = require("mongoose");
const { Schema } = mongoose;
mongoose.set("useFindAndModify", false);

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
});

userSchema.statics.createUser = createUser;
userSchema.statics.getAllUsers = getAllUsers;
userSchema.statics.getUserById = getUserById;
userSchema.statics.updateUser = updateUser;
userSchema.statics.deleteUser = deleteUser;

//Collection name -> contacts
const UserModel = mongoose.model("Contact", userSchema);
async function createUser(userParams) {
  return this.create(userParams);
}

async function getAllUsers() {
  return this.find();
}

async function getUserById(userId) {
  return this.findById(userId);
}

async function updateUser(userId, userParams) {
  return this.findByIdAndUpdate(
    userId,
    {
      $set: userParams,
    },
    { new: true }
  );
}

async function deleteUser(userId) {
  return this.findByIdAndDelete(userId);
}

module.exports = UserModel;
