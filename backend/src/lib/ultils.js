import jwt from "jsonwebtoken";
export const generateToken = (user, res) => {
  const token = jwt.sign(
    { userId: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 100, // MS
    httpOnly: true,
    // sameSite: "strict", // only send cookies over HTTPS
    sameSite: "None", // cho phép dùng ở khác domain
    secure: process.env.NODE_ENV !== "development",
  });
  console.log("🚀 ~ generateToken ~ token:", token);
  return token;
};
