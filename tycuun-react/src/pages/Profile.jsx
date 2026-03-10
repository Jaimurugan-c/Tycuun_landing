import { useState } from 'react';
import { Pencil, X, Check, Plus, Trash2, Briefcase, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

function EditableSection({ title, icon: Icon, children, isEditing, onEdit, onSave, onCancel }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-accent" />
          <h2 className="font-display font-semibold text-lg text-main">{title}</h2>
        </div>
        {isEditing ? (
          <div className="flex gap-2">
            <button onClick={onCancel} className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-cardHover transition-colors"><X className="w-4 h-4" /></button>
            <button onClick={onSave} className="p-2 rounded-lg text-accent hover:bg-accent/10 transition-colors"><Check className="w-4 h-4" /></button>
          </div>
        ) : (
          <button onClick={onEdit} className="p-2 rounded-lg text-muted hover:text-accent hover:bg-cardHover transition-colors"><Pencil className="w-4 h-4" /></button>
        )}
      </div>
      {children}
    </div>
  );
}

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [saving, setSaving] = useState(false);

  // Edit states
  const [editingHeader, setEditingHeader] = useState(false);
  const [editingAbout, setEditingAbout] = useState(false);
  const [editingEdu, setEditingEdu] = useState(false);
  const [editingExp, setEditingExp] = useState(false);

  // Form data
  const [headerForm, setHeaderForm] = useState({ name: '', headline: '' });
  const [aboutForm, setAboutForm] = useState('');
  const [eduForm, setEduForm] = useState([]);
  const [expForm, setExpForm] = useState([]);

  const save = async (data) => {
    setSaving(true);
    try {
      await api.updateProfile(data);
      await refreshUser();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  // Header
  const startEditHeader = () => {
    setHeaderForm({ name: user?.name || '', headline: user?.headline || '' });
    setEditingHeader(true);
  };
  const saveHeader = () => { save(headerForm); setEditingHeader(false); };

  // About
  const startEditAbout = () => { setAboutForm(user?.bio || ''); setEditingAbout(true); };
  const saveAbout = () => { save({ bio: aboutForm }); setEditingAbout(false); };

  // Education
  const startEditEdu = () => { setEduForm(user?.education?.length ? [...user.education] : [{ school: '', degree: '', year: '' }]); setEditingEdu(true); };
  const saveEdu = () => { save({ education: eduForm }); setEditingEdu(false); };

  // Experience
  const startEditExp = () => { setExpForm(user?.experience?.length ? [...user.experience] : [{ company: '', role: '', years: '' }]); setEditingExp(true); };
  const saveExp = () => { save({ experience: expForm }); setEditingExp(false); };

  const updateListItem = (list, setList, index, field, value) => {
    const updated = [...list];
    updated[index] = { ...updated[index], [field]: value };
    setList(updated);
  };

  const inputClass = "w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-main placeholder-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all text-sm";

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Profile Header Card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden transition-colors">
          {/* Banner */}
          <div className="h-32 sm:h-40 relative" style={{ background: 'linear-gradient(135deg, var(--accent-dark), var(--accent), var(--accent-light))' }}>
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)' }}></div>
          </div>

          <div className="px-6 pb-6 -mt-12 sm:-mt-14 relative">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex items-end gap-4">
                <div
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 flex items-center justify-center text-white font-display font-bold text-3xl sm:text-4xl flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', borderColor: 'var(--card)' }}
                >
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="pb-1">
                  {editingHeader ? (
                    <div className="space-y-2">
                      <input value={headerForm.name} onChange={(e) => setHeaderForm({ ...headerForm, name: e.target.value })} placeholder="Full Name" className={inputClass} />
                      <input value={headerForm.headline} onChange={(e) => setHeaderForm({ ...headerForm, headline: e.target.value })} placeholder="Headline (e.g. Entrepreneur, CEO)" className={inputClass} />
                    </div>
                  ) : (
                    <>
                      <h1 className="font-display font-bold text-2xl text-main">{user?.name || 'User'}</h1>
                      <p className="text-muted text-sm">{user?.headline || 'Add a headline'}</p>
                    </>
                  )}
                </div>
              </div>
              {editingHeader ? (
                <div className="flex gap-2 self-start sm:self-end">
                  <button onClick={() => setEditingHeader(false)} className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-cardHover transition-colors"><X className="w-4 h-4" /></button>
                  <button onClick={saveHeader} disabled={saving} className="p-2 rounded-lg text-accent hover:bg-accent/10 transition-colors"><Check className="w-4 h-4" /></button>
                </div>
              ) : (
                <button onClick={startEditHeader} className="p-2 rounded-lg text-muted hover:text-accent hover:bg-cardHover transition-colors self-start sm:self-end">
                  <Pencil className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-muted text-xs mt-3">{user?.email}</p>
          </div>
        </div>

        {/* About */}
        <EditableSection title="About" icon={({ className }) => (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        )} isEditing={editingAbout} onEdit={startEditAbout} onSave={saveAbout} onCancel={() => setEditingAbout(false)}>
          {editingAbout ? (
            <textarea value={aboutForm} onChange={(e) => setAboutForm(e.target.value)} rows={4} placeholder="Write something about yourself..." className={inputClass + ' resize-none'} />
          ) : (
            <p className="text-muted text-sm leading-relaxed">{user?.bio || 'No bio yet. Click edit to add one.'}</p>
          )}
        </EditableSection>

        {/* Experience */}
        <EditableSection title="Experience" icon={Briefcase} isEditing={editingExp} onEdit={startEditExp} onSave={saveExp} onCancel={() => setEditingExp(false)}>
          {editingExp ? (
            <div className="space-y-4">
              {expForm.map((item, i) => (
                <div key={i} className="p-4 bg-bg rounded-xl border border-border/50 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-muted font-medium">Experience {i + 1}</span>
                    {expForm.length > 1 && (
                      <button onClick={() => setExpForm(expForm.filter((_, idx) => idx !== i))} className="text-red-500 hover:bg-red-500/10 p-1 rounded transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    )}
                  </div>
                  <input value={item.company} onChange={(e) => updateListItem(expForm, setExpForm, i, 'company', e.target.value)} placeholder="Company" className={inputClass} />
                  <input value={item.role} onChange={(e) => updateListItem(expForm, setExpForm, i, 'role', e.target.value)} placeholder="Role" className={inputClass} />
                  <input value={item.years} onChange={(e) => updateListItem(expForm, setExpForm, i, 'years', e.target.value)} placeholder="Years (e.g. 2020-2024)" className={inputClass} />
                </div>
              ))}
              <button onClick={() => setExpForm([...expForm, { company: '', role: '', years: '' }])} className="flex items-center gap-2 text-accent text-sm font-medium hover:underline">
                <Plus className="w-4 h-4" /> Add experience
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {user?.experience?.length > 0 ? user.experience.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Briefcase className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-main">{item.role || 'Role'}</h3>
                    <p className="text-muted text-sm">{item.company || 'Company'}</p>
                    <p className="text-muted text-xs mt-0.5">{item.years || ''}</p>
                  </div>
                </div>
              )) : (
                <p className="text-muted text-sm">No experience added yet.</p>
              )}
            </div>
          )}
        </EditableSection>

        {/* Education */}
        <EditableSection title="Education" icon={GraduationCap} isEditing={editingEdu} onEdit={startEditEdu} onSave={saveEdu} onCancel={() => setEditingEdu(false)}>
          {editingEdu ? (
            <div className="space-y-4">
              {eduForm.map((item, i) => (
                <div key={i} className="p-4 bg-bg rounded-xl border border-border/50 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-muted font-medium">Education {i + 1}</span>
                    {eduForm.length > 1 && (
                      <button onClick={() => setEduForm(eduForm.filter((_, idx) => idx !== i))} className="text-red-500 hover:bg-red-500/10 p-1 rounded transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    )}
                  </div>
                  <input value={item.school} onChange={(e) => updateListItem(eduForm, setEduForm, i, 'school', e.target.value)} placeholder="School" className={inputClass} />
                  <input value={item.degree} onChange={(e) => updateListItem(eduForm, setEduForm, i, 'degree', e.target.value)} placeholder="Degree" className={inputClass} />
                  <input value={item.year} onChange={(e) => updateListItem(eduForm, setEduForm, i, 'year', e.target.value)} placeholder="Year (e.g. 2024)" className={inputClass} />
                </div>
              ))}
              <button onClick={() => setEduForm([...eduForm, { school: '', degree: '', year: '' }])} className="flex items-center gap-2 text-accent text-sm font-medium hover:underline">
                <Plus className="w-4 h-4" /> Add education
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {user?.education?.length > 0 ? user.education.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <GraduationCap className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-main">{item.school || 'School'}</h3>
                    <p className="text-muted text-sm">{item.degree || 'Degree'}</p>
                    <p className="text-muted text-xs mt-0.5">{item.year || ''}</p>
                  </div>
                </div>
              )) : (
                <p className="text-muted text-sm">No education added yet.</p>
              )}
            </div>
          )}
        </EditableSection>

      </div>
    </div>
  );
}
