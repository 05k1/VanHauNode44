import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// doc file .env
dotenv.config();

// create function createToken
export const createToken = (data) => {
  return jwt.sign({ payload: data }, process.env.ACCESS_TOKEN_KEY, {
    algorithm: "HS256",
    expiresIn: "1d",
  });
};

const verifyToken = (token) => {
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    return true;
  } catch (error) {
    return false;
  }
};

// create middleware token
export const middlewareToken = (req, res, next) => {
  let { token } = req.headers;
  let checkToken = verifyToken(token);
  if (checkToken) {
    // neu token hop le qua router
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
