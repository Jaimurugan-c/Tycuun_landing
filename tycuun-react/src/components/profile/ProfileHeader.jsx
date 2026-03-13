import { Pencil, Mail, Calendar, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfileHeader({ user, isOwner, onEdit }) {
  const navigate = useNavigate();

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : null;

  // Profile completeness
  const completionFields = [
    user?.name,
    user?.headline,
    user?.bio,
    user?.experience?.length > 0,
    user?.education?.length > 0,
    user?.skills?.length > 0,
    user?.certifications?.length > 0,
    user?.profileImage,
  ];
  const filled = completionFields.filter(Boolean).length;
  const completionPct = Math.round((filled / completionFields.length) * 100);

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden transition-all duration-200 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/8">
      {/* Banner */}
      <div
        className="h-28 sm:h-36 md:h-44 relative"
        style={{
          background:
            'linear-gradient(135deg, var(--accent-dark), var(--accent), var(--accent-light))',
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />

        {isOwner && (
          <button
            onClick={onEdit}
            className="absolute top-3 right-3 p-2.5 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 active:scale-95 transition-all text-white shadow-lg shadow-black/10"
            title="Quick Edit Profile"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="px-4 sm:px-6 pb-5 sm:pb-6 -mt-12 sm:-mt-14 md:-mt-16 relative">
        {/* Avatar + Name + Headline — fully centered vertical stack */}
        <div className="flex flex-col items-center text-center">
          {/* Profile Image */}
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 object-cover flex-shrink-0 shadow-xl shadow-black/20"
              style={{ borderColor: 'var(--card)' }}
            />
          ) : (
            <div
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 flex items-center justify-center text-white font-display font-bold text-3xl sm:text-4xl md:text-5xl flex-shrink-0 shadow-xl shadow-black/20"
              style={{
                background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
                borderColor: 'var(--card)',
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}

          {/* User Name */}
          <h1 className="font-display font-bold text-2xl md:text-3xl text-main leading-tight mt-3 sm:mt-4">
            {user?.name || 'User'}
          </h1>

          {/* Headline — wrapping, multi-line */}
          {user?.headline && (
            <p className="mt-2 text-base md:text-lg text-muted leading-relaxed break-words max-w-xl">
              {user.headline}
            </p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 mt-3">
            {user?.email && (
              <span className="inline-flex items-center gap-1.5 text-muted text-xs md:text-sm">
                <Mail className="w-3.5 h-3.5 md:w-4 md:h-4" />
                {user.email}
              </span>
            )}
            {memberSince && (
              <span className="inline-flex items-center gap-1.5 text-muted text-xs md:text-sm">
                <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                Joined {memberSince}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons — centered, stacked on mobile, inline on sm+ */}
        {isOwner && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-center gap-2.5 sm:gap-3 mt-5 pt-5 border-t border-border/50">
            <button
              onClick={() => navigate('/profile/edit')}
              className="btn-primary inline-flex items-center justify-center gap-2 text-white font-semibold px-5 py-2.5 md:py-3 rounded-xl text-sm md:text-base active:scale-[0.98] transition-transform"
            >
              <Pencil className="w-4 h-4" />
              Edit Full Profile
            </button>
            <button
              onClick={() => {
                const url = `${window.location.origin}/profile/${user?._id}`;
                navigator.clipboard.writeText(url);
                alert('Profile link copied!');
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 md:py-3 rounded-xl text-sm md:text-base font-medium text-muted border border-border hover:text-accent hover:border-accent/30 hover:bg-accent/5 active:scale-[0.98] transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              Share Profile
            </button>
          </div>
        )}

        {/* Profile completion bar */}
        {isOwner && completionPct < 100 && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs md:text-sm font-medium text-muted">Profile Strength</span>
              <span className="text-xs md:text-sm font-semibold text-accent">{completionPct}%</span>
            </div>
            <div className="h-2 bg-border/50 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${completionPct}%`,
                  background: 'linear-gradient(90deg, var(--accent), var(--accent-light))',
                }}
              />
            </div>
            <p className="text-[11px] md:text-xs text-muted mt-1.5">
              Complete your profile to increase visibility
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
