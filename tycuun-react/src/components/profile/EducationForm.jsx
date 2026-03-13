import { Trash2, GraduationCap, ChevronUp, ChevronDown } from 'lucide-react';
import SkillsInput from './SkillsInput';
import DateDropdown, { formatDateRangeDisplay, normalizeDateValue } from './DateDropdown';

const INPUT_CLASS =
  'w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-main placeholder-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all text-sm';

export default function EducationForm({
  education,
  index,
  onChange,
  onDelete,
  isCollapsed,
  onToggleCollapse,
  total,
}) {
  const handleChange = (field, value) => {
    onChange(index, field, value);
    if (field === 'currentlyStudying' && value) {
      onChange(index, 'endDate', '');
    }
  };

  const summaryLabel =
    education.institution && education.degree
      ? `${education.degree} — ${education.institution}`
      : education.institution || education.degree || education.school || `Education ${index + 1}`;

  const dateRange = formatDateRangeDisplay(
    education.startDate,
    education.endDate,
    education.currentlyStudying
  );

  // Validate: start cannot be after end
  const startDate = normalizeDateValue(education.startDate);
  const endDate = normalizeDateValue(education.endDate);
  const dateError =
    startDate && endDate && !education.currentlyStudying && startDate > endDate
      ? 'End date cannot be before start date'
      : '';

  return (
    <div className="bg-bg border border-border/50 rounded-xl overflow-hidden transition-all">
      {/* Collapsed Header */}
      <button
        type="button"
        onClick={() => onToggleCollapse(index)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-cardHover transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-4 h-4 text-accent" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-main truncate">{summaryLabel}</p>
            {dateRange && (
              <p className="text-xs text-muted truncate">{dateRange}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {total > 1 && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onDelete(index);
              }}
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

      {/* Expanded Form */}
      {!isCollapsed && (
        <div className="px-4 pb-5 pt-1 space-y-4 border-t border-border/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                Institution / School Name
              </label>
              <input
                value={education.institution}
                onChange={(e) => handleChange('institution', e.target.value)}
                placeholder="e.g. Stanford University"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                Degree / Program
              </label>
              <input
                value={education.degree}
                onChange={(e) => handleChange('degree', e.target.value)}
                placeholder="e.g. B.S. Computer Science"
                className={INPUT_CLASS}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DateDropdown
              label="Start Date"
              value={normalizeDateValue(education.startDate)}
              onChange={(val) => handleChange('startDate', val)}
            />
            <DateDropdown
              label="End Date"
              value={normalizeDateValue(education.endDate)}
              onChange={(val) => handleChange('endDate', val)}
              showPresent
              isPresent={education.currentlyStudying || false}
              onPresentChange={(checked) => handleChange('currentlyStudying', checked)}
              minDate={normalizeDateValue(education.startDate)}
              error={dateError}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">
              Description
            </label>
            <textarea
              value={education.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              placeholder="Activities, achievements, coursework..."
              className={INPUT_CLASS + ' resize-none'}
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">
              Skills (optional)
            </label>
            <SkillsInput
              value={education.skills}
              onChange={(val) => handleChange('skills', val)}
              placeholder="e.g. Python, Machine Learning, Data Structures"
            />
          </div>
        </div>
      )}
    </div>
  );
}
