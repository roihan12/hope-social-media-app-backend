import { db } from "../config/database.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../constans.js";


export const getRelationship = async (req, res) => {
  const query = "SELECT followerUserId FROM relationship WHERE followedUserId = ?";
  db.query(query, [req.query.followedUserId], (err, data) => {
    if (err) return res.status(500).json({ message: err.message });
    return res.status(200).json(data.map((relationship) => relationship.followerUserId));
  });
};

export const addRelationship = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Not Logged in" });

  jwt.verify(token, JWT_SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json({ message: "Token is not valid!" });

    const query = "INSERT INTO relationship (`followerUserId`, `followedUserId`) VALUES (?)";

    const values = [userInfo.id, req.body.userId];
    db.query(query, [values], (err, data) => {
      if (err) return res.status(500).json({ message: err.message });
      return res
        .status(200)
        .json({ message: "Following successfully" });
    });
  });
};

export const deleteRelationship = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Not Logged in" });

  jwt.verify(token, JWT_SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json({ message: "Token is not valid!" });

    const query = "DELETE FROM relationship WHERE `followerUserId` = ? AND `followedUserId` = ?";


    db.query(query, [ userInfo.id,  req.query.userId], (err, data) => {
      if (err) return res.status(500).json({ message: err.message });
      return res
        .status(200)
        .json({ message: "Unfollow successfully" });
    });
  });
};
