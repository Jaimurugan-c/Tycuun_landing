const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, headline, bio, education, experience } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name !== undefined) user.name = name;
    if (headline !== undefined) user.headline = headline;
    if (bio !== undefined) user.bio = bio;
    if (education !== undefined) user.education = education;
    if (experience !== undefined) user.experience = experience;

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
