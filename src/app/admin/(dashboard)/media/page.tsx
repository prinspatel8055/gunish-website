'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Upload, Search, Image as ImageIcon, FileText, Film, File, Loader2, Copy, Trash2, LayoutGrid, List } from 'lucide-react';
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

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function MediaIcon({ mimeType, className }: { mimeType: string; className?: string }) {
  if (mimeType.startsWith('image/')) return <ImageIcon className={className} />;
  if (mimeType.startsWith('video/')) return <Film className={className} />;
  if (mimeType.includes('pdf')) return <FileText className={className} />;
  return <File className={className} />;
}

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Detail Modal & Replacement states
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [editingAlt, setEditingAlt] = useState('');
  const [savingAlt, setSavingAlt] = useState(false);
  const [replacing, setReplacing] = useState(false);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const handleSaveAlt = async () => {
    if (!selectedItem) return;
    setSavingAlt(true);
    try {
      const res = await fetch(`/api/media/${selectedItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alt: editingAlt }),
      });
      if (res.ok) {
        const updated = await res.json();
        setMedia((prev) => prev.map((m) => (m.id === selectedItem.id ? updated : m)));
        setSelectedItem(updated);
        toast.success('Alt text updated successfully');
      } else {
        toast.error('Failed to update alt text');
      }
    } catch {
      toast.error('Network error. Failed to save alt text.');
    } finally {
      setSavingAlt(false);
    }
  };

  const handleReplace = async (files: FileList | null) => {
    if (!selectedItem || !files?.length) return;
    setReplacing(true);
    const formData = new FormData();
    formData.append('file', files[0]);
    try {
      const res = await fetch(`/api/media/${selectedItem.id}`, {
        method: 'PUT',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMedia((prev) => prev.map((m) => (m.id === selectedItem.id ? data : m)));
        setSelectedItem(data);
        toast.success('File replaced successfully');
      } else {
        toast.error(data.error || 'Failed to replace file');
      }
    } catch {
      toast.error('Network error. Failed to replace file.');
    } finally {
      setReplacing(false);
      if (replaceInputRef.current) replaceInputRef.current.value = '';
    }
  };

  const fetchMedia = useCallback(async () => {
    try {
      const res = await fetch('/api/media');
      if (res.ok) setMedia(await res.json());
    } catch {
      toast.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMedia(); }, [fetchMedia]);

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    
    // Upload files sequentially for simplicity, could be parallelized
    let successCount = 0;
    
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);
      try {
        const res = await fetch('/api/media', { method: 'POST', body: formData });
        if (res.ok) successCount++;
      } catch (e) {
        console.error('Upload failed for', files[i].name, e);
      }
    }
    
    if (successCount > 0) {
      toast.success(`Uploaded ${successCount} file${successCount !== 1 ? 's' : ''}`);
      await fetchMedia();
    } else {
      toast.error('Upload failed');
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this file permanently?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMedia(media.filter(m => m.id !== id));
        toast.success('File deleted');
      } else {
        toast.error('Failed to delete file');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setDeletingId(null);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    toast.success('URL copied to clipboard');
  };

  const filtered = media.filter(m => {
    const matchSearch = m.originalName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = 
      filter === 'all' ? true :
      filter === 'image' ? m.mimeType.startsWith('image/') :
      filter === 'video' ? m.mimeType.startsWith('video/') :
      m.mimeType.includes('pdf') || m.mimeType.includes('document');
    return matchSearch && matchFilter;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-10 shrink-0 bg-white border-b border-slate-200 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-slate-400" />
            <h1 className="text-sm font-semibold text-slate-800">Media Library</h1>
          </div>
          {!loading && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-slate-100 text-slate-500">
              {media.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label className="inline-flex items-center gap-1.5 text-white text-xs font-medium px-3 py-1.5 rounded cursor-pointer transition-colors" style={{ background: '#2563eb' }}>
            {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            {uploading ? 'Uploading...' : 'Upload'}
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              multiple
              onChange={(e) => handleUpload(e.target.files)} 
            />
          </label>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded">
          {(['all', 'image', 'video', 'document'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${filter === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search files…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white w-48 transition-all"
            />
          </div>
          <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded border border-slate-200">
            <button
              onClick={() => setView('grid')}
              className={`p-1 rounded ${view === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-1 rounded ${view === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-2 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading media library...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded border-dashed">
            <ImageIcon className="w-10 h-10 text-slate-200 mb-3" />
            <p className="text-sm font-medium text-slate-500 mb-1">{search ? 'No files match your search' : 'Media Library is empty'}</p>
            <p className="text-xs text-slate-400 mb-4">Upload images, videos, and documents to use across your site.</p>
            <label className="inline-flex items-center gap-1.5 text-white text-xs font-medium px-4 py-2 rounded cursor-pointer transition-colors" style={{ background: '#2563eb' }}>
              <Upload className="w-3.5 h-3.5" />
              Upload Files
              <input type="file" className="hidden" multiple onChange={(e) => handleUpload(e.target.files)} />
            </label>
          </div>
        ) : view === 'grid' ? (
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
            {filtered.map(item => (
              <div 
                key={item.id} 
                onClick={() => { setSelectedItem(item); setEditingAlt(item.alt || ''); }}
                className="bg-white border border-slate-200 rounded overflow-hidden group hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
              >
                <div className="aspect-square bg-slate-100 flex items-center justify-center relative overflow-hidden">
                  {item.mimeType.startsWith('image/') ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.url} alt={item.alt} className="w-full h-full object-cover" />
                  ) : (
                    <MediaIcon mimeType={item.mimeType} className="w-10 h-10 text-slate-300" />
                  )}
                  {/* Hover overlay actions */}
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => copyUrl(item.url)} 
                      className="p-1.5 bg-white/20 hover:bg-white/40 text-white rounded transition-colors"
                      title="Copy URL"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)} 
                      disabled={deletingId === item.id}
                      className="p-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded transition-colors"
                      title="Delete"
                    >
                      {deletingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="p-2.5 flex-1 flex flex-col justify-between bg-white border-t border-slate-100">
                  <p className="text-[10px] font-semibold text-slate-700 truncate" title={item.originalName}>{item.originalName}</p>
                  <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-50">
                    <p className="text-[9px] text-slate-400">{formatSize(item.size)}</p>
                    <p className="text-[9px] text-slate-400 uppercase font-mono">{item.mimeType.split('/')[1] || 'file'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-2 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider w-12">File</th>
                  <th className="px-4 py-2 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-2 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-2 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Size</th>
                  <th className="px-4 py-2 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr 
                    key={item.id} 
                    onClick={() => { setSelectedItem(item); setEditingAlt(item.alt || ''); }}
                    className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-2">
                      <div className="w-8 h-8 bg-slate-100 rounded overflow-hidden flex items-center justify-center">
                        {item.mimeType.startsWith('image/') ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.url} alt={item.alt} className="w-full h-full object-cover" />
                        ) : (
                          <MediaIcon mimeType={item.mimeType} className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <p className="text-xs font-medium text-slate-700 truncate max-w-xs" title={item.originalName}>{item.originalName}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-xs font-mono">{item.url}</p>
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{item.mimeType}</span>
                    </td>
                    <td className="px-4 py-2 text-xs text-slate-500">{formatSize(item.size)}</td>
                    <td className="px-4 py-2 text-[10px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-2" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => copyUrl(item.url)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Copy URL">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} disabled={deletingId === item.id} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                          {deletingId === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-2xl flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Preview Panel */}
            <div className="md:w-1/2 bg-slate-950 flex items-center justify-center p-6 min-h-[240px] relative">
              {selectedItem.mimeType.startsWith('image/') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={selectedItem.url} 
                  alt={selectedItem.alt} 
                  className="max-w-full max-h-[350px] object-contain rounded shadow-lg"
                />
              ) : (
                <div className="text-center text-white/50 space-y-2">
                  <MediaIcon mimeType={selectedItem.mimeType} className="w-16 h-16 mx-auto opacity-40 text-white" />
                  <p className="text-xs uppercase tracking-wider">{selectedItem.mimeType}</p>
                </div>
              )}
            </div>

            {/* Right Details Panel */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto max-h-[500px] md:max-h-none">
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="text-sm font-semibold text-slate-800 truncate" title={selectedItem.originalName}>
                    {selectedItem.originalName}
                  </h3>
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>

                {/* Metadata list */}
                <div className="space-y-3 text-xs mb-6">
                  <div>
                    <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">File URL</span>
                    <div className="flex items-center gap-1.5 mt-1 bg-slate-50 border border-slate-200 rounded p-1.5 font-mono text-[10px] text-slate-600 truncate">
                      <span className="truncate flex-1">{selectedItem.url}</span>
                      <button 
                        onClick={() => copyUrl(selectedItem.url)}
                        className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0"
                        title="Copy URL"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Size</span>
                      <span className="block mt-1 font-medium text-slate-700">{formatSize(selectedItem.size)}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Type</span>
                      <span className="block mt-1 font-medium text-slate-700 uppercase">{selectedItem.mimeType.split('/')[1] || 'Unknown'}</span>
                    </div>
                  </div>

                  <div>
                    <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Uploaded On</span>
                    <span className="block mt-1 font-medium text-slate-700">
                      {new Date(selectedItem.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                {/* Alt text field */}
                <div className="mb-6 pt-4 border-t border-slate-100">
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Alt Text (SEO description)
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={editingAlt}
                      onChange={(e) => setEditingAlt(e.target.value)}
                      placeholder="Describe this image for search engines..."
                      className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                    />
                    <button
                      onClick={handleSaveAlt}
                      disabled={savingAlt}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-[11px] font-semibold rounded transition-colors flex-shrink-0"
                    >
                      {savingAlt ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to permanently delete this media file?')) {
                      handleDelete(selectedItem.id);
                      setSelectedItem(null);
                    }
                  }}
                  className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete File
                </button>

                <div>
                  <button
                    onClick={() => replaceInputRef.current?.click()}
                    disabled={replacing}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    {replacing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    {replacing ? 'Replacing...' : 'Replace File'}
                  </button>
                  <input 
                    ref={replaceInputRef}
                    type="file" 
                    onChange={(e) => handleReplace(e.target.files)} 
                    className="hidden" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
