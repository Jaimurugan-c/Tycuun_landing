import { useState } from 'react';
import { Sparkles, Plus, X, Check, Loader2 } from 'lucide-react';
import * as api from '../../services/api';

const INPUT_CLASS =
  'w-full px-4 py-3 bg-bg border border-border rounded-xl text-main text-sm md:text-base placeholder-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all';

export default function SkillsSection({ skills = [], isOwner, onUpdated }) {
  const [adding, setAdding] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);

  const addSkill = async () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    const toAdd = trimmed.split(',').map((s) => s.trim()).filter(Boolean).filter((s) => !skills.includes(s));
    if (toAdd.length === 0) { setNewSkill(''); return; }
    setSaving(true);
    try {
      await api.updateProfile({ skills: [...skills, ...toAdd] });
      onUpdated?.(); setNewSkill(''); setAdding(false);
    } catch (err) { alert(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const removeSkill = async (index) => {
    setSaving(true);
    try {
      await api.updateProfile({ skills: skills.filter((_, i) => i !== index) });
      onUpdated?.();
    } catch (err) { alert(err.response?.data?.message || 'Failed to delete'); }
    finally { setSaving(false); }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
    if (e.key === 'Escape') { setAdding(false); setNewSkill(''); }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4 md:p-5 transition-all duration-200 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/8">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-accent" />
          <h2 className="font-display font-semibold text-lg md:text-xl text-main">Skills</h2>
          {skills.length > 0 && (
            <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">{skills.length}</span>
          )}
        </div>
        {isOwner && !adding && (
          <button
            onClick={() => setAdding(true)}
            className="p-2 md:p-2.5 rounded-lg text-muted hover:text-accent hover:bg-cardHover active:scale-95 transition-all"
            title="Add skill"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        )}
      </div>

      {adding && (
        <div className="flex items-center gap-2 mb-3 md:mb-4">
          <input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. React, Node.js (press Enter)"
            className={INPUT_CLASS}
            autoFocus
          />
          <button onClick={() => { setAdding(false); setNewSkill(''); }} className="p-2 md:p-2.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/10 active:scale-95 transition-all flex-shrink-0">
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button onClick={addSkill} disabled={saving || !newSkill.trim()} className="p-2 md:p-2.5 rounded-lg text-accent hover:bg-accent/10 active:scale-95 transition-all flex-shrink-0 disabled:opacity-40">
            {saving ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : <Check className="w-4 h-4 md:w-5 md:h-5" />}
          </button>
        </div>
      )}

      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2 md:gap-2.5">
          {skills.map((skill, i) => (
            <span
              key={i}
              className="group inline-flex items-center gap-1.5 px-3 md:px-3.5 py-1.5 md:py-2 bg-accent/10 text-accent text-sm md:text-base font-medium rounded-full transition-colors hover:bg-accent/15"
            >
              {skill}
              {isOwner && (
                <button
                  onClick={() => removeSkill(i)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-full hover:bg-accent/25 active:scale-90"
                  title="Remove skill"
                >
                  <X className="w-3 h-3 md:w-3.5 md:h-3.5" />
                </button>
              )}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-muted text-sm md:text-base">
          {isOwner ? 'Add your skills to showcase your expertise.' : 'No skills added yet.'}
        </p>
      )}
    </div>
  );
}
