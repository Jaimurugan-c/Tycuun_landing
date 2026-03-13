import { useState } from 'react';
import { Pencil, X, Check, Loader2 } from 'lucide-react';
import ReadMoreText from './ReadMoreText';
import * as api from '../../services/api';

export default function AboutSection({ bio, isOwner, onUpdated }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    setDraft(bio || '');
    setEditing(true);
  };

  const cancel = () => setEditing(false);

  const save = async () => {
    setSaving(true);
    try {
      await api.updateProfile({ bio: draft });
      onUpdated?.();
      setEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-bg border border-border rounded-xl text-main text-sm md:text-base placeholder-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all resize-none';

  return (
    <div className="bg-card border border-border rounded-2xl p-4 md:p-6 transition-all duration-200 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/8">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 md:w-6 md:h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h2 className="font-display font-semibold text-lg md:text-xl text-main">About</h2>
        </div>

        {isOwner && !editing && (
          <button
            onClick={startEdit}
            className="p-2 md:p-2.5 rounded-lg text-muted hover:text-accent hover:bg-cardHover active:scale-95 transition-all"
            title="Edit bio"
          >
            <Pencil className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        )}

        {editing && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={cancel}
              disabled={saving}
              className="p-2 md:p-2.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/10 active:scale-95 transition-all"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="p-2 md:p-2.5 rounded-lg text-accent hover:bg-accent/10 active:scale-95 transition-all"
            >
              {saving ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : <Check className="w-4 h-4 md:w-5 md:h-5" />}
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={5}
          placeholder="Tell people about yourself..."
          className={inputClass}
          autoFocus
        />
      ) : bio ? (
        <ReadMoreText
          text={bio}
          lines={3}
          className="text-muted text-sm md:text-base"
        />
      ) : (
        <p className="text-muted text-sm md:text-base leading-relaxed">
          No bio added yet.
        </p>
      )}
    </div>
  );
}
