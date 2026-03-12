import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Briefcase, GraduationCap, Award, Sparkles, Calendar } from 'lucide-react';
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
      <div className="min-h-screen pt-28 md:pt-32 flex items-center justify-center">
        <Loader2 className="w-9 h-9 text-accent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-28 md:pt-32 flex items-center justify-center px-4">
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 text-center max-w-md w-full shadow-lg shadow-black/5">
          <p className="text-red-500 font-medium text-base md:text-lg mb-2">Error</p>
          <p className="text-muted text-sm md:text-base">{error}</p>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: Briefcase, label: 'Experience', value: profile?.experience?.length || 0 },
    { icon: GraduationCap, label: 'Education', value: profile?.education?.length || 0 },
    { icon: Sparkles, label: 'Skills', value: profile?.skills?.length || 0 },
    { icon: Award, label: 'Certifications', value: profile?.certifications?.length || 0 },
  ];

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-12 md:pb-20 px-3 sm:px-4 md:px-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">

          {/* ─── Left Column ─── */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 space-y-4 md:space-y-6">
              <ProfileHeader
                user={profile}
                isOwner={isOwn}
                onEdit={() => navigate('/profile/edit')}
                onUpdated={handleUpdated}
              />

              <SkillsSection
                skills={profile?.skills}
                isOwner={isOwn}
                onUpdated={handleUpdated}
              />

              {/* Stats card — desktop */}
              <div className="bg-card border border-border rounded-2xl p-4 md:p-5 transition-colors duration-200 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/8 hidden lg:block">
                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
                  Profile Overview
                </h3>
                <div className="space-y-3.5">
                  {stats.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-accent" />
                        </div>
                        <span className="text-muted text-sm">{label}</span>
                      </div>
                      <span className="text-main font-semibold text-sm tabular-nums">{value}</span>
                    </div>
                  ))}
                  <div className="border-t border-border/50 pt-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-accent" />
                        </div>
                        <span className="text-muted text-sm">Member since</span>
                      </div>
                      <span className="text-main font-medium text-sm">
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

              {/* Mobile stats — scrollable pills */}
              <div className="flex flex-wrap gap-2 sm:gap-2.5 lg:hidden">
                {stats.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-card border border-border rounded-xl text-sm shadow-md shadow-black/5"
                  >
                    <Icon className="w-4 h-4 text-accent" />
                    <span className="text-muted">{label}</span>
                    <span className="text-main font-semibold tabular-nums">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Right Column ─── */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6 lg:space-y-8">
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
