const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getMe,
  getPublicProfile,
  updateProfile,
  addEducation,
  editEducation,
  deleteEducation,
  addExperience,
  editExperience,
  deleteExperience,
} = require('../controllers/userController');

// Profile
router.get('/me', protect, getMe);
router.put('/update', protect, updateProfile);

// Education CRUD
router.post('/education', protect, addEducation);
router.put('/education/:eduId', protect, editEducation);
router.delete('/education/:eduId', protect, deleteEducation);

// Experience CRUD
router.post('/experience', protect, addExperience);
router.put('/experience/:expId', protect, editExperience);
router.delete('/experience/:expId', protect, deleteExperience);

// Public profile (keep last — :id is a catch-all param)
router.get('/:id', getPublicProfile);

module.exports = router;
