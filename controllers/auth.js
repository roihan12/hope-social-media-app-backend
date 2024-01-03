import { db } from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../constans.js";

export const register = async (req, res) => {
  //CHECKUSER IF EXISTS
  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [req.body.username], (err, data) => {
    if (err) return res.status(500).json({ message: err.message });
    if (data.length)
      return res.status(409).json({ message: "User already exists!" });

    //CREATE A NEW USER
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const createUser =
      "INSERT INTO users (`username`,`email`, `password`,`name`) VALUES (?)";
    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
    ];

    db.query(createUser, [values], (err, data) => {
      if (err) return res.status(500).json({ message: err.message });
      return res.status(201).json({ message: "User has been created." });
    });
  });
};

export const login = async (req, res) => {
  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [req.body.username], (err, data) => {
    if (err) return res.status(500).json({ message: err.message });
    if (data.length === 0)
      return res.status(404).json({ message: "User not found!" });

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!checkPassword)
      return res.status(400).json({ message: "Wrong password or username!" });

    const token = jwt.sign({ id: data[0].id }, JWT_SECRET_KEY);

    const { password, ...other } = data[0];

    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        message: "Login successfully",
        user: other,
      });
  });
};

export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json({
      message: "User has been logged out",
    });
};
