const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

// GET /api/user/profile
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

// PUT /api/user/profile
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

    // Upload image to Cloudinary if provided
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (user.profileImage) {
        const parts = user.profileImage.split('/');
        const fileWithExt = parts[parts.length - 1];
        const publicId = `tycuun-profiles/${fileWithExt.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }

      // Upload new image from buffer
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'tycuun-profiles',
            transformation: [{ width: 500, height: 500, crop: 'fill', gravity: 'face' }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      user.profileImage = result.secure_url;
    }

    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
