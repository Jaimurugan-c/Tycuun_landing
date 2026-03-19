const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// GET /api/user/profile — authenticated user's profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      'name email _id createdAt profileImage address city bloodGroup phoneNumber'
    );
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/user/profile — update profile fields (supports multipart/form-data for image)
exports.updateProfile = async (req, res) => {
  try {
    const { name, address, city, bloodGroup, phoneNumber } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name !== undefined) user.name = name;
    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;
    if (bloodGroup !== undefined) user.bloodGroup = bloodGroup;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;

    // Handle uploaded profile image
    if (req.file) {
      // Delete old image if it exists
      if (user.profileImage) {
        const oldPath = path.join(__dirname, '..', user.profileImage);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
