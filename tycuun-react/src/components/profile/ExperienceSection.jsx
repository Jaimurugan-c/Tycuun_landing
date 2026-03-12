import { useState } from 'react';
import { Briefcase, Pencil, Trash2, Plus, X, Check, Loader2 } from 'lucide-react';
import SkillsInput from './SkillsInput';
import * as api from '../../services/api';

const INPUT_CLASS =
  'w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-main placeholder-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all text-sm';

const DISABLED_CLASS =
  'w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-muted placeholder-muted text-sm opacity-50 cursor-not-allowed';

/** Format "2022-01-15" → "Jan 2022" */
function fmtDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function formatDateRange(exp) {
  const start = fmtDate(exp.startDate);
  if (exp.currentWorking) return start ? `${start} — Present` : 'Present';
  const end = fmtDate(exp.endDate);
  if (start && end) return `${start} — ${end}`;
  if (start) return `${start} — Present`;
  if (exp.years) return exp.years;
  return '';
}

/** Calculate duration like "2 yrs 3 mos" */
function calcDuration(exp) {
  if (!exp.startDate) return '';
  const start = new Date(exp.startDate + 'T00:00:00');
  const end = exp.currentWorking || !exp.endDate ? new Date() : new Date(exp.endDate + 'T00:00:00');
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return '';
  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (months < 0) months = 0;
  const yrs = Math.floor(months / 12);
  const mos = months % 12;
  const parts = [];
  if (yrs > 0) parts.push(`${yrs} yr${yrs > 1 ? 's' : ''}`);
  if (mos > 0) parts.push(`${mos} mo${mos > 1 ? 's' : ''}`);
  return parts.join(' ') || '< 1 mo';
}

function parseSkills(s) {
  return s ? s.split(',').map((x) => x.trim()).filter(Boolean) : [];
}

export default function ExperienceSection({ experience = [], isOwner, onUpdated }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  const blank = () => ({
    company: '',
    role: '',
    years: '',
    startDate: '',
    endDate: '',
    currentWorking: false,
    description: '',
    skills: '',
  });

  const startEdit = (i) => {
    setEditingIndex(i);
    setAdding(false);
    setDraft({
      ...experience[i],
      currentWorking: experience[i].currentWorking || false,
    });
  };

  const startAdd = () => {
    setAdding(true);
    setEditingIndex(null);
    setDraft(blank());
  };

  const cancel = () => {
    setEditingIndex(null);
    setAdding(false);
    setDraft(null);
  };

  const handleField = (field, value) => {
    setDraft((d) => {
      const updated = { ...d, [field]: value };
      // If checking "currentWorking", clear endDate
      if (field === 'currentWorking' && value) {
        updated.endDate = '';
      }
      return updated;
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      const updated = [...experience];
      const entry = {
        ...draft,
        years: draft.startDate
          ? draft.currentWorking || !draft.endDate
            ? `${draft.startDate} – Present`
            : `${draft.startDate} – ${draft.endDate}`
          : draft.years,
      };

      if (adding) updated.push(entry);
      else if (editingIndex !== null) updated[editingIndex] = entry;

      await api.updateProfile({ experience: updated });
      onUpdated?.();
      cancel();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (i) => {
    if (!confirm('Delete this experience?')) return;
    setSaving(true);
    try {
      await api.updateProfile({ experience: experience.filter((_, idx) => idx !== i) });
      onUpdated?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  const isEditing = editingIndex !== null || adding;

  const renderForm = () => (
    <div className="p-5 bg-bg rounded-xl border border-accent/30 space-y-4 mt-4">
      {/* Company + Role */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">Company Name</label>
          <input
            value={draft.company}
            onChange={(e) => handleField('company', e.target.value)}
            placeholder="e.g. Google"
            className={INPUT_CLASS}
            autoFocus
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">Role</label>
          <input
            value={draft.role}
            onChange={(e) => handleField('role', e.target.value)}
            placeholder="e.g. Senior Software Engineer"
            className={INPUT_CLASS}
          />
        </div>
      </div>

      {/* Dates + Currently Working */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">Start Date</label>
          <input
            type="date"
            value={draft.startDate}
            onChange={(e) => handleField('startDate', e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">End Date</label>
          <input
            type="date"
            value={draft.endDate}
            onChange={(e) => handleField('endDate', e.target.value)}
            disabled={draft.currentWorking}
            className={draft.currentWorking ? DISABLED_CLASS : INPUT_CLASS}
          />
        </div>
      </div>

      {/* Currently Working checkbox */}
      <label className="flex items-center gap-2.5 cursor-pointer select-none group">
        <div className="relative">
          <input
            type="checkbox"
            checked={draft.currentWorking}
            onChange={(e) => handleField('currentWorking', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-5 h-5 rounded-md border-2 border-border bg-bg peer-checked:bg-accent peer-checked:border-accent transition-all flex items-center justify-center">
            {draft.currentWorking && (
              <Check className="w-3.5 h-3.5 text-white" />
            )}
          </div>
        </div>
        <span className="text-sm text-muted group-hover:text-main transition-colors">
          I currently work here
        </span>
      </label>

      {/* Description */}
      <div>
        <label className="block text-xs font-medium text-muted mb-1.5">Description</label>
        <textarea
          value={draft.description}
          onChange={(e) => handleField('description', e.target.value)}
          rows={3}
          placeholder="Describe your responsibilities and achievements..."
          className={INPUT_CLASS + ' resize-none'}
        />
      </div>

      {/* Skills */}
      <div>
        <label className="block text-xs font-medium text-muted mb-1.5">Skills</label>
        <SkillsInput
          value={draft.skills}
          onChange={(val) => handleField('skills', val)}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          onClick={cancel}
          disabled={saving}
          className="px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-main hover:bg-cardHover transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={save}
          disabled={saving}
          className="btn-primary inline-flex items-center gap-2 text-white font-semibold px-4 py-2 rounded-lg text-sm disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          {adding ? 'Add' : 'Save'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-2xl p-6 transition-colors shadow-lg shadow-black/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-accent" />
          <h2 className="font-display font-semibold text-lg text-main">Experience</h2>
        </div>
        {isOwner && !isEditing && (
          <button
            onClick={startAdd}
            className="inline-flex items-center gap-1.5 text-accent text-sm font-medium hover:underline"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        )}
      </div>

      {adding && renderForm()}

      {experience.length > 0 ? (
        <div className={`space-y-5 ${adding ? 'mt-5' : ''}`}>
          {experience.map((item, i) => {
            const dateRange = formatDateRange(item);
            const duration = calcDuration(item);
            const skills = parseSkills(item.skills);
            const isThisEditing = editingIndex === i;

            return (
              <div key={item._id || i}>
                {isThisEditing ? (
                  renderForm()
                ) : (
                  <div
                    className={`group flex gap-4 ${
                      i < experience.length - 1 ? 'pb-5 border-b border-border/50' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Briefcase className="w-5 h-5 text-accent" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm text-main">
                            {item.role || 'Role'}
                          </h3>
                          <p className="text-muted text-sm">{item.company || 'Company'}</p>
                        </div>
                        {isOwner && !isEditing && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <button
                              onClick={() => startEdit(i)}
                              className="p-1.5 rounded-lg text-muted hover:text-accent hover:bg-cardHover transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(i)}
                              className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Date range + duration */}
                      {(dateRange || duration) && (
                        <div className="flex items-center gap-2 mt-0.5">
                          {dateRange && (
                            <p className="text-muted text-xs">{dateRange}</p>
                          )}
                          {duration && (
                            <>
                              <span className="text-border text-xs">·</span>
                              <p className="text-muted text-xs">{duration}</p>
                            </>
                          )}
                        </div>
                      )}

                      {/* "Present" badge for current roles */}
                      {item.currentWorking && (
                        <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-accent/10 text-accent text-[11px] font-semibold rounded-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                          Currently Working
                        </span>
                      )}

                      {item.description && (
                        <p className="text-muted text-sm mt-2 leading-relaxed whitespace-pre-wrap">
                          {item.description}
                        </p>
                      )}
                      {skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {skills.map((skill, si) => (
                            <span
                              key={si}
                              className="px-2.5 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : !adding ? (
        <p className="text-muted text-sm">No experience added yet.</p>
      ) : null}
    </div>
  );
}
