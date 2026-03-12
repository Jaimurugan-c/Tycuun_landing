import { useState } from 'react';
import { Sparkles, Plus, X, Check, Loader2 } from 'lucide-react';
import * as api from '../../services/api';

const INPUT_CLASS =
  'w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-main placeholder-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all text-sm';

export default function SkillsSection({ skills = [], isOwner, onUpdated }) {
  const [adding, setAdding] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);

  const addSkill = async () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;

    // Support comma-separated batch add
    const toAdd = trimmed
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => !skills.includes(s));

    if (toAdd.length === 0) {
      setNewSkill('');
      return;
    }

    setSaving(true);
    try {
      await api.updateProfile({ skills: [...skills, ...toAdd] });
      onUpdated?.();
      setNewSkill('');
      setAdding(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const removeSkill = async (index) => {
    setSaving(true);
    try {
      const updated = skills.filter((_, i) => i !== index);
      await api.updateProfile({ skills: updated });
      onUpdated?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
    if (e.key === 'Escape') {
      setAdding(false);
      setNewSkill('');
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 transition-colors shadow-lg shadow-black/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <h2 className="font-display font-semibold text-lg text-main">Skills</h2>
          {skills.length > 0 && (
            <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">
              {skills.length}
            </span>
          )}
        </div>
        {isOwner && !adding && (
          <button
            onClick={() => setAdding(true)}
            className="p-2 rounded-lg text-muted hover:text-accent hover:bg-cardHover transition-colors"
            title="Add skill"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Add input */}
      {adding && (
        <div className="flex items-center gap-2 mb-4">
          <input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. React, Node.js (press Enter)"
            className={INPUT_CLASS}
            autoFocus
          />
          <button
            onClick={() => {
              setAdding(false);
              setNewSkill('');
            }}
            className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={addSkill}
            disabled={saving || !newSkill.trim()}
            className="p-2 rounded-lg text-accent hover:bg-accent/10 transition-colors flex-shrink-0 disabled:opacity-40"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
          </button>
        </div>
      )}

      {/* Skill pills */}
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <span
              key={i}
              className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-accent/10 text-accent text-sm font-medium rounded-full transition-colors hover:bg-accent/15"
            >
              {skill}
              {isOwner && (
                <button
                  onClick={() => removeSkill(i)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-full hover:bg-accent/25"
                  title="Remove skill"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-muted text-sm">
          {isOwner ? 'Add your skills to showcase your expertise.' : 'No skills added yet.'}
        </p>
      )}
    </div>
  );
}
