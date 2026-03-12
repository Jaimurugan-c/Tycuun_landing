import { Trash2, Briefcase, ChevronUp, ChevronDown, Check } from 'lucide-react';
import SkillsInput from './SkillsInput';

const INPUT_CLASS =
  'w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-main placeholder-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all text-sm';

const DISABLED_CLASS =
  'w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-muted placeholder-muted text-sm opacity-50 cursor-not-allowed';

export default function ExperienceForm({
  experience,
  index,
  onChange,
  onDelete,
  isCollapsed,
  onToggleCollapse,
  total,
}) {
  const handleChange = (field, value) => {
    onChange(index, field, value);
    // If checking currentWorking, clear endDate
    if (field === 'currentWorking' && value) {
      onChange(index, 'endDate', '');
    }
  };

  const summaryLabel =
    experience.role && experience.company
      ? `${experience.role} at ${experience.company}`
      : experience.company || experience.role || `Experience ${index + 1}`;

  const dateRange = [
    experience.startDate,
    experience.currentWorking ? 'Present' : experience.endDate,
  ]
    .filter(Boolean)
    .join(' → ');

  return (
    <div className="bg-bg border border-border/50 rounded-xl overflow-hidden transition-all">
      {/* Header — always visible */}
      <button
        type="button"
        onClick={() => onToggleCollapse(index)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-cardHover transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-4 h-4 text-accent" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-main truncate">{summaryLabel}</p>
            <div className="flex items-center gap-2">
              {dateRange && <p className="text-xs text-muted truncate">{dateRange}</p>}
              {experience.currentWorking && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-accent/10 text-accent text-[10px] font-semibold rounded">
                  <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                  Current
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {total > 1 && (
            <span
              onClick={(e) => { e.stopPropagation(); onDelete(index); }}
              className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </span>
          )}
          {isCollapsed ? (
            <ChevronDown className="w-4 h-4 text-muted" />
          ) : (
            <ChevronUp className="w-4 h-4 text-muted" />
          )}
        </div>
      </button>

      {/* Expanded */}
      {!isCollapsed && (
        <div className="px-4 pb-5 pt-1 space-y-4 border-t border-border/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Company Name</label>
              <input
                value={experience.company}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="e.g. Google"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Role</label>
              <input
                value={experience.role}
                onChange={(e) => handleChange('role', e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className={INPUT_CLASS}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Start Date</label>
              <input
                type="date"
                value={experience.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">End Date</label>
              <input
                type="date"
                value={experience.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                disabled={experience.currentWorking}
                className={experience.currentWorking ? DISABLED_CLASS : INPUT_CLASS}
              />
            </div>
          </div>

          {/* Currently Working checkbox */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none group">
            <div className="relative">
              <input
                type="checkbox"
                checked={experience.currentWorking || false}
                onChange={(e) => handleChange('currentWorking', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 rounded-md border-2 border-border bg-bg peer-checked:bg-accent peer-checked:border-accent transition-all flex items-center justify-center">
                {experience.currentWorking && (
                  <Check className="w-3.5 h-3.5 text-white" />
                )}
              </div>
            </div>
            <span className="text-sm text-muted group-hover:text-main transition-colors">
              I currently work here
            </span>
          </label>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Description</label>
            <textarea
              value={experience.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              placeholder="Describe your responsibilities and achievements..."
              className={INPUT_CLASS + ' resize-none'}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Skills</label>
            <SkillsInput
              value={experience.skills}
              onChange={(val) => handleChange('skills', val)}
              placeholder="e.g. React, Node.js, MongoDB (comma separated)"
            />
          </div>
        </div>
      )}
    </div>
  );
}
