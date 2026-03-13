import { useState } from 'react';
import { Award, Pencil, Trash2, Plus, X, Check, Loader2, ExternalLink } from 'lucide-react';
import SkillsInput from './SkillsInput';
import ReadMoreText from './ReadMoreText';
import * as api from '../../services/api';

const INPUT_CLASS =
  'w-full px-4 py-3 bg-bg border border-border rounded-xl text-main text-sm md:text-base placeholder-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all';

function fmtDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function CertificationsSection({ certifications = [], isOwner, onUpdated }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  const blank = () => ({ name: '', organization: '', issueDate: '', credentialId: '', credentialUrl: '', description: '', skills: '' });

  const startEdit = (i) => { setEditingIndex(i); setAdding(false); setDraft({ ...blank(), ...certifications[i] }); };
  const startAdd = () => { setAdding(true); setEditingIndex(null); setDraft(blank()); };
  const cancel = () => { setEditingIndex(null); setAdding(false); setDraft(null); };
  const handleField = (field, value) => { setDraft((d) => ({ ...d, [field]: value })); };

  const save = async () => {
    if (!draft.name.trim()) return alert('Certification name is required');
    setSaving(true);
    try {
      const updated = [...certifications];
      if (adding) updated.push(draft);
      else if (editingIndex !== null) updated[editingIndex] = draft;
      await api.updateProfile({ certifications: updated });
      onUpdated?.(); cancel();
    } catch (err) { alert(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (i) => {
    if (!confirm('Delete this certification?')) return;
    setSaving(true);
    try { await api.updateProfile({ certifications: certifications.filter((_, idx) => idx !== i) }); onUpdated?.(); }
    catch (err) { alert(err.response?.data?.message || 'Failed to delete'); }
    finally { setSaving(false); }
  };

  const isEditing = editingIndex !== null || adding;

  const renderForm = () => (
    <div className="p-4 md:p-5 bg-bg rounded-xl border border-accent/30 space-y-4 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div>
          <label className="block text-xs md:text-sm font-medium text-muted mb-1.5">Certification Name</label>
          <input value={draft.name} onChange={(e) => handleField('name', e.target.value)} placeholder="e.g. AWS Solutions Architect" className={INPUT_CLASS} autoFocus />
        </div>
        <div>
          <label className="block text-xs md:text-sm font-medium text-muted mb-1.5">Issuing Organization</label>
          <input value={draft.organization} onChange={(e) => handleField('organization', e.target.value)} placeholder="e.g. Amazon Web Services" className={INPUT_CLASS} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div>
          <label className="block text-xs md:text-sm font-medium text-muted mb-1.5">Issue Date</label>
          <input type="date" value={draft.issueDate} onChange={(e) => handleField('issueDate', e.target.value)} className={INPUT_CLASS} />
        </div>
        <div>
          <label className="block text-xs md:text-sm font-medium text-muted mb-1.5">Credential ID</label>
          <input value={draft.credentialId} onChange={(e) => handleField('credentialId', e.target.value)} placeholder="e.g. ABC123XYZ" className={INPUT_CLASS} />
        </div>
      </div>
      <div>
        <label className="block text-xs md:text-sm font-medium text-muted mb-1.5">Credential URL</label>
        <input value={draft.credentialUrl} onChange={(e) => handleField('credentialUrl', e.target.value)} placeholder="https://..." className={INPUT_CLASS} />
      </div>
      <div>
        <label className="block text-xs md:text-sm font-medium text-muted mb-1.5">Description</label>
        <textarea value={draft.description} onChange={(e) => handleField('description', e.target.value)} rows={3} placeholder="What this certification covers..." className={INPUT_CLASS + ' resize-none'} />
      </div>
      <div>
        <label className="block text-xs md:text-sm font-medium text-muted mb-1.5">Skills (optional)</label>
        <SkillsInput value={draft.skills} onChange={(val) => handleField('skills', val)} placeholder="e.g. AWS, Cloud Architecture" />
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
          <Award className="w-5 h-5 md:w-6 md:h-6 text-accent" />
          <h2 className="font-display font-semibold text-lg md:text-xl text-main">Certifications</h2>
          {certifications.length > 0 && (
            <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">{certifications.length}</span>
          )}
        </div>
        {isOwner && !isEditing && (
          <button onClick={startAdd} className="inline-flex items-center gap-1.5 text-accent text-sm md:text-base font-medium hover:underline px-2 py-1.5 rounded-lg hover:bg-accent/5 active:scale-95 transition-all">
            <Plus className="w-4 h-4 md:w-5 md:h-5" /> Add
          </button>
        )}
      </div>

      {adding && renderForm()}

      {certifications.length > 0 ? (
        <div className={`space-y-4 md:space-y-5 ${adding ? 'mt-5' : ''}`}>
          {certifications.map((cert, i) => {
            const isThisEditing = editingIndex === i;
            const issueDateFmt = fmtDate(cert.issueDate);

            return (
              <div key={cert._id || i}>
                {isThisEditing ? renderForm() : (
                  <div className={`group flex gap-3 md:gap-4 ${i < certifications.length - 1 ? 'pb-4 md:pb-5 border-b border-border/50' : ''}`}>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Award className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1 md:gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm md:text-base text-main">{cert.name || 'Certification'}</h3>
                          {cert.organization && <p className="text-muted text-sm md:text-base">{cert.organization}</p>}
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-2 flex-shrink-0">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                            {issueDateFmt && <p className="text-muted text-xs md:text-sm whitespace-nowrap">Issued {issueDateFmt}</p>}
                            {cert.credentialId && <p className="text-muted text-xs md:text-sm whitespace-nowrap">ID: {cert.credentialId}</p>}
                          </div>
                          {isOwner && !isEditing && (
                            <div className="flex items-center gap-0.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex-shrink-0">
                              <button onClick={() => startEdit(i)} className="p-2 rounded-lg text-muted hover:text-accent hover:bg-cardHover active:scale-90 transition-all" title="Edit"><Pencil className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete(i)} className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/10 active:scale-90 transition-all" title="Delete"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          )}
                        </div>
                      </div>

                      {cert.description && (
                        <div className="mt-2 md:mt-3">
                          <ReadMoreText
                            text={cert.description}
                            lines={3}
                            className="text-muted text-sm md:text-base"
                          />
                        </div>
                      )}

                      {cert.skills && cert.skills.split(',').map((s) => s.trim()).filter(Boolean).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 md:gap-2 mt-2.5 md:mt-3">
                          {cert.skills.split(',').map((s) => s.trim()).filter(Boolean).map((skill, si) => (
                            <span key={si} className="px-3 py-1 md:py-1.5 bg-accent/10 text-accent text-xs md:text-sm font-medium rounded-full">{skill}</span>
                          ))}
                        </div>
                      )}

                      {cert.credentialUrl && (
                        <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-2 md:mt-3 text-accent text-xs md:text-sm font-medium hover:underline active:scale-95 transition-transform">
                          <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          Show credential
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : !adding ? (
        <p className="text-muted text-sm md:text-base">{isOwner ? 'Add your certifications to stand out.' : 'No certifications added yet.'}</p>
      ) : null}
    </div>
  );
}
