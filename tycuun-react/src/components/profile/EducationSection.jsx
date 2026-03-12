import { useState } from 'react';
import { GraduationCap, Pencil, Trash2, Plus, X, Check, Loader2 } from 'lucide-react';
import SkillsInput from './SkillsInput';
import * as api from '../../services/api';

const INPUT_CLASS =
  'w-full px-4 py-3 bg-bg border border-border rounded-xl text-main text-sm md:text-base placeholder-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all';

function fmtDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function formatDateRange(edu) {
  const start = fmtDate(edu.startDate);
  const end = fmtDate(edu.endDate);
  if (start && end) return `${start} — ${end}`;
  if (start) return `${start} — Present`;
  if (edu.year) return edu.year;
  return '';
}

function parseSkills(s) {
  return s ? s.split(',').map((x) => x.trim()).filter(Boolean) : [];
}

export default function EducationSection({ education = [], isOwner, onUpdated }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  const blank = () => ({ institution: '', school: '', degree: '', year: '', startDate: '', endDate: '', description: '', skills: '' });

  const startEdit = (i) => { setEditingIndex(i); setAdding(false); setDraft({ ...education[i], institution: education[i].institution || education[i].school || '' }); };
  const startAdd = () => { setAdding(true); setEditingIndex(null); setDraft(blank()); };
  const cancel = () => { setEditingIndex(null); setAdding(false); setDraft(null); };
  const handleField = (field, value) => { setDraft((d) => ({ ...d, [field]: value })); };

  const save = async () => {
    setSaving(true);
    try {
      const updated = [...education];
      const entry = { ...draft, school: draft.institution || draft.school, year: draft.startDate && draft.endDate ? `${draft.startDate} – ${draft.endDate}` : draft.startDate ? `${draft.startDate} – Present` : draft.year };
      if (adding) updated.push(entry);
      else if (editingIndex !== null) updated[editingIndex] = entry;
      await api.updateProfile({ education: updated });
      onUpdated?.(); cancel();
    } catch (err) { alert(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (i) => {
    if (!confirm('Delete this education?')) return;
    setSaving(true);
    try { await api.updateProfile({ education: education.filter((_, idx) => idx !== i) }); onUpdated?.(); }
    catch (err) { alert(err.response?.data?.message || 'Failed to delete'); }
    finally { setSaving(false); }
  };

  const isEditing = editingIndex !== null || adding;

  const renderForm = () => (
    <div className="p-4 md:p-5 bg-bg rounded-xl border border-accent/30 space-y-4 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div>
          <label className="block text-xs md:text-sm font-medium text-muted mb-1.5">Institution</label>
          <input value={draft.institution} onChange={(e) => handleField('institution', e.target.value)} placeholder="e.g. Stanford University" className={INPUT_CLASS} />
        </div>
        <div>
          <label className="block text-xs md:text-sm font-medium text-muted mb-1.5">Degree / Program</label>
          <input value={draft.degree} onChange={(e) => handleField('degree', e.target.value)} placeholder="e.g. B.S. Computer Science" className={INPUT_CLASS} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div>
          <label className="block text-xs md:text-sm font-medium text-muted mb-1.5">Start Date</label>
          <input type="date" value={draft.startDate} onChange={(e) => handleField('startDate', e.target.value)} className={INPUT_CLASS} />
        </div>
        <div>
          <label className="block text-xs md:text-sm font-medium text-muted mb-1.5">End Date</label>
          <input type="date" value={draft.endDate} onChange={(e) => handleField('endDate', e.target.value)} className={INPUT_CLASS} />
          <p className="text-[11px] md:text-xs text-muted mt-1">Leave empty if currently studying</p>
        </div>
      </div>
      <div>
        <label className="block text-xs md:text-sm font-medium text-muted mb-1.5">Description</label>
        <textarea value={draft.description} onChange={(e) => handleField('description', e.target.value)} rows={3} placeholder="Activities, achievements, coursework..." className={INPUT_CLASS + ' resize-none'} />
      </div>
      <div>
        <label className="block text-xs md:text-sm font-medium text-muted mb-1.5">Skills (optional)</label>
        <SkillsInput value={draft.skills} onChange={(val) => handleField('skills', val)} placeholder="e.g. Python, Machine Learning" />
      </div>
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-1">
        <button onClick={cancel} disabled={saving} className="px-4 py-2.5 rounded-lg text-sm md:text-base font-medium text-muted hover:text-main hover:bg-cardHover active:scale-[0.98] transition-all">Cancel</button>
        <button onClick={save} disabled={saving} className="btn-primary inline-flex items-center justify-center gap-2 text-white font-semibold px-5 py-2.5 rounded-lg text-sm md:text-base disabled:opacity-50 active:scale-[0.98] transition-transform">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          {adding ? 'Add' : 'Save'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-2xl p-4 md:p-6 transition-all duration-200 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/8">
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-accent" />
          <h2 className="font-display font-semibold text-lg md:text-xl text-main">Education</h2>
        </div>
        {isOwner && !isEditing && (
          <button onClick={startAdd} className="inline-flex items-center gap-1.5 text-accent text-sm md:text-base font-medium hover:underline px-2 py-1.5 rounded-lg hover:bg-accent/5 active:scale-95 transition-all">
            <Plus className="w-4 h-4 md:w-5 md:h-5" /> Add
          </button>
        )}
      </div>

      {adding && renderForm()}

      {education.length > 0 ? (
        <div className={`space-y-4 md:space-y-5 ${adding ? 'mt-5' : ''}`}>
          {education.map((item, i) => {
            const dateRange = formatDateRange(item);
            const displayName = item.institution || item.school || 'Institution';
            const skills = parseSkills(item.skills);
            const isThisEditing = editingIndex === i;

            return (
              <div key={item._id || i}>
                {isThisEditing ? renderForm() : (
                  <div className={`group flex gap-3 md:gap-4 ${i < education.length - 1 ? 'pb-4 md:pb-5 border-b border-border/50' : ''}`}>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1 md:gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm md:text-base text-main">{displayName}</h3>
                          {item.degree && <p className="text-muted text-sm md:text-base">{item.degree}</p>}
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-2 flex-shrink-0">
                          {dateRange && <p className="text-muted text-xs md:text-sm whitespace-nowrap">{dateRange}</p>}
                          {isOwner && !isEditing && (
                            <div className="flex items-center gap-0.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex-shrink-0">
                              <button onClick={() => startEdit(i)} className="p-2 rounded-lg text-muted hover:text-accent hover:bg-cardHover active:scale-90 transition-all" title="Edit"><Pencil className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete(i)} className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/10 active:scale-90 transition-all" title="Delete"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          )}
                        </div>
                      </div>
                      {item.description && <p className="text-muted text-sm md:text-base mt-2 md:mt-3 leading-relaxed whitespace-pre-wrap">{item.description}</p>}
                      {skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 md:gap-2 mt-2.5 md:mt-3">
                          {skills.map((skill, si) => (
                            <span key={si} className="px-3 py-1 md:py-1.5 bg-accent/10 text-accent text-xs md:text-sm font-medium rounded-full">{skill}</span>
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
        <p className="text-muted text-sm md:text-base">No education added yet.</p>
      ) : null}
    </div>
  );
}
