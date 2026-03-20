import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Loader2, 
  Mail, 
  MapPin, 
  Droplets, 
  Phone, 
  Camera, 
  Pencil, 
  Briefcase,
  ExternalLink,
  User,
  Globe
} from 'lucide-react';
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
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-accent animate-spin" />
          <p className="text-muted animate-pulse font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center px-4 bg-bg">
        <div className="bg-card border border-border rounded-2xl p-8 text-center max-w-md w-full shadow-lg">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-red-500 font-bold">!</span>
          </div>
          <p className="text-main font-bold text-xl mb-2">Something went wrong</p>
          <p className="text-muted text-sm mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-2.5 bg-accent text-white rounded-xl font-semibold hover:bg-accent-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-bg px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* HEADER SECTION */}
        <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden transition-all duration-300">
          {/* Gradient Banner */}
          <div className="h-32 sm:h-48 bg-gradient-to-r from-accent via-accent/80 to-accent-light" />
          
          <div className="px-6 pb-8">
            <div className="relative flex flex-col items-center -mt-16 sm:-mt-24 text-center">
              {/* Profile Image */}
              <div className="relative group">
                <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-full border-[6px] border-card bg-card shadow-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-accent/10 to-accent-light/10">
                  {profile?.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt={profile.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <User className="w-16 h-16 sm:w-20 sm:h-20 text-accent/40" />
                  )}
                  
                  {/* Upload Overlay */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-[2px]"
                  >
                    {uploading ? (
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : (
                      <div className="flex flex-col items-center text-white">
                        <Camera className="w-8 h-8 mb-1" />
                        <span className="text-xs font-semibold">Change Photo</span>
                      </div>
                    )}
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              {/* Identity Info */}
              <div className="mt-4 space-y-1">
                <div className="flex items-center justify-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold text-main tracking-tight">
                    {profile?.name}
                  </h1>
                  {profile?.pronouns && (
                    <span className="text-[10px] sm:text-xs font-bold px-2.5 py-1 bg-accent/10 text-accent rounded-full border border-accent/20 uppercase tracking-widest">
                      {profile.pronouns}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-muted sm:text-lg font-medium">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm sm:text-base">{profile?.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-red-400" />
                    <span className="text-sm sm:text-base">{profile?.city || 'No City Added'}</span>
                  </div>
                </div>
              </div>

              {/* Main Actions */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => navigate('/edit-profile')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-accent hover:bg-accent-dark text-white rounded-full font-bold shadow-lg shadow-accent/20 transition-all active:scale-95 group"
                >
                  <Pencil className="w-4 h-4 transition-transform group-hover:-rotate-12" />
                  Edit Profile
                </button>
                <button
                  onClick={() => navigate('/business')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-white dark:bg-white/5 border-2 border-accent text-accent hover:bg-accent/5 rounded-full font-bold transition-all active:scale-95"
                >
                  <Briefcase className="w-4 h-4" />
                  Start Your Business
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILS CARD */}
        <div className="bg-card border border-border rounded-xl shadow-lg p-6 sm:p-8">
          <div className="flex items-center justify-between mb-8 border-b border-border/50 pb-4">
            <h2 className="text-xl font-bold text-main flex items-center gap-2">
              <span className="w-1 h-6 bg-accent rounded-full"></span>
              Personal Details
            </h2>
            <div className="text-xs font-bold text-accent px-3 py-1 bg-accent/5 rounded-lg border border-accent/10">
              ID: {profile?._id?.slice(-8).toUpperCase()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <DetailItem 
              icon={<Phone className="text-blue-500" />} 
              label="Phone Number" 
              value={profile?.phoneNumber} 
            />
            <DetailItem 
              icon={<Mail className="text-indigo-500" />} 
              label="Email Address" 
              value={profile?.email} 
            />
            <DetailItem 
              icon={<MapPin className="text-orange-500" />} 
              label="Address" 
              value={profile?.address} 
            />
            <DetailItem 
              icon={<Globe className="text-green-500" />} 
              label="City" 
              value={profile?.city} 
            />
            <DetailItem 
              icon={<Droplets className="text-red-500" />} 
              label="Blood Group" 
              value={profile?.bloodGroup} 
            />
            <DetailItem 
              icon={<User className="text-purple-500" />} 
              label="Gender" 
              value={profile?.gender} 
            />
          </div>
        </div>

        {/* FOOTER ACTION (Optional Extra) */}
        <div className="text-center pt-4">
          <p className="text-muted text-sm">
            Tycuun Member since {profile?.createdAt ? new Date(profile.createdAt).getFullYear() : '2024'}
          </p>
        </div>

      </div>
    </div>
  );
}

// Helper Component for Details
function DetailItem({ icon, label, value, fullWidth }) {
  return (
    <div className={`flex items-start gap-4 group ${fullWidth ? 'md:col-span-2' : ''}`}>
      <div className="w-12 h-12 rounded-xl bg-bg border border-border flex items-center justify-center shrink-0 transition-all group-hover:shadow-md group-hover:border-accent/30 group-hover:bg-card">
        {icon}
      </div>
      <div className="space-y-1 overflow-hidden">
        <p className="text-xs font-bold text-muted uppercase tracking-widest">{label}</p>
        <p className="text-base sm:text-lg font-semibold text-main truncate">
          {value || <span className="text-muted/40 font-normal italic">Not specified</span>}
        </p>
      </div>
    </div>
  );
}
