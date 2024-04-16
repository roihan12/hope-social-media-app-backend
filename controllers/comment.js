import { db } from "../config/database.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../constans.js";
import moment from "moment";

export const getComments = async (req, res) => {
  const query = `SELECT c.*, u.id AS userId, name, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userId) WHERE c.postId = ?
    ORDER BY c.createdAt DESC`;

    // console.log(req.query.postId);

  db.query(query, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json({ message: err.message });
    return res.status(200).json(data);
  });
};


export const createComments = async (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: "Not Logged in" });
  
    jwt.verify(token, JWT_SECRET_KEY, (err, userInfo) => {
      if (err) return res.status(403).json({ message: "Token is not valid!" });
  
      const query = "INSERT INTO comments (`comment`, `createdAt`, `userId`, `postId`) VALUES (?)";
  
      const values = [
        req.body.comment,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        userInfo.id,
        req.body.postId
      ];
      db.query(query, [values], (err, data) => {
        if (err) return res.status(500).json({ message: err.message });
        return res
          .status(200)
          .json({ message: "Comment has been created successfully" });
      });
    });
  };