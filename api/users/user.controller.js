const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const UserModel = require("./user.model");

//get all users
exports.getAllUsers = async (req, res) => {
  try {
    return res.status(200).json(await UserModel.getAllUsers());
  } catch (error) {
    // res.sendStatus(400);
    next();
  }
};
//Get users by id
exports.getUserById = async (req, res, next) => {
  try {
    const userFound = await UserModel.getUserById(req.params.id);
    if (userFound) {
      return res.status(200).json(userFound);
    }
  } catch (err) {
    next(err);
  }
};
//validation getUserById
exports.validateGetUserById = function validateGetUserById(req, res, next) {
  const toValidate = {
    params: req.params,
  };

  const userRules = Joi.object({
    params: { id: Joi.objectId() },
  });

  const validationResult = userRules.validate(toValidate);
  if (validationResult.error) {
    return res.status(400).json(validationResult.error);
  }

  next();
};

//Create contacts
exports.createUser = async function createUser(req, res, next) {
  try {
    const createdUser = await UserModel.createUser(req.body);
    return res.status(201).json(createdUser);
  } catch (err) {
    next(err);
  }
};

exports.validateCreateUser = function validateCreateUser(req, res, next) {
  const body = req.body;
  const userRules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  });

  const validationResult = userRules.validate(body);
  if (validationResult.error) {
    return res.status(400).json(validationResult.error);
  }
  next();
};

// Update user
exports.updateUser = async (req, res, next) => {
  try {
    const body = req.body;
    const id = Number(req.params.id);
    if (isEmpty(body)) {
      res.status(400).json({ message: "missing fields" });
    } else {
      const updatedUser = await UserModel.updateUser(req.params.id, req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: "user not found" });
      }
      return res.status(200).json(updatedUser);
    }
    //check for empty object
    function isEmpty(obj) {
      for (let key in obj) {
        return false;
      }
      return true;
    }
  } catch (error) {}
};

exports.validateUpdateUser = function validateUpdateUser(req, res, next) {
  const toValidate = {
    body: req.body,
    params: req.params,
  };
  const userRules = Joi.object({
    params: { id: Joi.objectId() },
    body: { name: Joi.string(), email: Joi.string(), phone: Joi.string() },
  });

  const validationResult = userRules.validate(toValidate);

  if (validationResult.error) {
    return res.status(400).json(validationResult.error);
  }
  next();
};

//Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await UserModel.deleteUser(req.params.id);
    if (deletedUser) {
      return res.status(200).json({ message: "contact deleted" });
    }
    return res.status(404).json({ message: "not found" });
  } catch (error) {}
};

exports.validateDeleteUser = function validateDeleteUser(req, res, next) {
  //   const body = req.body;
  const toValidate = {
    params: req.params,
  };
  const userRules = Joi.object({
    params: { id: Joi.objectId() },
  });

  const validationResult = userRules.validate(toValidate);

  if (validationResult.error) {
    return res.status(400).json(validationResult.error);
  }
  next();
};
