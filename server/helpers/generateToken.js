import jwt from "jsonwebtoken";

function generateToken(user, res) {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
  res.cookie("token", token, {
    maxAge: 15 * 60 * 60 * 24 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
  });
}

export default generateToken;
