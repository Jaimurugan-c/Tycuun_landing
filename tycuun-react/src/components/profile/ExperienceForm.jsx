import { Trash2, Briefcase, ChevronUp, ChevronDown } from 'lucide-react';
import SkillsInput from './SkillsInput';
import DateDropdown, { formatDateRangeDisplay, normalizeDateValue } from './DateDropdown';

const INPUT_CLASS =
  'w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-main placeholder-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all text-sm';

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
    if (field === 'currentWorking' && value) {
      onChange(index, 'endDate', '');
    }
  };

  const summaryLabel =
    experience.role && experience.company
      ? `${experience.role} at ${experience.company}`
      : experience.company || experience.role || `Experience ${index + 1}`;

  const dateRange = formatDateRangeDisplay(
    experience.startDate,
    experience.endDate,
    experience.currentWorking
  );

  const startDate = normalizeDateValue(experience.startDate);
  const endDate = normalizeDateValue(experience.endDate);
  const dateError =
    startDate && endDate && !experience.currentWorking && startDate > endDate
      ? 'End date cannot be before start date'
      : '';

  return (
    <div className="bg-bg border border-border/50 rounded-xl overflow-hidden transition-all">
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
            <DateDropdown
              label="Start Date"
              value={normalizeDateValue(experience.startDate)}
              onChange={(val) => handleChange('startDate', val)}
            />
            <DateDropdown
              label="End Date"
              value={normalizeDateValue(experience.endDate)}
              onChange={(val) => handleChange('endDate', val)}
              showPresent
              isPresent={experience.currentWorking || false}
              onPresentChange={(checked) => handleChange('currentWorking', checked)}
              minDate={normalizeDateValue(experience.startDate)}
              error={dateError}
            />
          </div>

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
