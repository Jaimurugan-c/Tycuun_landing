import { useState } from 'react';
import {
  Award,
  Pencil,
  Trash2,
  Plus,
  X,
  Check,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import * as api from '../../services/api';

const INPUT_CLASS =
  'w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-main placeholder-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all text-sm';

export default function CertificationsSection({
  certifications = [],
  isOwner,
  onUpdated,
}) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  const blank = () => ({
    name: '',
    organization: '',
    issueDate: '',
    credentialId: '',
    credentialUrl: '',
  });

  const startEdit = (i) => {
    setEditingIndex(i);
    setAdding(false);
    setDraft({ ...certifications[i] });
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
    setDraft((d) => ({ ...d, [field]: value }));
  };

  const save = async () => {
    if (!draft.name.trim()) return alert('Certification name is required');
    setSaving(true);
    try {
      const updated = [...certifications];
      if (adding) {
        updated.push(draft);
      } else if (editingIndex !== null) {
        updated[editingIndex] = draft;
      }
      await api.updateProfile({ certifications: updated });
      onUpdated?.();
      cancel();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (i) => {
    if (!confirm('Delete this certification?')) return;
    setSaving(true);
    try {
      const updated = certifications.filter((_, idx) => idx !== i);
      await api.updateProfile({ certifications: updated });
      onUpdated?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  const isEditing = editingIndex !== null || adding;

  const renderForm = () => (
    <div className="p-4 bg-bg rounded-xl border border-accent/30 space-y-4 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            Certification Name
          </label>
          <input
            value={draft.name}
            onChange={(e) => handleField('name', e.target.value)}
            placeholder="e.g. AWS Solutions Architect"
            className={INPUT_CLASS}
            autoFocus
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            Issuing Organization
          </label>
          <input
            value={draft.organization}
            onChange={(e) => handleField('organization', e.target.value)}
            placeholder="e.g. Amazon Web Services"
            className={INPUT_CLASS}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            Issue Date
          </label>
          <input
            type="date"
            value={draft.issueDate}
            onChange={(e) => handleField('issueDate', e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            Credential ID
          </label>
          <input
            value={draft.credentialId}
            onChange={(e) => handleField('credentialId', e.target.value)}
            placeholder="e.g. ABC123XYZ"
            className={INPUT_CLASS}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-muted mb-1.5">
          Credential URL
        </label>
        <input
          value={draft.credentialUrl}
          onChange={(e) => handleField('credentialUrl', e.target.value)}
          placeholder="https://..."
          className={INPUT_CLASS}
        />
      </div>
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
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          {adding ? 'Add' : 'Save'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-2xl p-6 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-accent" />
          <h2 className="font-display font-semibold text-lg text-main">
            Certifications
          </h2>
          {certifications.length > 0 && (
            <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">
              {certifications.length}
            </span>
          )}
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

      {/* Add form at top */}
      {adding && renderForm()}

      {/* List */}
      {certifications.length > 0 ? (
        <div className={`space-y-5 ${adding ? 'mt-5' : ''}`}>
          {certifications.map((cert, i) => {
            const isThisEditing = editingIndex === i;

            return (
              <div key={cert._id || i}>
                {isThisEditing ? (
                  renderForm()
                ) : (
                  <div
                    className={`group flex gap-4 ${
                      i < certifications.length - 1
                        ? 'pb-5 border-b border-border/50'
                        : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Award className="w-5 h-5 text-accent" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm text-main">
                            {cert.name || 'Certification'}
                          </h3>
                          {cert.organization && (
                            <p className="text-muted text-sm">{cert.organization}</p>
                          )}
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

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                        {cert.issueDate && (
                          <p className="text-muted text-xs">Issued {cert.issueDate}</p>
                        )}
                        {cert.credentialId && (
                          <p className="text-muted text-xs">
                            ID: {cert.credentialId}
                          </p>
                        )}
                      </div>

                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-2 text-accent text-xs font-medium hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
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
        <p className="text-muted text-sm">
          {isOwner
            ? 'Add your certifications to stand out.'
            : 'No certifications added yet.'}
        </p>
      ) : null}
    </div>
  );
}
