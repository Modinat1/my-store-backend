const userModel = require("../schema/user.model.js");

const getUserProfile = async (req, res) => {
  try {
    const userProfile = await userModel
      .findById(req.decoded.ownerId)
      .select("-password");

    if (!userProfile) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "User fetched successfully",
      userProfile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching profile",
      error: error.message,
    });
  }
};

module.exports = {
  getUserProfile,
};
