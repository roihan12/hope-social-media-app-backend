import { db } from "../config/database.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../constans.js";
import moment from "moment";

export const getLikes = async (req, res) => {
  const query = "SELECT userId FROM liked WHERE postId = ?";
  db.query(query, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json({ message: err.message });
    return res.status(200).json(data.map((like) => like.userId));
  });
};

export const addLikes = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Not Logged in" });

  jwt.verify(token, JWT_SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json({ message: "Token is not valid!" });

    const query = "INSERT INTO liked (`userId`, `postId`) VALUES (?)";

    const values = [userInfo.id, req.body.postId];
    db.query(query, [values], (err, data) => {
      if (err) return res.status(500).json({ message: err.message });
      return res
        .status(200)
        .json({ message: "Post has been liked successfully" });
    });
  });
};

export const deleteLikes = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Not Logged in" });

  jwt.verify(token, JWT_SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json({ message: "Token is not valid!" });

    const query = "DELETE FROM liked WHERE `userId` = ? AND `postId` = ?";


    db.query(query, [ userInfo.id,  req.query.postId], (err, data) => {
      if (err) return res.status(500).json({ message: err.message });
      return res
        .status(200)
        .json({ message: "Post has been unliked successfully" });
    });
  });
};
