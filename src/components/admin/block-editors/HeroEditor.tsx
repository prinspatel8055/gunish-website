'use client';

import MediaPicker from '../MediaPicker';
import { useState } from 'react';
import { RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';


interface HeroStatItem {
  value: string;
  label: string;
  icon: string;
}

interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  tagline: string;
  taglineIcon: string;
  isSubpage: boolean;
  variant?: 'home' | 'subpage-dark' | 'subpage-light';
  primaryCTA: { label: string; url: string };
  portrait: { imageUrl: string; imageAlt: string };
  bgImage?: string;
  subpageHeight?: 'short' | 'medium' | 'full';
  subpageAlign?: 'left' | 'center';
  layoutVariant?: 'editorial' | 'stats-grid';
  heroStats?: HeroStatItem[];
  lightBgStyle?: 'grid-dots' | 'minimal' | 'dots' | 'grid' | 'slate-tint';
  lightGradientPos?: 'none' | 'top-left' | 'top-right' | 'both';
}

interface Props { data: object; onChange: (d: object) => void; }

export default function HeroEditor({ data, onChange }: Props) {
  const d = data as HeroData;
  const [pickerOpen, setPickerOpen] = useState(false);
  const [bgPickerOpen, setBgPickerOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleSyncToAllSubpages = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/pages/sync-hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variant: activeVariant,
          subpageHeight: d.subpageHeight || 'medium',
          subpageAlign: d.subpageAlign || 'left',
          lightBgStyle: d.lightBgStyle || 'grid-dots',
          lightGradientPos: d.lightGradientPos || 'none'
        })
      });
      const resData = await res.json();
      if (!res.ok) {
        toast.error(resData.error || 'Failed to sync layout settings');
      } else {
        toast.success(resData.message || 'Layout settings synced to all subpages successfully!');
      }
    } catch (error) {
      console.error('Failed to sync hero settings:', error);
      toast.error('Failed to sync layout settings');
    } finally {
      setSyncing(false);
    }
  };

  const set = (key: string, value: unknown) => onChange({ ...d, [key]: value });
  const setCTA = (key: string, value: string) => onChange({ ...d, primaryCTA: { ...d.primaryCTA, [key]: value } });
  const setPortrait = (key: string, value: string) => onChange({ ...d, portrait: { ...d.portrait, [key]: value } });

  const activeVariant = d.variant || (d.isSubpage ? 'subpage-dark' : 'home');

  const handleVariantChange = (v: string) => {
    if (v === 'home') {
      onChange({ ...d, variant: 'home', isSubpage: false });
    } else if (v === 'subpage-dark') {
      onChange({ ...d, variant: 'subpage-dark', isSubpage: true });
    } else if (v === 'subpage-light') {
      onChange({ ...d, variant: 'subpage-light', isSubpage: true });
    }
  };

  const addStat = () => {
    const stats = [...(d.heroStats || [])];
    stats.push({ value: '00', label: 'New Stat', icon: 'Award' });
    set('heroStats', stats);
  };

  const updateStat = (index: number, key: keyof HeroStatItem, value: string) => {
    const stats = [...(d.heroStats || [])];
    stats[index] = { ...stats[index], [key]: value };
    set('heroStats', stats);
  };

  const removeStat = (index: number) => {
    const stats = [...(d.heroStats || [])];
    stats.splice(index, 1);
    set('heroStats', stats);
  };

  return (
    <div className="space-y-4">
      <Field label="Hero Variant">
        <Select
          value={activeVariant}
          onChange={handleVariantChange}
          options={[
            { value: 'home', label: 'Homepage Editorial (Dark)' },
            { value: 'subpage-dark', label: 'Subpage Dark Banner' },
            { value: 'subpage-light', label: 'Subpage Light Spotlight' }
          ]}
        />
      </Field>

      <Divider label="Content Settings" />

      <Field label="Title" required>
        <Input value={d.title || ''} onChange={(v) => set('title', v)} placeholder="Title text" />
      </Field>
      <Field label="Subtitle">
        <Input value={d.subtitle || ''} onChange={(v) => set('subtitle', v)} placeholder="Subtitle text" />
      </Field>
      <Field label="Description">
        <Input value={d.description || ''} onChange={(v) => set('description', v)} placeholder="Detailed description" />
      </Field>

      {activeVariant === 'home' && (
        <>
          <Field label="Tagline">
            <Input value={d.tagline || ''} onChange={(v) => set('tagline', v)} placeholder="Tagline text" />
          </Field>
          <Field label="Tagline Icon">
            <Input value={d.taglineIcon || ''} onChange={(v) => set('taglineIcon', v)} placeholder="Award" />
            <p className="text-[10px] text-slate-400 mt-0.5">Lucide icon name (e.g. Award, Star, BookOpen)</p>
          </Field>
          
          <Divider label="Layout Configuration" />
          <div className="grid grid-cols-2 gap-2">
            <Field label="Layout Style">
              <Select
                value={d.layoutVariant || 'editorial'}
                onChange={(v) => set('layoutVariant', v)}
                options={[
                  { value: 'editorial', label: 'Editorial (Classic Portrait)' },
                  { value: 'stats-grid', label: 'Stats Grid (Modern CoE)' }
                ]}
              />
            </Field>
            <Field label="Background Image">
              <div className="flex gap-2">
                <Input value={d.bgImage || ''} onChange={(v) => set('bgImage', v)} placeholder="/assets/images/bg.png" />
                <button
                  onClick={() => setBgPickerOpen(true)}
                  className="flex-shrink-0 px-2.5 py-1.5 text-[10px] border border-slate-200 rounded text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors whitespace-nowrap"
                >
                  Browse
                </button>
              </div>
            </Field>
          </div>

          <Divider label="Primary CTA" />
          <div className="grid grid-cols-2 gap-2">
            <Field label="Button Label">
              <Input value={d.primaryCTA?.label || ''} onChange={(v) => setCTA('label', v)} placeholder="Read More" />
            </Field>
            <Field label="Button URL">
              <Input value={d.primaryCTA?.url || ''} onChange={(v) => setCTA('url', v)} placeholder="/about" />
            </Field>
          </div>

          {d.layoutVariant !== 'stats-grid' && (
            <>
              <Divider label="Portrait Image (Editorial Only)" />
              <Field label="Image">
                <div className="flex gap-2">
                  <Input value={d.portrait?.imageUrl || ''} onChange={(v) => setPortrait('imageUrl', v)} placeholder="/assets/images/portrait.png" />
                  <button
                    onClick={() => setPickerOpen(true)}
                    className="flex-shrink-0 px-2.5 py-1.5 text-[10px] border border-slate-200 rounded text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors whitespace-nowrap"
                  >
                    Browse
                  </button>
                </div>
              </Field>
              <Field label="Image Alt Text">
                <Input value={d.portrait?.imageAlt || ''} onChange={(v) => setPortrait('imageAlt', v)} placeholder="Portrait description" />
              </Field>
            </>
          )}

          {d.layoutVariant === 'stats-grid' && (
            <>
              <Divider label="Hero Stats (Stats Grid Only)" />
              <div className="space-y-3.5">
                {(d.heroStats || []).map((stat, index) => (
                  <div key={index} className="p-3 bg-slate-50 rounded border border-slate-100 space-y-2 relative">
                    <button
                      onClick={() => removeStat(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-semibold"
                    >
                      Remove
                    </button>
                    <div className="grid grid-cols-3 gap-2">
                      <Field label="Value">
                        <Input
                          value={stat.value}
                          onChange={(v) => updateStat(index, 'value', v)}
                          placeholder="15+"
                        />
                      </Field>
                      <Field label="Label">
                        <Input
                          value={stat.label}
                          onChange={(v) => updateStat(index, 'label', v)}
                          placeholder="Awards"
                        />
                      </Field>
                      <Field label="Icon">
                        <Input
                          value={stat.icon}
                          onChange={(v) => updateStat(index, 'icon', v)}
                          placeholder="Award"
                        />
                      </Field>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addStat}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 rounded font-medium text-xs transition-colors"
                >
                  + Add Stat Item
                </button>
              </div>
            </>
          )}
        </>
      )}

      {(activeVariant === 'subpage-dark' || activeVariant === 'subpage-light') && (
        <>
          <Divider label="Sub-page Configuration" />
          <div className="grid grid-cols-2 gap-2">
            <Field label="Subpage Height">
              <Select
                value={d.subpageHeight || 'medium'}
                onChange={(v) => set('subpageHeight', v)}
                options={[
                  { value: 'short', label: 'Short' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'full', label: 'Full Viewport' }
                ]}
              />
            </Field>
            <Field label="Text Alignment">
              <Select
                value={d.subpageAlign || 'left'}
                onChange={(v) => set('subpageAlign', v)}
                options={[
                  { value: 'left', label: 'Left Aligned' },
                  { value: 'center', label: 'Centered' }
                ]}
              />
            </Field>
          </div>

          {activeVariant === 'subpage-dark' && (
            <Field label="Background Image">
              <div className="flex gap-2">
                <Input value={d.bgImage || ''} onChange={(v) => set('bgImage', v)} placeholder="/assets/images/bg.png" />
                <button
                  onClick={() => setBgPickerOpen(true)}
                  className="flex-shrink-0 px-2.5 py-1.5 text-[10px] border border-slate-200 rounded text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors whitespace-nowrap"
                >
                  Browse
                </button>
              </div>
            </Field>
          )}

          {activeVariant === 'subpage-light' && (
            <>
              <Field label="Background Pattern Style">
                <Select
                  value={d.lightBgStyle || 'grid-dots'}
                  onChange={(v) => set('lightBgStyle', v)}
                  options={[
                    { value: 'grid-dots', label: 'Grid & Coordinate Dots (Pure White)' },
                    { value: 'grid', label: 'Technical Grid Only (Pure White)' },
                    { value: 'dots', label: 'Coordinate Dots Only (Pure White)' },
                    { value: 'slate-tint', label: 'Technical Grid & Dots (Slate Tinted)' },
                    { value: 'minimal', label: 'Minimal (Clean White Background)' }
                  ]}
                />
              </Field>
              <Field label="Corner Gradients (Wave Glow)">
                <Select
                  value={d.lightGradientPos || 'none'}
                  onChange={(v) => set('lightGradientPos', v)}
                  options={[
                    { value: 'none', label: 'None (Clean)' },
                    { value: 'top-left', label: 'Top-Left Corner only' },
                    { value: 'top-right', label: 'Top-Right Corner only' },
                    { value: 'both', label: 'Both Top Corners' }
                  ]}
                />
              </Field>
            </>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={handleSyncToAllSubpages}
              disabled={syncing}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-650 hover:text-slate-800 rounded font-semibold text-xs border border-slate-200 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60"
            >
              {syncing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  Sync Layout to All Subpages
                </>
              )}
            </button>
          </div>
        </>
      )}


      {pickerOpen && (
        <MediaPicker
          onSelect={(url) => { setPortrait('imageUrl', url); setPickerOpen(false); }}
          onClose={() => setPickerOpen(false)}
          filter="image"
        />
      )}

      {bgPickerOpen && (
        <MediaPicker
          onSelect={(url) => { set('bgImage', url); setBgPickerOpen(false); }}
          onClose={() => setBgPickerOpen(false)}
          filter="image"
        />
      )}
    </div>
  );
}

// Shared small components
export function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-medium text-slate-500 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

export function Input({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
    />
  );
}

export function Textarea({ value, onChange, placeholder, rows = 3, maxLength }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; maxLength?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      maxLength={maxLength}
      className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-y bg-white text-slate-900"
    />
  );
}

export function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-slate-900"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="relative w-8 h-4 rounded-full transition-colors flex-shrink-0"
      style={{ background: checked ? '#2563eb' : '#cbd5e1' }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform"
        style={{ transform: checked ? 'translateX(16px)' : 'translateX(0)' }}
      />
    </button>
  );
}

export function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <div className="flex-1 h-px bg-slate-100" />
      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}
