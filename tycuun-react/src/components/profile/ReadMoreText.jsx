import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * ReadMoreText — clamps text to N lines with a Read More / Show Less toggle.
 *
 * Props:
 *   text      — string to display
 *   lines     — visible line count before clamping (default 3)
 *   className — additional classes for the <p> element (color, size, etc.)
 */
export default function ReadMoreText({ text, lines = 3, className = '' }) {
  const [expanded, setExpanded] = useState(false);
  const [needsClamp, setNeedsClamp] = useState(false);
  const textRef = useRef(null);

  const checkOverflow = useCallback(() => {
    const el = textRef.current;
    if (!el) return;
    // scrollHeight is the full content height; clientHeight is the visible (clamped) height
    setNeedsClamp(el.scrollHeight > el.clientHeight + 1);
  }, []);

  // Re-check whenever text, line count, or expanded state changes
  useEffect(() => {
    if (expanded) return;         // no need to measure when fully open
    checkOverflow();
  }, [text, lines, expanded, checkOverflow]);

  // Re-check on window resize (container width change affects line wrapping)
  useEffect(() => {
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [checkOverflow]);

  if (!text) return null;

  return (
    <div>
      <p
        ref={textRef}
        className={`whitespace-pre-wrap leading-relaxed ${className}`}
        style={
          !expanded
            ? {
                display: '-webkit-box',
                WebkitLineClamp: lines,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }
            : undefined
        }
      >
        {text}
      </p>

      {(needsClamp || expanded) && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-1.5 text-accent text-sm font-medium hover:underline focus:outline-none transition-colors"
        >
          {expanded ? 'Show Less' : 'Read More'}
        </button>
      )}
    </div>
  );
}
