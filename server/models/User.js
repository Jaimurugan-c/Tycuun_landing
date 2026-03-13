const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  headline: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  education: [
    {
      school: { type: String, default: '' },
      institution: { type: String, default: '' },
      degree: { type: String, default: '' },
      year: { type: String, default: '' },
      startDate: { type: String, default: '' },
      endDate: { type: String, default: '' },
      description: { type: String, default: '' },
      skills: { type: String, default: '' },
    },
  ],
  experience: [
    {
      company: { type: String, default: '' },
      role: { type: String, default: '' },
      years: { type: String, default: '' },
      startDate: { type: String, default: '' },
      endDate: { type: String, default: '' },
      currentWorking: { type: Boolean, default: false },
      description: { type: String, default: '' },
      skills: { type: String, default: '' },
    },
  ],
  skills: [
    {
      type: String,
      trim: true,
    },
  ],
  certifications: [
    {
      name: { type: String, default: '' },
      organization: { type: String, default: '' },
      issueDate: { type: String, default: '' },
      credentialId: { type: String, default: '' },
      credentialUrl: { type: String, default: '' },
      description: { type: String, default: '' },
      skills: { type: String, default: '' },
    },
  ],
  profileImage: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
