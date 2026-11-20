'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Upload, Search, Image as ImageIcon, FileText, Film, File, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  alt: string;
  createdAt: string;
}

interface Props {
  onSelect: (url: string, item?: MediaItem) => void;
  onClose: () => void;
  filter?: 'image' | 'video' | 'all';
}

function MediaIcon({ mimeType, className }: { mimeType: string; className?: string }) {
  if (mimeType.startsWith('image/')) return <ImageIcon className={className} />;
  if (mimeType.startsWith('video/')) return <Film className={className} />;
  if (mimeType.includes('pdf')) return <FileText className={className} />;
  return <File className={className} />;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export default function MediaPicker({ onSelect, onClose, filter = 'all' }: Props) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(async () => {
    try {
      const res = await fetch('/api/media');
      if (res.ok) setMedia(await res.json());
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchMedia(); }, [fetchMedia]);

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', files[0]);
    try {
      const res = await fetch('/api/media', { method: 'POST', body: formData });
      if (res.ok) {
        toast.success('File uploaded');
        await fetchMedia();
      } else {
        toast.error('Upload failed');
      }
    } catch {
      toast.error('Upload error');
    } finally {
      setUploading(false);
    }
  };

  const filtered = media.filter((m) => {
    const matchSearch = m.originalName.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ? true :
      filter === 'image' ? m.mimeType.startsWith('image/') :
      filter === 'video' ? m.mimeType.startsWith('video/') : true;
    return matchSearch && matchFilter;
  });

  const selectedItem = media.find((m) => m.id === selected);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden"
        style={{ width: '780px', height: '540px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-800">Media Library</h2>
            {filter !== 'all' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium capitalize">
                {filter}s only
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded w-40 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <label className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 cursor-pointer transition-colors">
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              Upload
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={filter === 'image' ? 'image/*' : filter === 'video' ? 'video/*' : '*'}
                onChange={(e) => handleUpload(e.target.files)}
              />
            </label>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Grid */}
          <div className="flex-1 overflow-y-auto p-3">
            {loading ? (
              <div className="flex items-center justify-center h-full gap-2 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-xs">Loading…</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
                <ImageIcon className="w-8 h-8 text-slate-200" />
                <p className="text-xs">{search ? 'No results' : 'No media uploaded yet'}</p>
                <label className="text-xs text-blue-600 hover:underline cursor-pointer">
                  Upload files
                  <input type="file" className="hidden" onChange={(e) => handleUpload(e.target.files)} />
                </label>
              </div>
            ) : (
              <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))' }}>
                {filtered.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelected(selected === item.id ? null : item.id)}
                    className="relative rounded overflow-hidden border-2 transition-all text-left"
                    style={{
                      borderColor: selected === item.id ? '#2563eb' : 'transparent',
                      background: '#f8fafc',
                    }}
                  >
                    <div className="aspect-square flex items-center justify-center bg-slate-100">
                      {item.mimeType.startsWith('image/') ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.url} alt={item.alt} className="w-full h-full object-cover" />
                      ) : (
                        <MediaIcon mimeType={item.mimeType} className="w-8 h-8 text-slate-400" />
                      )}
                    </div>
                    {selected === item.id && (
                      <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <p className="px-1.5 py-1 text-[10px] text-slate-600 truncate">{item.originalName}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar — selected info */}
          {selectedItem && (
            <div className="w-52 border-l border-slate-200 p-3 flex-shrink-0 overflow-y-auto bg-slate-50">
              <div className="aspect-square bg-slate-100 rounded overflow-hidden mb-3">
                {selectedItem.mimeType.startsWith('image/') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selectedItem.url} alt={selectedItem.alt} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MediaIcon mimeType={selectedItem.mimeType} className="w-10 h-10 text-slate-300" />
                  </div>
                )}
              </div>
              <p className="text-[10px] font-semibold text-slate-700 truncate mb-1">{selectedItem.originalName}</p>
              <p className="text-[10px] text-slate-400 mb-0.5">{selectedItem.mimeType}</p>
              <p className="text-[10px] text-slate-400 mb-0.5">{formatSize(selectedItem.size)}</p>
              <p className="text-[10px] text-slate-400 mb-3">
                {new Date(selectedItem.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
              <p className="text-[10px] font-mono text-slate-500 break-all mb-3">{selectedItem.url}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50 flex-shrink-0">
          <span className="text-[10px] text-slate-400">
            {filtered.length} file{filtered.length !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs border border-slate-200 text-slate-600 rounded hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => selected && selectedItem && onSelect(selectedItem.url, selectedItem)}
              disabled={!selected}
              className="px-3 py-1.5 text-xs text-white rounded font-medium transition-colors disabled:opacity-40"
              style={{ background: '#2563eb' }}
            >
              Select File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
