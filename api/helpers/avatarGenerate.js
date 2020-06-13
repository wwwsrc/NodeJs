// const path = require("path");
const Avatar = require("avatar-builder");

export async function createAvatar(email) {
  const avatar = Avatar.githubBuilder(128);
  const userAvatar = await avatar.create(email);
  console.log(userAvatar);
  return userAvatar;
}
