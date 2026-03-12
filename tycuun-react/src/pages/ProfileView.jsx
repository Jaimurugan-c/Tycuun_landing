import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import ProfileHeader from '../components/profile/ProfileHeader';
import AboutSection from '../components/profile/AboutSection';
import EducationSection from '../components/profile/EducationSection';
import ExperienceSection from '../components/profile/ExperienceSection';
import SkillsSection from '../components/profile/SkillsSection';
import CertificationsSection from '../components/profile/CertificationsSection';

export default function ProfileView() {
  const { id } = useParams();
  const { user: authUser, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isOwn = !id || id === authUser?._id;

  const fetchProfile = useCallback(async () => {
    setError('');
    try {
      if (isOwn) {
        const res = await api.getProfile();
        setProfile(res.data.user || res.data);
      } else {
        const res = await api.getPublicProfile(id);
        setProfile(res.data.user || res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [id, isOwn]);

  useEffect(() => {
    setLoading(true);
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdated = useCallback(async () => {
    await fetchProfile();
    if (isOwn) refreshUser();
  }, [fetchProfile, isOwn, refreshUser]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="bg-card border border-border rounded-2xl p-8 text-center max-w-md">
          <p className="text-red-500 font-medium mb-2">Error</p>
          <p className="text-muted text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 space-y-6">
              <ProfileHeader
                user={profile}
                isOwner={isOwn}
                onEdit={() => navigate('/profile/edit')}
              />

              {/* Skills — left column on desktop */}
              <SkillsSection
                skills={profile?.skills}
                isOwner={isOwn}
                onUpdated={handleUpdated}
              />

              {/* Quick stats */}
              <div className="bg-card border border-border rounded-2xl p-5 transition-colors hidden lg:block">
                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                  Profile Stats
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Experience</span>
                    <span className="text-main font-medium">
                      {profile?.experience?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Education</span>
                    <span className="text-main font-medium">
                      {profile?.education?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Certifications</span>
                    <span className="text-main font-medium">
                      {profile?.certifications?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Member since</span>
                    <span className="text-main font-medium">
                      {profile?.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            <AboutSection
              bio={profile?.bio}
              isOwner={isOwn}
              onUpdated={handleUpdated}
            />
            <ExperienceSection
              experience={profile?.experience}
              isOwner={isOwn}
              onUpdated={handleUpdated}
            />
            <EducationSection
              education={profile?.education}
              isOwner={isOwn}
              onUpdated={handleUpdated}
            />
            <CertificationsSection
              certifications={profile?.certifications}
              isOwner={isOwn}
              onUpdated={handleUpdated}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
