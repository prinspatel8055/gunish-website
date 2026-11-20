'use client';

import { Field, Input, Textarea, Toggle, Select } from './HeroEditor';
import MediaPicker from '../MediaPicker';
import { useState } from 'react';

interface QuoteData {
  quote: string;
  author: string;
  citation: string;
  signature: string;
  image?: string;
  imageSize?: 'small' | 'medium' | 'large' | 'xl' | 'xxl';
  layout?: 'editorial' | 'simple' | 'split-flat' | 'card-testimonial';
  align?: 'left' | 'center';
  fontStyle?: 'serif' | 'sans';
  showAccents?: boolean;
}

interface Props {
  data: object;
  onChange: (d: object) => void;
}

export default function QuoteEditor({ data, onChange }: Props) {
  const d = data as QuoteData;
  const [sigPickerOpen, setSigPickerOpen] = useState(false);
  const [portraitPickerOpen, setPortraitPickerOpen] = useState(false);

  const set = (key: string, value: unknown) => onChange({ ...d, [key]: value });

  return (
    <div className="space-y-4">
      {/* 1. Layout Selector */}
      <Field label="Layout Variant">
        <Select
          value={d.layout || 'editorial'}
          onChange={(v) => set('layout', v)}
          options={[
            { value: 'editorial', label: 'Premium Editorial (Diagonal slants & cutout portrait)' },
            { value: 'simple', label: 'Simple Classic (Centred text, no portrait)' },
            { value: 'split-flat', label: 'Modern Split (50/50 split, flat portrait on right)' },
            { value: 'card-testimonial', label: 'Glass Card Testimonial (Translucent gold border card)' }
          ]}
        />
      </Field>

      {/* 2. Portrait Image Selector (Only for layouts that support portrait) */}
      {(d.layout === 'editorial' || d.layout === 'split-flat' || !d.layout) && (
        <>
          <Field label="Portrait Image (PNG/JPG)">
            <div className="flex gap-2">
              <Input value={d.image || ''} onChange={(v) => set('image', v)} placeholder="/assets/images/portrait.png" />
              <button
                type="button"
                onClick={() => setPortraitPickerOpen(true)}
                className="flex-shrink-0 px-2.5 py-1.5 text-[10px] border border-slate-200 rounded text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors whitespace-nowrap bg-white"
              >
                Browse
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Pick a portrait photo of the leader</p>
          </Field>
          <Field label="Portrait Image Size">
            <Select
              value={d.imageSize || 'medium'}
              onChange={(v) => set('imageSize', v)}
              options={[
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium (Default)' },
                { value: 'large', label: 'Large' },
                { value: 'xl', label: 'Extra Large (XL)' },
                { value: 'xxl', label: 'Double Extra Large (XXL)' }
              ]}
            />
          </Field>
        </>
      )}

      {/* 3. Text Alignment Options (Only for simple & card-testimonial layouts) */}
      {(d.layout === 'simple' || d.layout === 'card-testimonial') && (
        <Field label="Text Alignment">
          <Select
            value={d.align || 'center'}
            onChange={(v) => set('align', v)}
            options={[
              { value: 'center', label: 'Centered' },
              { value: 'left', label: 'Left Aligned' }
            ]}
          />
        </Field>
      )}

      {/* 4. Font Style Option */}
      <Field label="Typography Style">
        <Select
          value={d.fontStyle || 'serif'}
          onChange={(v) => set('fontStyle', v)}
          options={[
            { value: 'serif', label: 'Premium Editorial Serif (Playfair)' },
            { value: 'sans', label: 'Modern Clean Sans-Serif (Inter)' }
          ]}
        />
      </Field>

      {/* 5. Quote Text Field */}
      <Field label="Quote Text" required>
        <Textarea
          value={d.quote || ''}
          onChange={(v) => set('quote', v)}
          placeholder="Enter the quote text…"
          rows={4}
          maxLength={180}
        />
        <p className="text-[10px] text-slate-400 mt-1">
          Characters: {(d.quote || '').length}/180 (Limits quote text length to preserve design structure)
        </p>
      </Field>

      {/* 6. Author Name */}
      <Field label="Author">
        <Input value={d.author || ''} onChange={(v) => set('author', v)} placeholder="Author Name" />
      </Field>

      {/* 7. Citation Title */}
      <Field label="Citation / Title">
        <Input value={d.citation || ''} onChange={(v) => set('citation', v)} placeholder="Vice Chancellor, RTU" />
      </Field>

      {/* 8. Signature Selector */}
      <Field label="Signature Image (PNG)">
        <div className="flex gap-2">
          <Input value={d.signature || ''} onChange={(v) => set('signature', v)} placeholder="/assets/images/signature.png" />
          <button
            type="button"
            onClick={() => setSigPickerOpen(true)}
            className="flex-shrink-0 px-2.5 py-1.5 text-[10px] border border-slate-200 rounded text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors whitespace-nowrap bg-white"
          >
            Browse
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5">Pick a transparent PNG image representing the signature</p>
      </Field>

      {/* 9. Background Accents Toggle */}
      <div className="flex items-center gap-2 pt-2">
        <Toggle checked={d.showAccents !== false} onChange={(v) => set('showAccents', v)} />
        <span className="text-xs text-slate-600">Show Background Accents & Spotlights</span>
      </div>

      {/* Media Pickers */}
      {sigPickerOpen && (
        <MediaPicker
          onSelect={(url) => { set('signature', url); setSigPickerOpen(false); }}
          onClose={() => setSigPickerOpen(false)}
          filter="image"
        />
      )}

      {portraitPickerOpen && (
        <MediaPicker
          onSelect={(url) => { set('image', url); setPortraitPickerOpen(false); }}
          onClose={() => setPortraitPickerOpen(false)}
          filter="image"
        />
      )}
    </div>
  );
}
