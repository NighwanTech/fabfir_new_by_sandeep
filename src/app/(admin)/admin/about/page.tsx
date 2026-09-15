'use client';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { fixImageUrl } from '@/lib/apiConfig';
import { Plus, Edit3, Trash2, X, UploadCloud, ImageIcon, Eye, Minus } from 'lucide-react';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';

interface About {
  id: string;
  badge: string;
  headingLine1: string;
  headingLine2: string;
  description: string;
  checklist: string[];
  images: string[];
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
  updatedAt: string;
}

export default function AboutPage() {
  const [abouts, setAbouts] = useState<About[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAbout, setSelectedAbout] = useState<About | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | string[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    badge: '',
    headingLine1: '',
    headingLine2: '',
    description: '',
    checklist: [] as string[],
    images: [] as string[],
    status: 'ACTIVE'
  });

  const fetchAbouts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/about');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAbouts(data.data);
        } else if (Array.isArray(data)) {
          setAbouts(data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch about sections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAbouts();
  }, []);

  const openAddModal = () => {
    setSelectedAbout(null);
    setFormData({
      badge: '',
      headingLine1: '',
      headingLine2: '',
      description: '',
      checklist: [''],
      images: [],
      status: 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (about: About) => {
    setSelectedAbout(about);
    setFormData({
      badge: about.badge || '',
      headingLine1: about.headingLine1 || '',
      headingLine2: about.headingLine2 || '',
      description: about.description || '',
      checklist: about.checklist || [],
      images: about.images || [],
      status: about.status || 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const triggerDelete = (id: string) => {
    setDeleteTarget(id);
    setIsConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (Array.isArray(deleteTarget)) {
        await Promise.all(deleteTarget.map(id => api.delete(`/about/${id}`)));
        setAbouts(abouts.filter(a => !deleteTarget.includes(a.id)));
        setSelectedIds([]);
      } else {
        const response = await api.delete(`/about/${deleteTarget}`);
        if (response.ok) {
          setAbouts(abouts.filter(a => a.id !== deleteTarget));
          setSelectedIds(prev => prev.filter(id => id !== deleteTarget));
        }
      }
    } catch (error) {
      console.error("Error deleting about entry:", error);
    } finally {
      setIsConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(abouts.map(a => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const triggerBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setDeleteTarget(selectedIds);
    setIsConfirmOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        checklist: formData.checklist.filter(item => item.trim() !== '')
      };
      
      let response;
      if (selectedAbout) {
        response = await api.patch(`/about/${selectedAbout.id}`, payload);
      } else {
        response = await api.post('/about', payload);
      }

      if (response.ok) {
        setIsModalOpen(false);
        fetchAbouts();
      } else {
        const errorData = await response.json();
        alert(`Failed to save: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error saving about entry:", error);
      alert("Failed to save about section");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert("File size must be less than 50MB");
        if (e.target) e.target.value = '';
        return;
      }
      
      const uploadData = new FormData();
      uploadData.append('image', file);
      
      setIsUploading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/upload`, {
          method: 'POST',
          body: uploadData,
        credentials: 'include',
      });
        
        const data = await response.json();
        const uploadedUrl = data.url || data.data?.url;
        if (data.success && uploadedUrl) {
          setFormData(prev => ({ ...prev, images: [...prev.images, uploadedUrl] }));
        } else {
          alert('Upload failed: ' + (data.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image');
      } finally {
        setIsUploading(false);
        if (e.target) e.target.value = '';
      }
    }
  };

  const handleImageReplace = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert("File size must be less than 50MB");
        if (e.target) e.target.value = '';
        return;
      }
      
      const uploadData = new FormData();
      uploadData.append('image', file);
      
      setIsUploading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/upload`, {
          method: 'POST',
          body: uploadData,
          credentials: 'include',
        });
        
        const data = await response.json();
        const uploadedUrl = data.url || data.data?.url;
        if (data.success && uploadedUrl) {
          setFormData(prev => {
            const newImages = [...prev.images];
            newImages[index] = uploadedUrl;
            return { ...prev, images: newImages };
          });
        } else {
          alert('Upload failed: ' + data.message);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image');
      } finally {
        setIsUploading(false);
        if (e.target) e.target.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addChecklistItem = () => {
    setFormData(prev => ({ ...prev, checklist: [...prev.checklist, ''] }));
  };

  const updateChecklistItem = (index: number, value: string) => {
    const newChecklist = [...formData.checklist];
    newChecklist[index] = value;
    setFormData(prev => ({ ...prev, checklist: newChecklist }));
  };

  const removeChecklistItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.filter((_, i) => i !== index)
    }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <span className="px-2 py-1 rounded bg-green-50 text-green-600 border border-green-200 text-[10px] font-bold tracking-wider">ACTIVE</span>;
      case 'INACTIVE': return <span className="px-2 py-1 rounded bg-gray-100 text-gray-600 border border-zinc-300 text-[10px] font-bold tracking-wider">INACTIVE</span>;
      case 'DRAFT': return <span className="px-2 py-1 rounded bg-yellow-50 text-yellow-600 border border-yellow-200 text-[10px] font-bold tracking-wider">DRAFT</span>;
      default: return <span className="px-2 py-1 rounded bg-gray-100 text-gray-600 border border-zinc-300 text-[10px] font-bold tracking-wider">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] min-w-0 w-full overflow-hidden">
      <div className="flex-1 flex flex-col transition-all duration-300 min-w-0">
        <div className="p-0 sm:p-2 md:p-8 flex-1 overflow-y-auto overflow-x-hidden w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">About Section</h1>
              <p className="text-gray-500 text-sm mt-1">Manage homepage about section content</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {selectedIds.length > 0 && (
                <button 
                  onClick={triggerBulkDelete}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium text-sm shadow-sm transition-colors border border-red-200"
                >
                  <Trash2 size={16} />
                  Delete Selected ({selectedIds.length})
                </button>
              )}
              <button 
                onClick={openAddModal}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black rounded-lg hover:bg-primary-hover font-medium text-sm shadow-sm transition-colors"
              >
                <Plus size={16} />
                Add About Entry
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-zinc-200 overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="py-4 px-6 w-12">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20"
                      checked={abouts.length > 0 && selectedIds.length === abouts.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm w-16">#</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Badge</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Heading</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Status</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Updated At</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={6} className="py-12 text-center text-gray-500">Loading...</td></tr>
                ) : abouts.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-gray-500">No about sections found.</td></tr>
                ) : (
                  abouts.map((about, index) => (
                    <tr key={about.id} className={`border-b border-zinc-200 hover:bg-zinc-50 transition-colors ${selectedIds.includes(about.id) ? 'bg-primary/5' : ''}`}>
                      <td className="py-4 px-6">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20"
                          checked={selectedIds.includes(about.id)}
                          onChange={() => handleSelectOne(about.id)}
                        />
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">{index + 1}</td>
                      <td className="py-4 px-6 text-sm text-gray-900 font-bold">{about.badge || '-'}</td>
                      <td className="py-4 px-6 text-sm text-gray-900 font-bold max-w-[200px] truncate">{about.headingLine1}</td>
                      <td className="py-4 px-6">{getStatusBadge(about.status)}</td>
                      <td className="py-4 px-6 text-sm text-gray-500">{formatDate(about.updatedAt)}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openEditModal(about)}
                            className="p-1.5 text-primary hover:bg-primary/10 border border-violet-200 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => triggerDelete(about.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 border border-red-200 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-5 border-b border-zinc-200 flex justify-between items-center bg-white">
              <h2 className="text-xl font-bold text-gray-900">{selectedAbout ? 'Edit About Section' : 'Add New About Section'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Badge Text</label>
                    <input 
                      type="text" 
                      placeholder="e.g. ABOUT US"
                      className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
                      value={formData.badge}
                      onChange={e => setFormData({...formData, badge: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Heading Line 1</label>
                    <input 
                      type="text" 
                      placeholder="e.g. REAL RESULTS"
                      className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
                      value={formData.headingLine1}
                      onChange={e => setFormData({...formData, headingLine1: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Heading Line 2</label>
                    <input 
                      type="text" 
                      placeholder="e.g. START HERE."
                      className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
                      value={formData.headingLine2}
                      onChange={e => setFormData({...formData, headingLine2: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Description</label>
                    <textarea 
                      placeholder="Enter description here..."
                      rows={5}
                      className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm resize-none"
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Status</label>
                    <select 
                      className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="DRAFT">Draft</option>
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Checklist */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-gray-900">Checklist Items</label>
                      <button 
                        onClick={addChecklistItem}
                        className="text-xs font-bold text-[#6320ee] flex items-center gap-1 hover:underline"
                      >
                        <Plus size={14} /> Add Item
                      </button>
                    </div>
                    <div className="space-y-3">
                      {formData.checklist.map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <input 
                            type="text"
                            placeholder="e.g. Personalized Training"
                            className="flex-1 px-4 py-2 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
                            value={item}
                            onChange={(e) => updateChecklistItem(index, e.target.value)}
                          />
                          <button 
                            onClick={() => removeChecklistItem(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      {formData.checklist.length === 0 && (
                        <div className="text-sm text-gray-500 p-4 border border-dashed border-zinc-300 rounded-lg text-center bg-gray-50">
                          No checklist items added.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Images */}
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-2">Images Collage</label>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden border border-zinc-300 aspect-square">
                          <img src={fixImageUrl(img)} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            <label className="cursor-pointer bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded text-xs font-medium backdrop-blur-sm transition-colors mb-1">
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageReplace(e, idx)} disabled={isUploading} />
                              Replace
                            </label>
                            <button onClick={() => removeImage(idx)} className="px-2 py-1 bg-red-500/80 hover:bg-red-600 rounded text-white text-[10px] font-bold tracking-wider flex items-center gap-1 transition-colors">
                              <Trash2 size={12} /> Remove
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {/* Add Image Button */}
                      <div className="border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center relative overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer aspect-square">
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          onChange={handleImageUpload}
                        />
                        {isUploading ? (
                          <span className="text-xs text-gray-500">Uploading...</span>
                        ) : (
                          <>
                            <UploadCloud className="text-gray-400 mb-1" size={20} />
                            <span className="text-[10px] font-bold text-gray-600">Add Image</span>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500">Add multiple images to display a collage. Upload high quality JPEGs or PNGs.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-zinc-200 flex justify-end gap-3 bg-zinc-50">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 border border-zinc-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2.5 bg-primary text-black rounded-lg font-medium text-sm hover:bg-primary-hover transition-colors"
              >
                Save About Section
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-4xl max-h-[90vh] w-full flex justify-center" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setPreviewImage(null)} 
              className="absolute -top-12 right-0 text-white hover:text-gray-300 bg-black/20 hover:bg-black/40 rounded-full p-2 backdrop-blur-md transition-all"
            >
              <X size={24} />
            </button>
            <img src={fixImageUrl(previewImage)} alt="Preview" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
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
