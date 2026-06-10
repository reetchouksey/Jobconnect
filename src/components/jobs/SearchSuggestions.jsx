import { useEffect, useRef } from 'react';
import { Briefcase, Building2, Tag, MapPin, History } from 'lucide-react';

export default function SearchSuggestions({
  open,
  onClose,
  onPick,
  suggestions,
  recent = [],
  variant = 'mixed',
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClickAway = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose?.();
    };
    document.addEventListener('mousedown', onClickAway);
    return () => document.removeEventListener('mousedown', onClickAway);
  }, [open, onClose]);

  if (!open) return null;

  const groups = [];
  if (variant === 'location') {
    if (suggestions?.locations?.length) {
      groups.push({
        icon: MapPin,
        label: 'Locations',
        items: suggestions.locations,
      });
    }
  } else {
    if (suggestions?.titles?.length) {
      groups.push({
        icon: Briefcase,
        label: 'Job Titles',
        items: suggestions.titles,
      });
    }
    if (suggestions?.companies?.length) {
      groups.push({
        icon: Building2,
        label: 'Companies',
        items: suggestions.companies,
      });
    }
    if (suggestions?.skills?.length) {
      groups.push({
        icon: Tag,
        label: 'Skills',
        items: suggestions.skills,
      });
    }
    if (suggestions?.locations?.length) {
      groups.push({
        icon: MapPin,
        label: 'Locations',
        items: suggestions.locations,
      });
    }
  }

  const totalSuggestions = groups.reduce((sum, g) => sum + g.items.length, 0);

  if (totalSuggestions === 0 && recent.length === 0) return null;

  return (
    <div
      ref={ref}
      className="absolute left-0 right-0 top-full z-30 mt-2 max-h-[420px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 text-left shadow-xl animate-fade-in dark:border-slate-700 dark:bg-slate-900"
    >
      {totalSuggestions === 0 && recent.length > 0 && (
        <Group icon={History} label="Recent searches">
          {recent.map((item) => (
            <Item
              key={`recent-${item}`}
              text={item}
              onClick={() => onPick(item)}
            />
          ))}
        </Group>
      )}
      {groups.map((g) => (
        <Group key={g.label} icon={g.icon} label={g.label}>
          {g.items.map((item) => (
            <Item key={`${g.label}-${item}`} text={item} onClick={() => onPick(item)} />
          ))}
        </Group>
      ))}
    </div>
  );
}

function Group({ icon: Icon, label, children }) {
  return (
    <div className="py-1.5">
      <p className="flex items-center gap-1.5 px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {Icon && <Icon size={11} />}
        {label}
      </p>
      <ul>{children}</ul>
    </div>
  );
}

function Item({ text, onClick }) {
  return (
    <li>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onClick}
        className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-brand-50 hover:text-brand-700 dark:text-slate-200 dark:hover:bg-brand-900/30 dark:hover:text-brand-200"
      >
        <span className="truncate">{text}</span>
        <span className="text-xs text-slate-400">↵</span>
      </button>
    </li>
  );
}
