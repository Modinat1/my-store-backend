const userModel = require("../schema/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  const { fullName, email, role, password } = req.body;

  const emailExists = await userModel.findOne({ email });

  if (emailExists) {
    res.status(409).send({
      message: "Email already exist",
    });
    return;
  }

  const hashPassword = bcrypt.hashSync(password, 10);

  const newUser = await userModel.create({
    fullName,
    email,
    role,
    password: hashPassword,
  });

  res.status(201).send({
    message: "User created successfully!",
    user: newUser,
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  const userDetail = await userModel.findOne({ email });

  //you can check if the email is valid too
  if (!userDetail) {
    res.status(404).send({
      message: "User not found",
    });
    return;
  }

  const passwordMatch = bcrypt.compareSync(password, userDetail.password);

  if (!passwordMatch) {
    res.status(400).send({
      message: "Wrong credentials",
    });
    return;
  }

  const token = jwt.sign(
    {
      ownerId: userDetail._id,
      email: userDetail.email,
      role: userDetail.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.send({
    message: "login successful",
    userDetail: {
      id: userDetail._id,
      email: userDetail.email,
      fullName: userDetail.fullName,
      role: userDetail.role,
    },
    token,
  });
}

module.exports = {
  register,
  login,
};
