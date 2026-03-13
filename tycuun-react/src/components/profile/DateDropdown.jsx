import { useMemo } from 'react';

const MONTHS = [
  { value: '01', label: 'Jan' },
  { value: '02', label: 'Feb' },
  { value: '03', label: 'Mar' },
  { value: '04', label: 'Apr' },
  { value: '05', label: 'May' },
  { value: '06', label: 'Jun' },
  { value: '07', label: 'Jul' },
  { value: '08', label: 'Aug' },
  { value: '09', label: 'Sep' },
  { value: '10', label: 'Oct' },
  { value: '11', label: 'Nov' },
  { value: '12', label: 'Dec' },
];

const SELECT_CLASS =
  'px-3 py-2.5 bg-bg border border-border rounded-xl text-main text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all appearance-none cursor-pointer';

const DISABLED_CLASS =
  'px-3 py-2.5 bg-bg border border-border rounded-xl text-muted text-sm opacity-50 cursor-not-allowed appearance-none';

/**
 * Reusable Month/Year date dropdown.
 *
 * Props:
 *  - label: string
 *  - value: string  — stored as "YYYY-MM" (e.g. "2022-01") or legacy "YYYY-MM-DD"
 *  - onChange(newValue: string): void — emits "YYYY-MM" or ""
 *  - disabled?: boolean
 *  - showPresent?: boolean — adds a "Present" checkbox
 *  - isPresent?: boolean
 *  - onPresentChange?(checked: boolean): void
 *  - minDate?: string — "YYYY-MM" minimum allowed
 *  - hint?: string
 *  - error?: string
 */
export default function DateDropdown({
  label,
  value = '',
  onChange,
  disabled = false,
  showPresent = false,
  isPresent = false,
  onPresentChange,
  minDate,
  hint,
  error,
}) {
  // Parse value — handle "YYYY-MM", "YYYY-MM-DD", or ""
  const { month, year } = useMemo(() => {
    if (!value) return { month: '', year: '' };
    const parts = value.split('-');
    return { year: parts[0] || '', month: parts[1] || '' };
  }, [value]);

  const currentYear = new Date().getFullYear();
  const years = useMemo(() => {
    const list = [];
    for (let y = currentYear + 5; y >= 1980; y--) list.push(String(y));
    return list;
  }, [currentYear]);

  // Parse minDate for validation
  const minMonth = minDate ? parseInt(minDate.split('-')[1] || '0', 10) : 0;
  const minYear = minDate ? parseInt(minDate.split('-')[0] || '0', 10) : 0;

  const handleMonth = (m) => {
    if (!year) {
      // auto-select current year if none picked
      const newVal = `${currentYear}-${m}`;
      onChange(newVal);
    } else {
      const newVal = `${year}-${m}`;
      // Validate against minDate
      if (minDate && newVal < minDate) return;
      onChange(newVal);
    }
  };

  const handleYear = (y) => {
    if (!month) {
      // auto-select January
      const newVal = `${y}-01`;
      onChange(newVal);
    } else {
      const newVal = `${y}-${month}`;
      if (minDate && newVal < minDate) {
        // If selected year+month is before min, clamp month
        if (`${y}-${month}` < minDate) {
          onChange(`${y}-${minDate.split('-')[1] || '01'}`);
          return;
        }
      }
      onChange(newVal);
    }
  };

  const handlePresent = (checked) => {
    onPresentChange?.(checked);
  };

  const isDisabled = disabled || isPresent;

  return (
    <div>
      {label && (
        <label className="block text-xs md:text-sm font-medium text-muted mb-1.5">
          {label}
        </label>
      )}

      <div className="flex items-center gap-2">
        {/* Month */}
        <select
          value={month}
          onChange={(e) => handleMonth(e.target.value)}
          disabled={isDisabled}
          className={`flex-1 ${isDisabled ? DISABLED_CLASS : SELECT_CLASS}`}
        >
          <option value="">Month</option>
          {MONTHS.map((m) => {
            // Disable months before minDate if same year
            const isBeforeMin =
              minDate && year && parseInt(year) === minYear && parseInt(m.value) < minMonth;
            return (
              <option key={m.value} value={m.value} disabled={isBeforeMin}>
                {m.label}
              </option>
            );
          })}
        </select>

        {/* Year */}
        <select
          value={year}
          onChange={(e) => handleYear(e.target.value)}
          disabled={isDisabled}
          className={`flex-1 ${isDisabled ? DISABLED_CLASS : SELECT_CLASS}`}
        >
          <option value="">Year</option>
          {years.map((y) => {
            const isBeforeMin = minDate && parseInt(y) < minYear;
            return (
              <option key={y} value={y} disabled={isBeforeMin}>
                {y}
              </option>
            );
          })}
        </select>
      </div>

      {/* Present checkbox */}
      {showPresent && (
        <label className="flex items-center gap-2 mt-2 cursor-pointer select-none group">
          <div className="relative">
            <input
              type="checkbox"
              checked={isPresent}
              onChange={(e) => handlePresent(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-4.5 h-4.5 w-[18px] h-[18px] rounded-md border-2 border-border bg-bg peer-checked:bg-accent peer-checked:border-accent transition-all flex items-center justify-center">
              {isPresent && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-xs md:text-sm text-muted group-hover:text-main transition-colors">
            Present / Currently ongoing
          </span>
        </label>
      )}

      {hint && !error && (
        <p className="text-[11px] md:text-xs text-muted mt-1">{hint}</p>
      )}
      {error && (
        <p className="text-[11px] md:text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}

/**
 * Format a "YYYY-MM" or "YYYY-MM-DD" date string to "Jan 2022"
 */
export function formatMonthYear(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  const y = parts[0];
  const m = parseInt(parts[1], 10);
  if (!y || !m || isNaN(m)) return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[m - 1]} ${y}`;
}

/**
 * Format date range for display: "Jan 2022 — Mar 2024" or "Jan 2022 — Present"
 */
export function formatDateRangeDisplay(startDate, endDate, isPresent = false) {
  const start = formatMonthYear(startDate);
  if (isPresent) return start ? `${start} — Present` : 'Present';
  const end = formatMonthYear(endDate);
  if (start && end) return `${start} — ${end}`;
  if (start) return `${start} — Present`;
  return '';
}

/**
 * Normalize legacy date values: "YYYY-MM-DD" → "YYYY-MM"
 */
export function normalizeDateValue(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length >= 2) return `${parts[0]}-${parts[1]}`;
  return dateStr;
}
