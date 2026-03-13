const User = require('../models/User');

// Helper: sync skills from education, experience, certifications into main skills array
function syncSkillsFromSections(user) {
  const sectionSkills = new Set(
    (user.skills || []).map((s) => s.trim().toLowerCase())
  );
  const skillsOriginal = new Map(
    (user.skills || []).map((s) => [s.trim().toLowerCase(), s.trim()])
  );

  const extractSkills = (items) => {
    (items || []).forEach((item) => {
      if (item.skills && typeof item.skills === 'string') {
        item.skills.split(',').map((s) => s.trim()).filter(Boolean).forEach((s) => {
          const key = s.toLowerCase();
          if (!sectionSkills.has(key)) {
            sectionSkills.add(key);
            skillsOriginal.set(key, s);
          }
        });
      }
    });
  };

  extractSkills(user.education);
  extractSkills(user.experience);
  extractSkills(user.certifications);

  user.skills = Array.from(skillsOriginal.values());
}

// GET /api/users/me — logged-in user's profile
exports.getMe = async (req, res) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/users/:id — public profile
exports.getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/users/update — update profile (name, headline, bio, education, experience)
exports.updateProfile = async (req, res) => {
  try {
    const { name, headline, bio, education, experience, profileImage, skills, certifications } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name !== undefined) user.name = name;
    if (headline !== undefined) user.headline = headline;
    if (bio !== undefined) user.bio = bio;
    if (profileImage !== undefined) user.profileImage = profileImage;

    // Education: full replace, add, edit by _id, or delete by _id
    if (education !== undefined) {
      if (Array.isArray(education)) {
        user.education = education;
      }
    }

    // Experience: full replace, add, edit by _id, or delete by _id
    if (experience !== undefined) {
      if (Array.isArray(experience)) {
        user.experience = experience;
      }
    }

    // Skills: full replace
    if (skills !== undefined) {
      if (Array.isArray(skills)) {
        user.skills = skills;
      }
    }

    // Certifications: full replace
    if (certifications !== undefined) {
      if (Array.isArray(certifications)) {
        user.certifications = certifications;
      }
    }

    // Auto-sync skills from all sections into main skills array
    syncSkillsFromSections(user);

    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/users/education — add a single education entry
exports.addEducation = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.education.push(req.body);
    syncSkillsFromSections(user);
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/users/education/:eduId — edit a single education entry
exports.editEducation = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const entry = user.education.id(req.params.eduId);
    if (!entry) return res.status(404).json({ success: false, message: 'Education entry not found' });

    const { school, degree, year } = req.body;
    if (school !== undefined) entry.school = school;
    if (degree !== undefined) entry.degree = degree;
    if (year !== undefined) entry.year = year;

    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/users/education/:eduId — delete a single education entry
exports.deleteEducation = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const entry = user.education.id(req.params.eduId);
    if (!entry) return res.status(404).json({ success: false, message: 'Education entry not found' });

    entry.deleteOne();
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/users/experience — add a single experience entry
exports.addExperience = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.experience.push(req.body);
    syncSkillsFromSections(user);
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/users/experience/:expId — edit a single experience entry
exports.editExperience = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const entry = user.experience.id(req.params.expId);
    if (!entry) return res.status(404).json({ success: false, message: 'Experience entry not found' });

    const { company, role, years } = req.body;
    if (company !== undefined) entry.company = company;
    if (role !== undefined) entry.role = role;
    if (years !== undefined) entry.years = years;

    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/users/experience/:expId — delete a single experience entry
exports.deleteExperience = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const entry = user.experience.id(req.params.expId);
    if (!entry) return res.status(404).json({ success: false, message: 'Experience entry not found' });

    entry.deleteOne();
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
