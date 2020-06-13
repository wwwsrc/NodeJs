const mongoose = require("mongoose");
const { Schema } = mongoose;
mongoose.set("useFindAndModify", false);

const userSchema = new Schema(
  {
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    subscription: {
      type: String,
      enum: ["free", "pro", "premium"],
      default: "free",
    },
    avatarURL: { type: String, required: false },
    token: { type: String, required: false },
  },
  { timestamps: true }
);

userSchema.statics.findByEmail = findByEmail;
userSchema.statics.createUser = createUser;
userSchema.statics.updateUser = updateUser;
userSchema.statics.findByToken = findByToken;

async function findByToken(token) {
  return this.findOne({ token });
}
async function findByEmail(email) {
  return this.findOne({ email });
}
async function createUser(email, passwordHash, subscription, avatarURL) {
  return this.create({ email, passwordHash, subscription, avatarURL });
}
async function updateUser(id, setToken) {
  return this.findByIdAndUpdate(id, { $set: setToken }, { new: true });
}

export const UserModel = mongoose.model("User", userSchema);
