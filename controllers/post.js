import { db } from "../config/database.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../constans.js";
import moment from "moment";

export const getPosts = async (req, res) => {
  const userId = req.query.userId;

  // console.log(userId);
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Not Logged in" });

  jwt.verify(token, JWT_SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json({ message: "Token is not valid!" });

    const query = userId
      ? `SELECT p.*, u.id AS userId, name, profilePic, COUNT(c.id) AS commentCount
      FROM posts AS p
      JOIN users AS u ON u.id = p.userId
      LEFT JOIN comments AS c ON c.postId = p.id
      WHERE p.userId = ?
      GROUP BY p.id
      ORDER BY p.createdAt DESC;`
      : `SELECT p.*, u.id AS userId, name, profilePic, COUNT(c.id) AS commentCount
      FROM posts AS p
      JOIN users AS u ON u.id = p.userId
      LEFT JOIN comments AS c ON c.postId = p.id
      LEFT JOIN relationship AS r ON (p.userId = r.followedUserId)
      WHERE r.followerUserId = ? OR p.userId = ?
      GROUP BY p.id
      ORDER BY p.createdAt DESC`;

    const values = userId ? [userId] : [userInfo.id, userInfo.id];

    db.query(query, values, (err, data) => {
      if (err) return res.status(500).json({ message: err.message });
      return res.status(200).json(data);
    });
  });
};

export const createPost = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Not Logged in" });

  jwt.verify(token, JWT_SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json({ message: "Token is not valid!" });

    const query =
      "INSERT INTO posts (`description`, `image`, `createdAt`, `userId`) VALUES (?)";

    const values = [
      req.body.description,
      req.body.image,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];
    db.query(query, [values], (err, data) => {
      if (err) return res.status(500).json({ message: err.message });
      return res
        .status(200)
        .json({ message: "Post has been created successfully" });
    });
  });
};

export const deletePost = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Not Logged in" });

  jwt.verify(token, JWT_SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json({ message: "Token is not valid!" });

    const query = "DELETE FROM posts WHERE `id`=? AND `userId`=?";

    db.query(query, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json({ message: err.message });
      if (data.affectedRows > 0)
        return res.status(200).json({ message: "Post deleted Succcesfully!" });

      return res
        .status(403)
        .json({ message: "You can delete only your post!" });
    });
  });
};
