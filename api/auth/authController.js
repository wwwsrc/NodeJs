const path = require("path");
const fsPromises = require("fs").promises;
import Joi from "@hapi/joi";
import { UserModel } from "../auth/userAuth.model";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { createControllerProxy } from "../helpers/controllerProxy";
import { createAvatar } from "../helpers/avatarGenerate";
const shortid = require("shortid");

class AuthController {
  async signUp(req, res, next) {
    try {
      const { email, password, subscription } = req.body;

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "Email in use" });
      }

      const userAvatar = await createAvatar(email);
      const id = shortid();
      const avatarFileName = `${id}.png`;
      const avatarPath = path.join(
        __dirname,
        `../../public/images/${avatarFileName}`
      );

      await fsPromises.writeFile(avatarPath, userAvatar);

      const avatarURL = `http://localhost:3000/public/images/${avatarFileName}`;
      console.log(email, avatarURL);
      const passwordHash = await this.createHash(password);
      const newUser = await UserModel.createUser(
        email,
        passwordHash,
        subscription,
        avatarURL
      );
      return res.status(201).json({
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
        },
      });
    } catch (error) {}
  }

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res
          .status(401)
          .json({ message: " Email or password is wrong!" });
      }
      const isPasswordValid = await this.comparePasswords(
        password,
        user.passwordHash
      );
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: " Email or password is wrong!" });
      }
      const authToken = this.createToken(user);

      await UserModel.updateUser(user._id, { token: authToken });

      res.cookie("token", authToken, { httpOnly: true });
      return res.status(200).json({
        token: authToken,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async authorize(req, res, next) {
    try {
      const { token } = req.cookies;
      let payload;
      try {
        payload = this.verifyToken(token);
      } catch (error) {
        return res
          .status(401)
          .json({ message: " Unathorized - Email or password is wrong!" });
      }
      const user = await UserModel.findByToken(token);
      if (!user) {
        return res
          .status(401)
          .json({ message: " Unathorized - Email or password is wrong!" });
      }
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  }
  async currentUserByToken(req, res, next) {
    try {
      const { token } = req.cookies;
      const user = await UserModel.findByToken(token);
      const { email, subscription, avatarURL } = user;
      const oldAvatarName = path.basename(avatarURL);
      console.log(oldAvatarName);
      return res.status(200).json({
        email,
        subscription,
      });
    } catch (error) {}
  }
  //avatar update change old avatar for new
  async updateAvatar(req, res, next) {
    try {
      const { token } = req.cookies;
      const user = await UserModel.findByToken(token);
      const { avatarURL } = user;
      const avatarFileName = path.basename(avatarURL);
      const newAvatar = req.file.buffer;
      const avatarPath = path.join(
        __dirname,
        `../../public/images/${avatarFileName}`
      );
      await fsPromises.writeFile(avatarPath, newAvatar);
      return res.status(200).json({
        avatarURL: avatarURL,
      });
    } catch (error) {}
  }

  async signOut(req, res, next) {
    const { _id: userId } = req.user;
    await UserModel.updateUser(userId, { token: null });
    res.cookie("token", null, { httpOnly: true });
    return res.status(204).send();
  }

  async validateSignUp(req, res, next) {
    const newUserValidateSchema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
      avatarURL: Joi.string(),
    });

    const validationResult = newUserValidateSchema.validate(req.body);
    if (validationResult.error) {
      return res
        .status(400)
        .json({ message: "Missing or wrong required field" });
    }
    next();
  }

  async validateSignIn(req, res, next) {
    const signInSchema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const validationResult = signInSchema.validate(req.body);
    if (validationResult.error) {
      return res
        .status(400)
        .json({ message: "Missing or wrong required field" });
    }
    next();
  }

  async createHash(password) {
    const salt = +process.env.BCRYPTJS_SALT_ROUNDS;
    return bcryptjs.hash(password, salt);
  }
  async comparePasswords(password, passwordHash) {
    return bcryptjs.compare(password, passwordHash);
  }
  createToken(user) {
    const tokenPayload = { uid: user._id };
    const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;
    return jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }
  verifyToken(token) {
    const { JWT_SECRET } = process.env;
    return jwt.verify(token, JWT_SECRET);
  }
}

export const authController = createControllerProxy(new AuthController());
