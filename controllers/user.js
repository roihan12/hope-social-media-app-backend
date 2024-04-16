import { db } from "../config/database.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../constans.js";
import moment from "moment";

export const getUser = async (req, res) => {
  const userId = req.params.userId;
  const query = "SELECT * FROM users WHERE id= ?";

  db.query(query, [userId], (err, data) => {
    if (err) return res.status(500).json({ message: err.message });
    const { password, ...info } = data[0];
    return res.status(200).json(info);
  });
};
export const updateUser = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Not Logged in" });

  jwt.verify(token, JWT_SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json({ message: "Token is not valid!" });

    const query =
      "UPDATE users SET `name`= ?, `city`= ? ,`occupation`= ?, `profilePic`= ?, `coverPic`= ? WHERE id= ?";

    db.query(
      query,
      [
        req.body.name,
        req.body.city,
        req.body.occupation,
        req.body.profilePic,
        req.body.coverPic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) return res.status(500).json({ message: err.message });
        if (data.affectedRows > 0)
          return res.status(200).json({ message: "Updated Succcesfully!" });

        return res
          .status(403)
          .json({ message: "You can update only your post!" });
      }
    );
  });
};
