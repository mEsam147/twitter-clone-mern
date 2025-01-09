import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import bcrypt from "bcrypt";

export const getUserProfile = async (req, res) => {
  try {
    const { name } = req.params;
    // const userId = req.user._id;
    const user = await User.findOne({ name }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSuggested = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("following");

    if (!user) return res.status(404).json({ message: "User not found" });

    const suggestedUsers = await User.aggregate([
      { $match: { _id: { $ne: userId } } },
      { $sample: { size: 10 } },
    ]);

    if (!suggestedUsers || suggestedUsers.length === 0)
      return res.status(404).json({ message: "No suggested users found" });

    const filterSuggestUsers = suggestedUsers
      .filter((suggest) => !user.following.includes(suggest._id.toString()))
      .slice(0, 4);

    filterSuggestUsers.forEach((user) => (user.password = null));
    res.status(200).json({
      filterSuggestUsers,
      total: filterSuggestUsers.length,
    });

    console.log(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const followAndUnFollow = async (req, res) => {
  try {
    const { id } = req.params;
    const userFollowing = await User.findById(id);
    if (!userFollowing) {
      return res.status(404).json({ message: "User not found" });
    }
    const currentUser = await User.findById(req.user._id);
    if (!userFollowing && !currentUser) {
      return res.status(401).json({ message: "User not found" });
    }

    if (id === req.user._id.toString())
      return res.status(401).json({ message: "You can't follow yourself" });

    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      await User.findByIdAndUpdate(id, {
        $pull: {
          followers: req.user._id,
        },
      });

      await User.findByIdAndUpdate(req.user._id, {
        $pull: {
          following: id,
        },
      });
      res.status(200).json({ message: "Unfollowed" });
    } else {
      await User.findByIdAndUpdate(id, {
        $push: {
          followers: req.user._id,
        },
      });

      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          following: id,
        },
      });
      const newNotification = new Notification({
        to: req.user._id,
        from: userFollowing._id,
        types: "follow",
        content: `${userFollowing.name} started following you`,
      });
      await newNotification.save();
      res.status(200).json({ message: "Followed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  const { fullName, email, currentPassword, newPassword, bio, link } = req.body;

  const { profileImage, coverImage } = req?.files??{};

  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (
      (!currentPassword && newPassword) ||
      (!newPassword && currentPassword)
    ) {
      return res
        .status(400)
        .json({ message: "You must provide both current and new passwords" });
    }

    if ((currentPassword, newPassword)) {
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Wrong current password" });
      }
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters long" });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    if (fullName) user.fullName = fullName || user.fullName;
    if (email) user.email = email || user.email;
    if (bio) user.bio = bio || user.bio;
    if (link) user.link = link || user.link;

    if (profileImage) {
      let imageUrl = `http://localhost:8000/uploads/${profileImage[0].filename}`;
      user.profileImage = imageUrl;
    }
    if (coverImage) {
      let coverUrl = `http://localhost:8000/uploads/${coverImage[0].filename}`;
      user.coverImage = coverUrl;
    }
    await user.save();
    user.password = null;
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
