import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Mail, MapPin, Droplets, Calendar, Hash, User, ArrowRight, Pencil, Phone, Camera, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

export default function Profile() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await api.getUserProfile();
      setProfile(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('profileImage', file);
      await api.updateProfile(formData);
      await refreshUser();
      await fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center bg-bg">
        <Loader2 className="w-9 h-9 text-accent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center px-4 bg-bg">
        <div className="bg-card border border-border rounded-2xl p-8 text-center max-w-md w-full shadow-lg">
          <p className="text-red-500 font-medium text-lg mb-2">Error</p>
          <p className="text-muted text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const details = [
    { icon: User, label: 'Name', value: profile?.name },
    { icon: Mail, label: 'Email', value: profile?.email },
    { icon: Hash, label: 'User ID', value: profile?._id },
    {
      icon: Calendar,
      label: 'Date Joined',
      value: profile?.createdAt
        ? new Date(profile.createdAt).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : '—',
    },
    { icon: MapPin, label: 'Address', value: profile?.address || '—' },
    { icon: MapPin, label: 'City', value: profile?.city || '—' },
    { icon: Droplets, label: 'Blood Group', value: profile?.bloodGroup || '—' },
    { icon: UserCircle, label: 'Gender', value: profile?.gender || '—' },
    { icon: Phone, label: 'Phone Number', value: profile?.phoneNumber || '—' },
  ];

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-12 md:pb-20 px-4 bg-bg">
      <div className="max-w-lg mx-auto">
        <div className="bg-card border border-border rounded-2xl shadow-lg shadow-black/5 overflow-hidden">
          {/* Profile Image Section */}
          <div className="relative bg-gradient-to-br from-accent/20 to-accent/5 pt-10 pb-16 flex justify-center">
            {/* Edit Profile Button */}
            <button
              onClick={() => navigate('/edit-profile')}
              className="absolute top-4 right-4 p-2.5 rounded-xl bg-card/80 backdrop-blur border border-border/50 text-muted hover:text-accent hover:border-accent/30 transition-all shadow-sm cursor-pointer"
              title="Edit Profile"
            >
              <Pencil className="w-4 h-4" />
            </button>

            {/* Profile Photo with Upload */}
            <div className="relative group">
              <div
                className="w-28 h-28 rounded-full border-4 border-card shadow-lg overflow-hidden flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))' }}
              >
                {profile?.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-4xl font-bold">
                    {profile?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>

              {/* Camera overlay on hover */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                {uploading ? (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 text-white" />
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Name, Pronouns & Email Header */}
          <div className="text-center -mt-6 px-6">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-main font-display">{profile?.name}</h1>
              {profile?.pronouns && (
                <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                  {profile.pronouns}
                </span>
              )}
            </div>
            <p className="text-sm text-muted mt-1">{profile?.email}</p>
          </div>

          {/* Details */}
          <div className="px-6 py-6 space-y-0">
            {details.map(({ icon: Icon, label, value }, idx) => (
              <div
                key={label + idx}
                className="flex items-start gap-3 py-3.5 border-b border-border/50 last:border-b-0"
              >
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-muted uppercase tracking-wider">{label}</p>
                  <p className="text-sm text-main mt-0.5 break-all">{value || '—'}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Start Your Business Button */}
          <div className="px-6 pb-6">
            <button
              onClick={() => navigate('/business')}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg cursor-pointer"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))' }}
            >
              Start Your Business
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
