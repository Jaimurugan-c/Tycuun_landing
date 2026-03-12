import { Pencil, Mail, Calendar, MapPin } from 'lucide-react';

export default function ProfileHeader({ user, isOwner, onEdit }) {
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden transition-colors">
      {/* Banner */}
      <div
        className="h-32 sm:h-40 relative"
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

        {/* Edit icon — top-right corner of the banner */}
        {isOwner && (
          <button
            onClick={onEdit}
            className="absolute top-3 right-3 p-2 rounded-lg bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-colors text-white"
            title="Edit Profile"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="px-6 pb-6 -mt-12 sm:-mt-14 relative">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex items-end gap-4">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 object-cover flex-shrink-0"
                style={{ borderColor: 'var(--card)' }}
              />
            ) : (
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 flex items-center justify-center text-white font-display font-bold text-3xl sm:text-4xl flex-shrink-0"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent), var(--accent-light))',
                  borderColor: 'var(--card)',
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div className="pb-1 min-w-0">
              <h1 className="font-display font-bold text-2xl text-main truncate">
                {user?.name || 'User'}
              </h1>
              <p className="text-muted text-sm truncate">
                {user?.headline || 'No headline yet'}
              </p>
            </div>
          </div>

          {isOwner && (
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-accent border border-accent/30 hover:bg-accent/10 transition-colors self-start sm:self-end"
            >
              <Pencil className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        {/* Meta info row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3">
          {user?.email && (
            <span className="inline-flex items-center gap-1.5 text-muted text-xs">
              <Mail className="w-3.5 h-3.5" />
              {user.email}
            </span>
          )}
          {memberSince && (
            <span className="inline-flex items-center gap-1.5 text-muted text-xs">
              <Calendar className="w-3.5 h-3.5" />
              Joined {memberSince}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
