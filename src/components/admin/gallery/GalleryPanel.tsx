'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { fixImageUrl } from '@/lib/apiConfig';
import { Plus, Edit3, Trash2, X, UploadCloud, ImageIcon, Film, Eye, Link as LinkIcon } from 'lucide-react';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  description: string | null;
  type: 'IMAGE' | 'VIDEO';
  mediaUrl: string;
  thumbnailUrl: string | null;
  isFeatured: boolean;
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
  displayOrder: number;
  updatedAt: string;
}

interface GalleryPanelProps {
  type: 'IMAGE' | 'VIDEO';
}

export default function GalleryPanel({ type }: GalleryPanelProps) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  
  // Bulk Delete state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | string[] | null>(null);

  // Video specific state
  const [videoInputMode, setVideoInputMode] = useState<'LINK' | 'UPLOAD'>('LINK');

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    mediaUrl: '',
    thumbnailUrl: '',
    isFeatured: false,
    status: 'ACTIVE',
    displayOrder: 1,
    type: type
  });

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/gallery?type=${type}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setItems(data.data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
    } finally {
      setIsLoading(false);
      setSelectedIds([]);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [type]);

  const openAddModal = () => {
    setSelectedItem(null);
    setFormData({
      title: '',
      category: '',
      description: '',
      mediaUrl: '',
      thumbnailUrl: '',
      isFeatured: false,
      status: 'ACTIVE',
      displayOrder: items.length + 1,
      type: type
    });
    setVideoInputMode('LINK');
    setIsModalOpen(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setSelectedItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      description: item.description || '',
      mediaUrl: item.mediaUrl,
      thumbnailUrl: item.thumbnailUrl || '',
      isFeatured: item.isFeatured,
      status: item.status,
      displayOrder: item.displayOrder,
      type: item.type
    });
    // If it's a relative path or an upload path, might be UPLOAD, but default to link for now if it's http
    setVideoInputMode(item.mediaUrl.startsWith('http') && !item.mediaUrl.includes('localhost') ? 'LINK' : 'UPLOAD');
    setIsModalOpen(true);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === items.length && items.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map(i => i.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const triggerSingleDelete = (id: string) => {
    setDeleteTarget(id);
    setIsConfirmOpen(true);
  };

  const triggerBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setDeleteTarget(selectedIds);
    setIsConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (Array.isArray(deleteTarget)) {
        const response = await api.post('/gallery/bulk-delete', { ids: deleteTarget });
        if (response.ok) {
          setItems(items.filter(i => !deleteTarget.includes(i.id)));
          setSelectedIds([]);
        }
      } else {
        const response = await api.delete(`/gallery/${deleteTarget}`);
        if (response.ok) {
          setItems(items.filter(i => i.id !== deleteTarget));
        }
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        displayOrder: parseInt(formData.displayOrder as any, 10) || 1
      };
      
      let response;
      if (selectedItem) {
        response = await api.patch(`/gallery/${selectedItem.id}`, payload);
      } else {
        response = await api.post('/gallery', payload);
      }

      if (response.ok) {
        setIsModalOpen(false);
        fetchItems();
      } else {
        const errorData = await response.json();
        alert(`Failed to save: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Failed to save item");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'mediaUrl' | 'thumbnailUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      // Frontend size validation
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      const IMAGE_LIMIT = 50 * 1024 * 1024;   // 50 MB
      const VIDEO_LIMIT = 500 * 1024 * 1024;  // 500 MB

      if (isImage && file.size > IMAGE_LIMIT) {
        alert('Image size must not exceed 50 MB. Please choose a smaller file.');
        e.target.value = '';
        return;
      }
      if (isVideo && file.size > VIDEO_LIMIT) {
        alert('Video size must not exceed 500 MB. Please choose a smaller file.');
        e.target.value = '';
        return;
      }

      const formDataUpload = new FormData();
      formDataUpload.append('image', file); // API expects 'image' key, might handle videos too
      
      setIsUploading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/upload`, {
          method: 'POST',
          credentials: 'include',
          body: formDataUpload,
        });
        
        const data = await response.json();
        const uploadedUrl = data.url || data.data?.url;
        if (data.success && uploadedUrl) {
          setFormData(prev => ({ ...prev, [field]: uploadedUrl }));
        } else {
          alert('Upload failed: ' + (data.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <span className="px-2 py-1 rounded bg-green-50 text-green-600 border border-green-200 text-[10px] font-bold tracking-wider">ACTIVE</span>;
      case 'INACTIVE': return <span className="px-2 py-1 rounded bg-gray-100 text-gray-600 border border-gray-200 text-[10px] font-bold tracking-wider">INACTIVE</span>;
      case 'DRAFT': return <span className="px-2 py-1 rounded bg-yellow-50 text-yellow-600 border border-yellow-200 text-[10px] font-bold tracking-wider">DRAFT</span>;
      default: return <span className="px-2 py-1 rounded bg-gray-100 text-gray-600 border border-gray-200 text-[10px] font-bold tracking-wider">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 capitalize">{type.toLowerCase()} Gallery</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your {type.toLowerCase()}s here.</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <button 
              onClick={triggerBulkDelete}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium text-sm shadow-sm transition-colors border border-red-200"
            >
              <Trash2 size={16} />
              Delete Selected ({selectedIds.length})
            </button>
          )}
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#6320ee] text-white rounded-lg hover:bg-[#521ac6] font-medium text-sm shadow-sm transition-colors"
          >
            <Plus size={16} />
            Add {type === 'IMAGE' ? 'Image' : 'Video'}
          </button>
        </div>
      </div>

      {/* Grid View */}
      {isLoading ? (
        <div className="py-12 text-center text-gray-500">Loading...</div>
      ) : items.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            {type === 'IMAGE' ? <ImageIcon size={28} className="text-gray-400" /> : <Film size={28} className="text-gray-400" />}
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No items found</h3>
          <p className="text-gray-500 text-sm">Add your first {type.toLowerCase()} to the gallery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className={`bg-white rounded-xl shadow-sm border ${selectedIds.includes(item.id) ? 'border-[#6320ee] ring-1 ring-[#6320ee]/20' : 'border-gray-200'} overflow-hidden group hover:shadow-md transition-all`}>
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                {/* Checkbox */}
                <div className="absolute top-3 left-3 z-10 bg-white/80 backdrop-blur-sm rounded p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-[#6320ee] focus:ring-[#6320ee] cursor-pointer block"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggleSelectOne(item.id)}
                  />
                </div>

                {type === 'IMAGE' ? (
                  <img src={fixImageUrl(item.mediaUrl)} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <>
                    {item.thumbnailUrl ? (
                      <img src={fixImageUrl(item.thumbnailUrl)} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400"><Film size={32} /></div>
                    )}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-900 shadow-lg">
                        <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>
                  </>
                )}
                
                {/* Actions */}
                <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(item)} className="p-1.5 bg-white/90 backdrop-blur-sm text-gray-700 hover:text-violet-600 rounded-md shadow-sm transition-colors">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => triggerSingleDelete(item.id)} className="p-1.5 bg-white/90 backdrop-blur-sm text-gray-700 hover:text-red-600 rounded-md shadow-sm transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 truncate">{item.title}</h3>
                      {item.isFeatured && <span className="text-[9px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold border border-yellow-200">HOME</span>}
                    </div>
                    <span className="text-xs font-semibold text-violet-600 mt-0.5 uppercase tracking-wider">{item.category}</span>
                  </div>
                  {getStatusBadge(item.status)}
                </div>
                {item.description && <p className="text-sm text-gray-500 line-clamp-2 mb-3">{item.description}</p>}
                <div className="text-xs text-gray-400 font-medium mt-auto">
                  Order: {item.displayOrder}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <h2 className="text-lg font-bold text-gray-900">{selectedItem ? `Edit ${type.toLowerCase()}` : `Add New ${type.toLowerCase()}`}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5">Title</label>
                  <input 
                    type="text" 
                    placeholder="Enter title"
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-sm"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5">Category</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Training, Events"
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-sm uppercase"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value.toUpperCase()})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1.5">Description (Optional)</label>
                <textarea 
                  placeholder="Enter brief description"
                  rows={3}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-sm resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              {type === 'VIDEO' && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-gray-900">Video Source</label>
                    <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                      <button 
                        onClick={() => setVideoInputMode('LINK')}
                        className={`px-3 py-1 text-xs font-bold rounded-md flex items-center gap-1.5 transition-colors ${videoInputMode === 'LINK' ? 'bg-violet-100 text-violet-700' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        <LinkIcon size={12} /> URL Link
                      </button>
                      <button 
                        onClick={() => setVideoInputMode('UPLOAD')}
                        className={`px-3 py-1 text-xs font-bold rounded-md flex items-center gap-1.5 transition-colors ${videoInputMode === 'UPLOAD' ? 'bg-violet-100 text-violet-700' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        <UploadCloud size={12} /> Upload File
                      </button>
                    </div>
                  </div>

                  {videoInputMode === 'LINK' ? (
                    <div>
                      <input 
                        type="url" 
                        placeholder="https://youtube.com/..."
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-sm"
                        value={formData.mediaUrl}
                        onChange={e => setFormData({...formData, mediaUrl: e.target.value})}
                      />
                      <p className="text-[10px] text-gray-500 mt-1.5 ml-1">Paste a YouTube, Vimeo, or direct video link (recommended).</p>
                    </div>
                  ) : (
                    <div>
                      <div className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden bg-white hover:bg-gray-50 transition-colors group">
                        <input 
                          type="file" 
                          accept="video/mp4, video/webm" 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          onChange={(e) => handleFileUpload(e, 'mediaUrl')}
                        />
                        {formData.mediaUrl && !formData.mediaUrl.startsWith('http') ? (
                          <div className="text-sm font-medium text-green-600 flex items-center gap-2">
                            <Film size={16} /> Video Uploaded
                          </div>
                        ) : (
                          <>
                            <UploadCloud className="text-gray-400 mb-2" size={20} />
                            <div className="text-xs text-gray-600 font-medium">Click to upload video</div>
                            <div className="text-[10px] text-gray-400 mt-1">MP4, WEBM (Max 500MB)</div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Video Thumbnail Image (Optional)</label>
                    <div className="border border-dashed border-gray-300 rounded-xl p-3 flex items-center gap-4 bg-white">
                       <div className="relative w-16 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                          {formData.thumbnailUrl ? (
                            <img src={fixImageUrl(formData.thumbnailUrl)} className="w-full h-full object-cover" alt="thumb" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={16} /></div>
                          )}
                       </div>
                       <div className="flex-1 relative">
                          <input 
                            type="file" 
                            accept="image/png, image/jpeg, image/webp" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={(e) => handleFileUpload(e, 'thumbnailUrl')}
                          />
                          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors">
                            {formData.thumbnailUrl ? 'Change Thumbnail' : 'Upload Thumbnail'}
                          </button>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {type === 'IMAGE' && (
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5">Upload Image</label>
                  <div className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors group h-32">
                    <input 
                      type="file" 
                      accept="image/png, image/jpeg, image/webp" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={(e) => handleFileUpload(e, 'mediaUrl')}
                    />
                    {isUploading ? (
                      <div className="flex flex-col items-center justify-center z-0">
                        <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mb-2" />
                        <span className="text-xs font-semibold text-violet-600">Uploading to Cloudinary...</span>
                      </div>
                    ) : formData.mediaUrl ? (
                      <div className="absolute inset-0 z-0 bg-white">
                        <img src={fixImageUrl(formData.mediaUrl)} alt="Preview" className="w-full h-full object-contain" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                          <span className="bg-white/90 px-3 py-1 rounded text-xs font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">Change Image</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="text-gray-400 mb-2" size={24} />
                        <div className="text-xs text-gray-600 font-medium">Click to upload or drag & drop</div>
                        <div className="text-[10px] text-gray-400 mt-1">PNG, JPG, WEBP (Max 50MB)</div>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5">Status</label>
                  <select 
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-sm"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5">Display Order</label>
                  <input 
                    type="number" 
                    min="1"
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-sm"
                    value={formData.displayOrder || ''}
                    onChange={e => {
                      const val = parseInt(e.target.value, 10);
                      setFormData({...formData, displayOrder: isNaN(val) ? ('' as any) : val});
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <input 
                  type="checkbox" 
                  id="featuredToggle"
                  className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-600 cursor-pointer"
                  checked={formData.isFeatured}
                  onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
                />
                <label htmlFor="featuredToggle" className="text-sm font-bold text-gray-900 cursor-pointer">
                  Show on Home Page
                  <span className="block text-xs text-gray-500 font-medium mt-0.5">Feature this item on the main landing page gallery preview.</span>
                </label>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isUploading || !formData.mediaUrl || !formData.title || !formData.category}
                className="px-5 py-2 bg-[#6320ee] text-white rounded-lg font-medium text-sm hover:bg-[#521ac6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : 'Save Item'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={executeDelete}
        itemCount={Array.isArray(deleteTarget) ? deleteTarget.length : 1}
      />
    </div>
  );
}
