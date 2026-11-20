'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Users, Plus, Trash2, Edit2, ChevronUp, ChevronDown, Save, Loader2,
  Eye, EyeOff, Search, Tag, Briefcase, User, Check, X, Sparkles, Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';
import MediaPicker from '@/components/admin/MediaPicker';

interface Category {
  id: string;
  label: string;
}

interface Person {
  name: string;
  role: string;
  image?: string;
  icon?: string;
  categoryIds: string[];
  roles?: Record<string, string>; // categoryId -> role override
  hidden?: boolean;
}

export default function AdminPeoplePage() {
  const [activeTab, setActiveTab] = useState<'people' | 'categories' | 'designations'>('people');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [designations, setDesignations] = useState<string[]>([]);

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Modal State for Person
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [editingPersonIndex, setEditingPersonIndex] = useState<number | null>(null);
  const [personForm, setPersonForm] = useState<Person>({
    name: '',
    role: '',
    image: '',
    icon: 'Award',
    categoryIds: [],
    roles: {},
    hidden: false,
  });

  // Modal State for Media Picker
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  // New Category Input
  const [newCategoryLabel, setNewCategoryLabel] = useState('');
  const [newCategoryId, setNewCategoryId] = useState('');

  // New Designation Input
  const [newDesignation, setNewDesignation] = useState('');

  // Designation Autocomplete focus state
  const [activeRoleField, setActiveRoleField] = useState<string | null>(null);

  const fetchPeopleData = useCallback(async () => {
    try {
      const res = await fetch('/api/people');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
        setPeople(data.people || []);
        setDesignations(data.designations || []);
      } else {
        toast.error('Failed to load people registry');
      }
    } catch {
      toast.error('Network error loading people data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPeopleData();
  }, [fetchPeopleData]);

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/people', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categories,
          people,
          designations,
        }),
      });

      if (res.ok) {
        toast.success('People registry saved successfully');
        fetchPeopleData();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to save people registry');
      }
    } catch {
      toast.error('Network error while saving');
    } finally {
      setSaving(false);
    }
  };

  // People Handlers
  const handleOpenPersonModal = (index?: number) => {
    if (typeof index === 'number') {
      setEditingPersonIndex(index);
      setPersonForm({ ...people[index], roles: { ...(people[index].roles || {}) } });
    } else {
      setEditingPersonIndex(null);
      setPersonForm({
        name: '',
        role: '',
        image: '',
        icon: 'Award',
        categoryIds: categories.length > 0 ? [categories[0].id] : [],
        roles: {},
        hidden: false,
      });
    }
    setIsPersonModalOpen(true);
  };

  const handleSavePersonModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personForm.name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    const updatedPeople = [...people];
    if (editingPersonIndex !== null) {
      updatedPeople[editingPersonIndex] = personForm;
    } else {
      updatedPeople.push(personForm);
    }

    setPeople(updatedPeople);
    setIsPersonModalOpen(false);
    toast.success(editingPersonIndex !== null ? 'Person updated' : 'Person added');
  };

  const handleDeletePerson = (index: number) => {
    if (confirm(`Remove "${people[index].name}" from registry?`)) {
      const updated = people.filter((_, i) => i !== index);
      setPeople(updated);
      toast.success('Person removed');
    }
  };

  const movePerson = (index: number, direction: 'up' | 'down') => {
    const updated = [...people];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= updated.length) return;
    [updated[index], updated[target]] = [updated[target], updated[index]];
    setPeople(updated);
  };

  const togglePersonHidden = (index: number) => {
    const updated = [...people];
    updated[index].hidden = !updated[index].hidden;
    setPeople(updated);
  };

  // Category Handlers
  const handleAddCategory = () => {
    if (!newCategoryLabel.trim()) return;
    const id = newCategoryId.trim()
      ? newCategoryId.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
      : newCategoryLabel.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');

    if (categories.some((c) => c.id === id)) {
      toast.error(`Category ID "${id}" already exists`);
      return;
    }

    setCategories([...categories, { id, label: newCategoryLabel.trim() }]);
    setNewCategoryLabel('');
    setNewCategoryId('');
    toast.success('Category added');
  };

  const handleDeleteCategory = (catId: string) => {
    const assignedCount = people.filter((p) => (p.categoryIds || []).includes(catId)).length;
    if (assignedCount > 0) {
      if (!confirm(`Warning: ${assignedCount} person(s) are assigned to this category. Delete anyway?`)) {
        return;
      }
    }
    setCategories(categories.filter((c) => c.id !== catId));
    toast.success('Category removed');
  };

  // Designation Handlers
  const handleAddDesignation = () => {
    if (!newDesignation.trim()) return;
    const formatted = newDesignation.trim().replace(/\s+/g, ' ');
    if (designations.some((d) => d.toLowerCase() === formatted.toLowerCase())) {
      toast.error('Designation already exists');
      return;
    }
    setDesignations([...designations, formatted].sort());
    setNewDesignation('');
    toast.success('Designation added');
  };

  const handleDeleteDesignation = (desig: string) => {
    setDesignations(designations.filter((d) => d !== desig));
  };

  // Filtered People List
  const filteredPeople = useMemo(() => {
    return people.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategoryFilter === 'all' || (p.categoryIds || []).includes(selectedCategoryFilter);
      return matchesSearch && matchesCategory;
    });
  }, [people, searchQuery, selectedCategoryFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 gap-2 text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading people registry...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Top Action Header */}
      <div className="sticky top-0 z-10 shrink-0 bg-white border-b border-slate-200 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400" />
            <h1 className="text-sm font-semibold text-slate-800">People & Faculty Registry</h1>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600">
            {people.length} Members
          </span>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="inline-flex items-center gap-1.5 text-white text-xs font-medium px-3.5 py-1.5 rounded transition-colors bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          {saving ? 'Saving...' : 'Save Registry'}
        </button>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-slate-200 bg-white flex items-center justify-between">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('people')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'people' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Profiles ({people.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'categories' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('designations')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'designations' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Designations ({designations.length})
          </button>
        </div>

        {activeTab === 'people' && (
          <button
            onClick={() => handleOpenPersonModal()}
            className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded bg-slate-900 text-white hover:bg-slate-800 transition-colors my-2"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Person
          </button>
        )}
      </div>

      {/* Main Tab Content */}
      <div className="p-6 max-w-6xl w-full">
        {/* ─── TAB 1: PROFILES ────────────────────────────────────────── */}
        {activeTab === 'people' && (
          <div className="space-y-4">
            {/* Filters Bar */}
            <div className="bg-white border border-slate-200 rounded p-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or role..."
                  className="w-full text-xs px-2 py-1 outline-none text-slate-700 placeholder-slate-400"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setSelectedCategoryFilter('all')}
                  className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-colors ${
                    selectedCategoryFilter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({people.length})
                </button>
                {categories.map((c) => {
                  const count = people.filter((p) => (p.categoryIds || []).includes(c.id)).length;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategoryFilter(c.id)}
                      className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-colors ${
                        selectedCategoryFilter === c.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {c.label} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* People List / Table */}
            <div className="bg-white border border-slate-200 rounded overflow-hidden">
              {filteredPeople.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No people found matching the filter.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredPeople.map((person) => {
                    const originalIndex = people.findIndex((p) => p === person);
                    return (
                      <div
                        key={originalIndex}
                        className={`p-4 flex items-center justify-between gap-4 transition-colors hover:bg-slate-50/70 ${
                          person.hidden ? 'opacity-50 bg-slate-50/40' : ''
                        }`}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          {/* Reorder Buttons */}
                          <div className="flex flex-col gap-0.5 shrink-0">
                            <button
                              onClick={() => movePerson(originalIndex, 'up')}
                              disabled={originalIndex === 0}
                              className="p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => movePerson(originalIndex, 'down')}
                              disabled={originalIndex === people.length - 1}
                              className="p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Avatar Thumbnail */}
                          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-200 bg-slate-100 flex items-center justify-center">
                            {person.image ? (
                              <img src={person.image} alt={person.name} className="w-full h-full object-cover object-top" />
                            ) : (
                              <User className="w-5 h-5 text-slate-400" />
                            )}
                          </div>

                          {/* Info */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-slate-800 truncate">{person.name}</h4>
                              {person.hidden && (
                                <span className="text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-700">
                                  Hidden
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 truncate whitespace-pre-line mt-0.5">
                              {person.role || 'No role assigned'}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {(person.categoryIds || []).map((cid) => {
                                const cat = categories.find((c) => c.id === cid);
                                return (
                                  <span
                                    key={cid}
                                    className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium border border-blue-100"
                                  >
                                    {cat?.label || cid}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => togglePersonHidden(originalIndex)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                            title={person.hidden ? 'Show person on site' : 'Hide person from site'}
                          >
                            {person.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleOpenPersonModal(originalIndex)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit person"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePerson(originalIndex)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete person"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 2: CATEGORIES ──────────────────────────────────────── */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            {/* Add New Category Box */}
            <div className="bg-white border border-slate-200 rounded p-4">
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Add Category</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-medium text-slate-500 mb-1">Display Label <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={newCategoryLabel}
                    onChange={(e) => {
                      setNewCategoryLabel(e.target.value);
                      if (!newCategoryId) {
                        setNewCategoryId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
                      }
                    }}
                    placeholder="e.g. Teaching Faculty"
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-500 mb-1">Unique Key / ID</label>
                  <input
                    type="text"
                    value={newCategoryId}
                    onChange={(e) => setNewCategoryId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    placeholder="e.g. teaching"
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleAddCategory}
                    className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-medium px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Category
                  </button>
                </div>
              </div>
            </div>

            {/* Categories List */}
            <div className="bg-white border border-slate-200 rounded overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Taxonomy Categories</span>
                <span className="text-[10px] text-slate-400">Total: {categories.length}</span>
              </div>
              <div className="divide-y divide-slate-100">
                {categories.map((cat, idx) => {
                  const assignedCount = people.filter((p) => (p.categoryIds || []).includes(cat.id)).length;
                  return (
                    <div key={cat.id} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-400 w-6">#{idx + 1}</span>
                        <div>
                          <input
                            type="text"
                            value={cat.label}
                            onChange={(e) => {
                              const updated = [...categories];
                              updated[idx].label = e.target.value;
                              setCategories(updated);
                            }}
                            className="text-xs font-bold text-slate-800 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none px-1 py-0.5"
                          />
                          <div className="text-[10px] font-mono text-slate-400 px-1 mt-0.5">
                            ID: {cat.id} • {assignedCount} member(s) assigned
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: DESIGNATIONS ────────────────────────────────────── */}
        {activeTab === 'designations' && (
          <div className="space-y-6">
            {/* Add Designation Box */}
            <div className="bg-white border border-slate-200 rounded p-4">
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Add Designation</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDesignation}
                  onChange={(e) => setNewDesignation(e.target.value)}
                  placeholder="e.g. Associate Professor, Dean, Registrar..."
                  className="flex-1 px-3 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddDesignation();
                    }
                  }}
                />
                <button
                  onClick={handleAddDesignation}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>
            </div>

            {/* Designations Cloud / List */}
            <div className="bg-white border border-slate-200 rounded p-5">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-4">
                Autocomplete Pool ({designations.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {designations.map((desig) => (
                  <span
                    key={desig}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                  >
                    <span>{desig}</span>
                    <button
                      onClick={() => handleDeleteDesignation(desig)}
                      className="text-slate-400 hover:text-red-600 transition-colors"
                      title="Remove designation"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── ADD/EDIT PERSON MODAL ────────────────────────────────────── */}
      {isPersonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-bold text-slate-800">
                {editingPersonIndex !== null ? 'Edit Profile' : 'Add New Member'}
              </h3>
              <button onClick={() => setIsPersonModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSavePersonModal} className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name & Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={personForm.name}
                  onChange={(e) => setPersonForm({ ...personForm, name: e.target.value })}
                  placeholder="e.g. Dr. Mahendra Sharma"
                  className="w-full px-3 py-2 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Headshot Image */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Headshot Photo</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={personForm.image || ''}
                    onChange={(e) => setPersonForm({ ...personForm, image: e.target.value })}
                    placeholder="/uploads/avatar.png"
                    className="flex-1 px-3 py-2 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMediaPicker(true)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium border border-slate-200 transition-colors shrink-0 flex items-center gap-1"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    Browse
                  </button>
                  {personForm.image && (
                    <button
                      type="button"
                      onClick={() => setPersonForm({ ...personForm, image: '' })}
                      className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded text-xs font-medium border border-red-100 transition-colors shrink-0"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {personForm.image && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={personForm.image}
                      alt="Preview"
                      className="w-12 h-12 rounded-full object-cover object-top border border-slate-200 shadow-sm"
                    />
                    <span className="text-[10px] text-slate-400">Photo preview</span>
                  </div>
                )}
              </div>

              {/* Primary Role / Designation (with Autocomplete) */}
              <div className="relative">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Primary Role / Designation
                </label>
                <textarea
                  rows={2}
                  value={personForm.role}
                  onFocus={() => setActiveRoleField('primary')}
                  onBlur={() => setTimeout(() => setActiveRoleField(null), 200)}
                  onChange={(e) => setPersonForm({ ...personForm, role: e.target.value })}
                  placeholder="e.g. Vice Chancellor & Director General\nGanpat University"
                  className="w-full px-3 py-2 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />

                {/* Autocomplete Suggestions */}
                {activeRoleField === 'primary' && designations.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-50 max-h-40 overflow-y-auto p-1">
                    <div className="text-[9px] font-bold uppercase text-slate-400 px-2 py-1">Suggestions:</div>
                    {designations
                      .filter((d) => !personForm.role || d.toLowerCase().includes(personForm.role.toLowerCase()))
                      .slice(0, 6)
                      .map((d) => (
                        <div
                          key={d}
                          onMouseDown={() => setPersonForm({ ...personForm, role: d })}
                          className="px-2.5 py-1.5 text-xs hover:bg-blue-50 hover:text-blue-600 rounded cursor-pointer transition-colors"
                        >
                          {d}
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Taxonomy Categories & Multi-Affiliation Roles */}
              <div className="border-t border-slate-100 pt-4">
                <label className="block text-xs font-bold text-slate-800 mb-2">Category Affiliations & Roles</label>
                <div className="space-y-3 bg-slate-50 border border-slate-200/80 rounded p-3">
                  {categories.map((cat) => {
                    const isChecked = (personForm.categoryIds || []).includes(cat.id);
                    return (
                      <div key={cat.id} className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const updatedCatIds = e.target.checked
                                ? [...(personForm.categoryIds || []), cat.id]
                                : (personForm.categoryIds || []).filter((id) => id !== cat.id);
                              setPersonForm({ ...personForm, categoryIds: updatedCatIds });
                            }}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-xs font-semibold text-slate-700">{cat.label}</span>
                        </label>

                        {/* Category-Specific Role Override */}
                        {isChecked && (
                          <div className="pl-6">
                            <input
                              type="text"
                              value={personForm.roles?.[cat.id] || ''}
                              onChange={(e) => {
                                setPersonForm({
                                  ...personForm,
                                  roles: {
                                    ...(personForm.roles || {}),
                                    [cat.id]: e.target.value,
                                  },
                                });
                              }}
                              placeholder={`Role under "${cat.label}" (leave blank to use primary role)`}
                              className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hidden Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="personHidden"
                  checked={personForm.hidden || false}
                  onChange={(e) => setPersonForm({ ...personForm, hidden: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="personHidden" className="text-xs text-slate-600 cursor-pointer">
                  Hide this member from public view
                </label>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPersonModalOpen(false)}
                  className="px-4 py-2 text-xs border border-slate-200 text-slate-600 rounded hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                >
                  {editingPersonIndex !== null ? 'Update Profile' : 'Add to Registry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <MediaPicker
          filter="image"
          onSelect={(url) => {
            setPersonForm({ ...personForm, image: url });
            setShowMediaPicker(false);
          }}
          onClose={() => setShowMediaPicker(false)}
        />
      )}
    </div>
  );
}
