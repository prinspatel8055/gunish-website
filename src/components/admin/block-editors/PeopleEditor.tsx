'use client';

import { useState, useEffect } from 'react';
import { Users, CheckSquare, Square, User, Loader2 } from 'lucide-react';

interface Props {
  data: any;
  onChange: (data: any) => void;
}

export default function PeopleEditor({ data, onChange }: Props) {
  const [globalCategories, setGlobalCategories] = useState<any[]>([]);
  const [globalPeople, setGlobalPeople] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/people')
      .then((res) => res.json())
      .then((resData) => {
        const cats = resData.categories || [];
        setGlobalCategories(cats);
        setGlobalPeople(resData.people || []);
        if (cats.length > 0) setActiveTab(cats[0].id);
      })
      .catch((err) => console.error('Failed to load people in editor:', err))
      .finally(() => setLoading(false));
  }, []);

  const selectedMap = data?.selectedPeople || {};

  const getSelectedNames = (catId: string): string[] => {
    if (selectedMap[catId] !== undefined) return selectedMap[catId];
    return globalPeople
      .filter((p) => (p.categoryIds || []).includes(catId))
      .map((p) => p.name);
  };

  const currentSelected = activeTab ? getSelectedNames(activeTab) : [];

  const togglePerson = (name: string) => {
    const isSelected = currentSelected.includes(name);
    const updated = isSelected
      ? currentSelected.filter((n) => n !== name)
      : [...currentSelected, name];

    onChange({
      ...data,
      selectedPeople: {
        ...selectedMap,
        [activeTab]: updated,
      },
    });
  };

  const selectAllInTab = () => {
    const allInTab = globalPeople
      .filter((p) => (p.categoryIds || []).includes(activeTab))
      .map((p) => p.name);

    onChange({
      ...data,
      selectedPeople: {
        ...selectedMap,
        [activeTab]: allInTab,
      },
    });
  };

  const deselectAllInTab = () => {
    onChange({
      ...data,
      selectedPeople: {
        ...selectedMap,
        [activeTab]: [],
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 gap-2 text-slate-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-xs">Loading people registry...</span>
      </div>
    );
  }

  const activeCategoryPeople = globalPeople.filter((p) => (p.categoryIds || []).includes(activeTab));

  return (
    <div className="space-y-4">
      {/* Title & Subtitle Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-1">Section Title</label>
          <input
            type="text"
            value={data?.title || ''}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            placeholder="e.g. Distinguished Leadership & Faculty"
            className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-1">Subtitle</label>
          <input
            type="text"
            value={data?.subtitle || ''}
            onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
            placeholder="e.g. Meet the visionaries driving innovation and research"
            className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-medium text-slate-500 mb-1">Title Alignment</label>
        <select
          value={data?.titleAlignment || 'center'}
          onChange={(e) => onChange({ ...data, titleAlignment: e.target.value })}
          className="w-full sm:w-48 px-2.5 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
        >
          <option value="center">Center</option>
          <option value="left">Left</option>
        </select>
      </div>

      {/* Category Tabs & People Selection */}
      <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/60 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            Category Visibility & Profiles
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={selectAllInTab}
              className="text-[10px] text-blue-600 hover:underline font-medium"
            >
              Select All
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={deselectAllInTab}
              className="text-[10px] text-slate-500 hover:underline"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-2">
          {globalCategories.map((cat) => {
            const count = getSelectedNames(cat.id).length;
            const total = globalPeople.filter((p) => (p.categoryIds || []).includes(cat.id)).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                  activeTab === cat.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeTab === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}/{total}
                </span>
              </button>
            );
          })}
        </div>

        {/* People Selection Grid */}
        {activeCategoryPeople.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No people assigned to this category in the People Registry.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto p-1">
            {activeCategoryPeople.map((person) => {
              const isChecked = currentSelected.includes(person.name);
              return (
                <div
                  key={person.name}
                  onClick={() => togglePerson(person.name)}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center gap-2.5 transition-all select-none ${
                    isChecked
                      ? 'border-blue-500 bg-blue-50/70 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50 opacity-70'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // Handled by div onClick
                    className="rounded text-blue-600 focus:ring-blue-500 shrink-0"
                  />
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
                    {person.image ? (
                      <img src={person.image} alt={person.name} className="w-full h-full object-cover object-top" />
                    ) : (
                      <User className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-800 truncate">{person.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {person.roles?.[activeTab] || person.role || 'Member'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
