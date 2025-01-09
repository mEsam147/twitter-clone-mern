import generateToken from "../helpers/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { name, fullName, password, email } = req.body;

    const nameExist = await User.findOne({ name });
    if (nameExist) {
      return res.status(400).json({ message: "Name already exists" });
    }
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password should be at least 6 characters long" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      fullName,
      password: hashedPassword,
      email,
    });
    if (newUser) {
      await newUser.save();
      generateToken(newUser, res);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Wrong Email" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Wrong Password" });
    }

    generateToken(user, res);
    res.json({
      message: "User  logged in successfully",
      user: {
        name: user.name,
        fullName: user.fullName,
        email: user.email,
        followers: user.followers,
        following: user.following,
        profileImage: user.profileImage,
        coverImage: user.coverImage,
        bio: user.bio,
        link: user.link,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      maxAge: 0,
    });
    res.json({ message: "User logged out successfully", status: true });
  } catch (error) {
    console.log(errror);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user)
      return res.status(400).json({
        message: "User not found",
      });
    res.json({
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
