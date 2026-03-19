import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Check, Camera, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import { getBaseURL } from '../services/api';

const BLOOD_GROUPS = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function EditProfile() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    bloodGroup: '',
    phoneNumber: '',
  });

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${getBaseURL()}${path}`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.getUserProfile();
        const u = res.data.user;
        setForm({
          name: u.name || '',
          address: u.address || '',
          city: u.city || '',
          bloodGroup: u.bloodGroup || '',
          phoneNumber: u.phoneNumber || '',
        });
        setCurrentImage(u.profileImage || '');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const removeSelectedImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('address', form.address);
      formData.append('city', form.city);
      formData.append('bloodGroup', form.bloodGroup);
      formData.append('phoneNumber', form.phoneNumber);
      if (imageFile) {
        formData.append('profileImage', imageFile);
      }

      await api.updateProfile(formData);
      await refreshUser();
      setSuccess(true);
      setTimeout(() => navigate('/profile'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center bg-bg">
        <Loader2 className="w-9 h-9 text-accent animate-spin" />
      </div>
    );
  }

  const displayImage = imagePreview || getImageUrl(currentImage);

  const inputClass =
    'w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-main placeholder-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all text-sm';

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-12 md:pb-20 px-4 bg-bg">
      <div className="max-w-lg mx-auto">
        <div className="bg-card border border-border rounded-2xl shadow-lg shadow-black/5 overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-border/50 flex items-center gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="p-2 -ml-2 rounded-lg text-muted hover:text-accent hover:bg-cardHover transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-main font-display">Edit Profile</h1>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mx-6 mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              <p className="text-sm text-green-500 font-medium">Profile updated successfully!</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-500 font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
            {/* Profile Photo Upload */}
            <div>
              <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-3">
                Profile Photo
              </label>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div
                    className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center border-2 border-border"
                    style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))' }}
                  >
                    {displayImage ? (
                      <img src={displayImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-2xl font-bold">
                        {form.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 text-sm font-medium text-accent border border-accent/30 rounded-lg hover:bg-accent/10 transition-colors cursor-pointer"
                  >
                    Choose Photo
                  </button>
                  {imageFile && (
                    <button
                      type="button"
                      onClick={removeSelectedImage}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                      Remove
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              {imageFile && (
                <p className="text-xs text-muted mt-2">{imageFile.name}</p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
                className={inputClass}
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Your address"
                className={inputClass}
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
                City
              </label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Your city"
                className={inputClass}
              />
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
                Blood Group
              </label>
              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                className={inputClass + ' appearance-none cursor-pointer'}
              >
                <option value="">Select blood group</option>
                {BLOOD_GROUPS.filter(Boolean).map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="+91 9876543210"
                pattern="[\+]?[0-9\s\-]{7,15}"
                title="Enter a valid phone number (7-15 digits)"
                className={inputClass}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={saving || success}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))' }}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : success ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
