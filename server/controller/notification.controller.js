import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "name profileImage",
    });

    await Notification.updateMany({ to: userId }, { read: true });
    res.status(200).json(notifications);

    if (!notifications)
      return res.status(404).json({ message: "No notifications found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId);
    await Notification.deleteMany({ to: userId });
    res.status(200).json({
      message: "Notifications deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
