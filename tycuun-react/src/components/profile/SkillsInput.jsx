import { X } from 'lucide-react';

const INPUT_CLASS =
  'w-full px-4 py-2.5 bg-bg border border-border rounded-xl text-main placeholder-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all text-sm';

export default function SkillsInput({ value, onChange, placeholder }) {
  const skills = value
    ? value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const removeSkill = (indexToRemove) => {
    const updated = skills.filter((_, i) => i !== indexToRemove).join(', ');
    onChange(updated);
  };

  const handleKeyDown = (e) => {
    // When user presses Enter, add a comma so the tag renders
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!value.endsWith(',') && value.trim()) {
        onChange(value.trim() + ', ');
      }
    }
  };

  return (
    <div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || 'e.g. React, Node.js, MongoDB (comma separated)'}
        className={INPUT_CLASS}
      />
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {skills.map((skill, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full group"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(i)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-full hover:bg-accent/20"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
