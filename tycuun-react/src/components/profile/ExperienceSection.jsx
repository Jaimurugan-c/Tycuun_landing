import { useState } from 'react';
import { Briefcase, Pencil, Trash2, Plus, X, Check, Loader2 } from 'lucide-react';
import SkillsInput from './SkillsInput';
import ReadMoreText from './ReadMoreText';
import DateDropdown, { formatDateRangeDisplay, formatMonthYear, normalizeDateValue } from './DateDropdown';
import * as api from '../../services/api';

const INPUT_CLASS =
  'w-full px-4 py-3 bg-bg border border-border rounded-xl text-main text-sm md:text-base placeholder-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all';

function calcDuration(exp) {
  if (!exp.startDate) return '';
  const parts = exp.startDate.split('-');
  const startY = parseInt(parts[0], 10);
  const startM = parseInt(parts[1], 10) || 1;
  const now = new Date();
  let endY, endM;
  if (exp.currentWorking || !exp.endDate) {
    endY = now.getFullYear();
    endM = now.getMonth() + 1;
  } else {
    const eParts = exp.endDate.split('-');
    endY = parseInt(eParts[0], 10);
    endM = parseInt(eParts[1], 10) || 1;
  }
  if (isNaN(startY) || isNaN(endY)) return '';
  let months = (endY - startY) * 12 + (endM - startM);
  if (months < 0) months = 0;
  const yrs = Math.floor(months / 12);
  const mos = months % 12;
  const p = [];
  if (yrs > 0) p.push(`${yrs} yr${yrs > 1 ? 's' : ''}`);
  if (mos > 0) p.push(`${mos} mo${mos > 1 ? 's' : ''}`);
  return p.join(' ') || '< 1 mo';
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
    company: '', role: '', years: '', startDate: '', endDate: '',
    currentWorking: false, description: '', skills: '',
  });

  const startEdit = (i) => {
    setEditingIndex(i); setAdding(false);
    const item = experience[i];
    setDraft({
      ...blank(),
      ...item,
      startDate: normalizeDateValue(item.startDate),
      endDate: normalizeDateValue(item.endDate),
      currentWorking: item.currentWorking || false,
    });
  };
  const startAdd = () => { setAdding(true); setEditingIndex(null); setDraft(blank()); };
  const cancel = () => { setEditingIndex(null); setAdding(false); setDraft(null); };

  const handleField = (field, value) => {
    setDraft((d) => {
      const updated = { ...d, [field]: value };
      if (field === 'currentWorking' && value) updated.endDate = '';
      return updated;
    });
  };

  const startDate = normalizeDateValue(draft?.startDate);
  const endDate = normalizeDateValue(draft?.endDate);
  const dateError =
    startDate && endDate && !draft?.currentWorking && startDate > endDate
      ? 'End date cannot be before start date'
      : '';

  const save = async () => {
    if (dateError) return alert(dateError);
    setSaving(true);
    try {
      const updated = [...experience];
      const entry = {
        ...draft,
        years: draft.startDate
          ? draft.currentWorking || !draft.endDate
            ? `${formatMonthYear(draft.startDate)} – Present`
            : `${formatMonthYear(draft.startDate)} – ${formatMonthYear(draft.endDate)}`
          : draft.years,
      };
      if (adding) updated.push(entry);
      else if (editingIndex !== null) updated[editingIndex] = entry;
      await api.updateProfile({ experience: updated });
      onUpdated?.(); cancel();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDelete = async (i) => {
    if (!confirm('Delete this experience?')) return;
    setSaving(true);
    try {
      await api.updateProfile({ experience: experience.filter((_, idx) => idx !== i) });
      onUpdated?.();
    } catch (err) { alert(err.response?.data?.message || 'Failed to delete'); }
    finally { setSaving(false); }
  };

  const isEditing = editingIndex !== null || adding;

  const renderForm = () => (
    <div className="p-4 md:p-5 bg-bg rounded-xl border border-accent/30 space-y-4 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div>
          <label className="block text-xs md:text-sm font-medium text-muted mb-1.5">Company Name</label>
          <input value={draft.company} onChange={(e) => handleField('company', e.target.value)} placeholder="e.g. Google" className={INPUT_CLASS} autoFocus />
        </div>
        <div>
          <label className="block text-xs md:text-sm font-medium text-muted mb-1.5">Role</label>
          <input value={draft.role} onChange={(e) => handleField('role', e.target.value)} placeholder="e.g. Senior Software Engineer" className={INPUT_CLASS} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <DateDropdown
          label="Start Date"
          value={draft.startDate}
          onChange={(val) => handleField('startDate', val)}
        />
        <DateDropdown
          label="End Date"
          value={draft.endDate}
          onChange={(val) => handleField('endDate', val)}
          showPresent
          isPresent={draft.currentWorking || false}
          onPresentChange={(checked) => handleField('currentWorking', checked)}
          minDate={draft.startDate}
          error={dateError}
        />
      </div>
      <div>
        <label className="block text-xs md:text-sm font-medium text-muted mb-1.5">Description</label>
        <textarea value={draft.description} onChange={(e) => handleField('description', e.target.value)} rows={3} placeholder="Describe your responsibilities..." className={INPUT_CLASS + ' resize-none'} />
      </div>
      <div>
        <label className="block text-xs md:text-sm font-medium text-muted mb-1.5">Skills</label>
        <SkillsInput value={draft.skills} onChange={(val) => handleField('skills', val)} />
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
          <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-accent" />
          <h2 className="font-display font-semibold text-lg md:text-xl text-main">Experience</h2>
        </div>
        {isOwner && !isEditing && (
          <button onClick={startAdd} className="inline-flex items-center gap-1.5 text-accent text-sm md:text-base font-medium hover:underline px-2 py-1.5 rounded-lg hover:bg-accent/5 active:scale-95 transition-all">
            <Plus className="w-4 h-4 md:w-5 md:h-5" /> Add
          </button>
        )}
      </div>

      {adding && renderForm()}

      {experience.length > 0 ? (
        <div className={`space-y-4 md:space-y-5 ${adding ? 'mt-5' : ''}`}>
          {experience.map((item, i) => {
            const dateRange = formatDateRangeDisplay(item.startDate, item.endDate, item.currentWorking);
            const duration = calcDuration(item);
            const skills = parseSkills(item.skills);
            const isThisEditing = editingIndex === i;

            return (
              <div key={item._id || i}>
                {isThisEditing ? renderForm() : (
                  <div className={`group flex gap-3 md:gap-4 ${i < experience.length - 1 ? 'pb-4 md:pb-5 border-b border-border/50' : ''}`}>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1 md:gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm md:text-base text-main">{item.role || 'Role'}</h3>
                          <p className="text-muted text-sm md:text-base">{item.company || 'Company'}</p>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-2 flex-shrink-0">
                          {(dateRange || duration) && (
                            <div className="flex items-center gap-1.5 text-muted text-xs md:text-sm whitespace-nowrap">
                              {dateRange && <span>{dateRange}</span>}
                              {duration && <><span className="text-border">·</span><span>{duration}</span></>}
                            </div>
                          )}
                          {isOwner && !isEditing && (
                            <div className="flex items-center gap-0.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex-shrink-0">
                              <button onClick={() => startEdit(i)} className="p-2 rounded-lg text-muted hover:text-accent hover:bg-cardHover active:scale-90 transition-all" title="Edit"><Pencil className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete(i)} className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/10 active:scale-90 transition-all" title="Delete"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          )}
                        </div>
                      </div>
                      {item.currentWorking && (
                        <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-accent/10 text-accent text-[11px] md:text-xs font-semibold rounded-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                          Currently Working
                        </span>
                      )}
                      {item.description && (
                        <div className="mt-2 md:mt-3">
                          <ReadMoreText text={item.description} lines={3} className="text-muted text-sm md:text-base" />
                        </div>
                      )}
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
        <p className="text-muted text-sm md:text-base">No experience added yet.</p>
      ) : null}
    </div>
  );
}
