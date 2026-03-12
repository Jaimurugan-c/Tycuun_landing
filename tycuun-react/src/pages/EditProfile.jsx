import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Save, Loader2, Briefcase, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ExperienceForm from '../components/profile/ExperienceForm';
import EducationForm from '../components/profile/EducationForm';
import * as api from '../services/api';

const EMPTY_EXPERIENCE = {
  company: '',
  role: '',
  years: '',
  startDate: '',
  endDate: '',
  description: '',
  skills: '',
};

const EMPTY_EDUCATION = {
  institution: '',
  school: '',
  degree: '',
  year: '',
  startDate: '',
  endDate: '',
  description: '',
  skills: '',
};

export default function EditProfile() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: '',
    headline: '',
    bio: '',
    education: [],
    experience: [],
  });

  // Track collapsed state per section
  const [collapsedExp, setCollapsedExp] = useState({});
  const [collapsedEdu, setCollapsedEdu] = useState({});

  useEffect(() => {
    if (user) {
      const exp = user.experience?.length
        ? user.experience.map((e) => ({
            company: e.company || '',
            role: e.role || '',
            years: e.years || '',
            startDate: e.startDate || '',
            endDate: e.endDate || '',
            description: e.description || '',
            skills: e.skills || '',
          }))
        : [];

      const edu = user.education?.length
        ? user.education.map((e) => ({
            institution: e.institution || e.school || '',
            school: e.school || e.institution || '',
            degree: e.degree || '',
            year: e.year || '',
            startDate: e.startDate || '',
            endDate: e.endDate || '',
            description: e.description || '',
            skills: e.skills || '',
          }))
        : [];

      setForm({
        name: user.name || '',
        headline: user.headline || '',
        bio: user.bio || '',
        education: edu,
        experience: exp,
      });

      // Collapse all existing by default
      const cExp = {};
      exp.forEach((_, i) => { cExp[i] = true; });
      setCollapsedExp(cExp);

      const cEdu = {};
      edu.forEach((_, i) => { cEdu[i] = true; });
      setCollapsedEdu(cEdu);
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const payload = {
        ...form,
        experience: form.experience.map((exp) => {
          const years =
            exp.startDate && exp.endDate
              ? `${exp.startDate} – ${exp.endDate}`
              : exp.startDate
              ? `${exp.startDate} – Present`
              : exp.years;
          return { ...exp, years };
        }),
        education: form.education.map((edu) => {
          const year =
            edu.startDate && edu.endDate
              ? `${edu.startDate} – ${edu.endDate}`
              : edu.startDate
              ? `${edu.startDate} – Present`
              : edu.year;
          return { ...edu, school: edu.institution || edu.school, year };
        }),
      };
      await api.updateProfile(payload);
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  // ── Generic collapse helpers ──
  const reindexCollapse = (collapsed, removedIndex) => {
    const out = {};
    Object.keys(collapsed).forEach((k) => {
      const ki = parseInt(k);
      if (ki < removedIndex) out[ki] = collapsed[ki];
      else if (ki > removedIndex) out[ki - 1] = collapsed[ki];
    });
    return out;
  };

  // ── Experience helpers ──
  const updateExperienceField = (index, field, value) => {
    const updated = [...form.experience];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, experience: updated });
  };

  const addExperience = () => {
    const newIndex = form.experience.length;
    setForm({ ...form, experience: [...form.experience, { ...EMPTY_EXPERIENCE }] });
    const collapsed = {};
    form.experience.forEach((_, i) => { collapsed[i] = true; });
    collapsed[newIndex] = false;
    setCollapsedExp(collapsed);
  };

  const removeExperience = (index) => {
    setForm({ ...form, experience: form.experience.filter((_, i) => i !== index) });
    setCollapsedExp(reindexCollapse(collapsedExp, index));
  };

  const toggleCollapseExp = (index) => {
    setCollapsedExp((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // ── Education helpers ──
  const updateEducationField = (index, field, value) => {
    const updated = [...form.education];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, education: updated });
  };

  const addEducation = () => {
    const newIndex = form.education.length;
    setForm({ ...form, education: [...form.education, { ...EMPTY_EDUCATION }] });
    const collapsed = {};
    form.education.forEach((_, i) => { collapsed[i] = true; });
    collapsed[newIndex] = false;
    setCollapsedEdu(collapsed);
  };

  const removeEducation = (index) => {
    setForm({ ...form, education: form.education.filter((_, i) => i !== index) });
    setCollapsedEdu(reindexCollapse(collapsedEdu, index));
  };

  const toggleCollapseEdu = (index) => {
    setCollapsedEdu((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const inputClass =
    'w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-main placeholder-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all text-sm';

  const SaveButton = ({ className = '' }) => (
    <button
      onClick={handleSave}
      disabled={saving}
      className={`btn-primary inline-flex items-center gap-2 text-white font-semibold px-5 py-2.5 rounded-lg text-sm disabled:opacity-50 ${className}`}
    >
      {saving ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Save className="w-4 h-4" />
      )}
      {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Changes'}
    </button>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/profile')}
            className="inline-flex items-center gap-2 text-muted hover:text-accent transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </button>
          <SaveButton />
        </div>

        {/* ─── Basic Info ─── */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-display font-semibold text-lg text-main">Basic Info</h2>
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Full Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Headline</label>
            <input
              value={form.headline}
              onChange={(e) => setForm({ ...form, headline: e.target.value })}
              placeholder="e.g. Entrepreneur, Full Stack Developer"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={4}
              placeholder="Tell people about yourself..."
              className={inputClass + ' resize-none'}
            />
          </div>
        </div>

        {/* ─── Experience ─── */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-accent" />
              <h2 className="font-display font-semibold text-lg text-main">Experience</h2>
              {form.experience.length > 0 && (
                <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">
                  {form.experience.length}
                </span>
              )}
            </div>
            <button
              onClick={addExperience}
              className="inline-flex items-center gap-1.5 text-accent text-sm font-medium hover:underline"
            >
              <Plus className="w-4 h-4" /> Add Experience
            </button>
          </div>

          {form.experience.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <Briefcase className="w-7 h-7 text-accent" />
              </div>
              <p className="text-muted text-sm mb-3">No experience added yet.</p>
              <button
                onClick={addExperience}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-accent border border-accent/30 hover:bg-accent/10 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Your First Experience
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {form.experience.map((exp, i) => (
                <ExperienceForm
                  key={i}
                  experience={exp}
                  index={i}
                  onChange={updateExperienceField}
                  onDelete={removeExperience}
                  isCollapsed={!!collapsedExp[i]}
                  onToggleCollapse={toggleCollapseExp}
                  total={form.experience.length}
                />
              ))}
              <button
                onClick={addExperience}
                className="w-full py-3 border-2 border-dashed border-border hover:border-accent/50 rounded-xl text-sm font-medium text-muted hover:text-accent transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Another Experience
              </button>
            </div>
          )}
        </div>

        {/* ─── Education ─── */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-accent" />
              <h2 className="font-display font-semibold text-lg text-main">Education</h2>
              {form.education.length > 0 && (
                <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">
                  {form.education.length}
                </span>
              )}
            </div>
            <button
              onClick={addEducation}
              className="inline-flex items-center gap-1.5 text-accent text-sm font-medium hover:underline"
            >
              <Plus className="w-4 h-4" /> Add Education
            </button>
          </div>

          {form.education.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <GraduationCap className="w-7 h-7 text-accent" />
              </div>
              <p className="text-muted text-sm mb-3">No education added yet.</p>
              <button
                onClick={addEducation}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-accent border border-accent/30 hover:bg-accent/10 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Your First Education
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {form.education.map((edu, i) => (
                <EducationForm
                  key={i}
                  education={edu}
                  index={i}
                  onChange={updateEducationField}
                  onDelete={removeEducation}
                  isCollapsed={!!collapsedEdu[i]}
                  onToggleCollapse={toggleCollapseEdu}
                  total={form.education.length}
                />
              ))}
              <button
                onClick={addEducation}
                className="w-full py-3 border-2 border-dashed border-border hover:border-accent/50 rounded-xl text-sm font-medium text-muted hover:text-accent transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Another Education
              </button>
            </div>
          )}
        </div>

        {/* Bottom save */}
        <div className="flex justify-end">
          <SaveButton />
        </div>
      </div>
    </div>
  );
}
