'use client';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { fixImageUrl } from '@/lib/apiConfig';
import { Plus, Edit3, Trash2, X, UploadCloud, Eye, Image as ImageIcon } from 'lucide-react';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';

interface TransformationSection {
  id: string;
  badge: string;
  title: string;
  description: string;
  backgroundImage: string | null;
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
  updatedAt: string;
}

export default function TransformationSectionPage() {
  const [sections, setSections] = useState<TransformationSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | string[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const defaultForm = {
    badge: '',
    title: '',
    description: '',
    backgroundImage: '',
    status: 'ACTIVE'
  };

  const [formData, setFormData] = useState(defaultForm);

  const fetchSections = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/transformation-section');
      if (response.ok) {
        const data = await response.json();
        const items = data.success ? data.data : data;
        setSections(Array.isArray(items) ? items : []);
      }
    } catch (error) {
      console.error("Failed to fetch Transformation Sections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const openAddModal = () => {
    setFormData(defaultForm);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (section: TransformationSection) => {
    setFormData({
      badge: section.badge,
      title: section.title,
      description: section.description,
      backgroundImage: section.backgroundImage || '',
      status: section.status
    });
    setEditingId(section.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/upload`, {
        method: 'POST',
        body: uploadData,
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        setFormData({ ...formData, backgroundImage: result.url });
      } else {
        console.error("Upload failed");
        alert("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, backgroundImage: '' });
  };

  const handleSave = async () => {
    if (!formData.badge || !formData.title || !formData.description) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const payload = { ...formData };
      
      const response = editingId 
        ? await api.patch(`/transformation-section/${editingId}`, payload)
        : await api.post('/transformation-section', payload);

      if (response.ok) {
        closeModal();
        fetchSections();
      } else {
        const err = await response.json();
        alert(err.message || "Failed to save section");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("An error occurred while saving.");
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteTarget(id);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    
    try {
      if (Array.isArray(deleteTarget)) {
        await Promise.all(deleteTarget.map(id => api.delete(`/transformation-section/${id}`)));
        fetchSections();
        setSelectedIds([]);
      } else {
        const response = await api.delete(`/transformation-section/${deleteTarget}`);
        if (response.ok) {
          fetchSections();
          setSelectedIds(prev => prev.filter(id => id !== deleteTarget));
        } else {
          alert("Failed to delete section");
        }
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(sections.map(s => s.id));
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Transformation Section</h1>
          <p className="text-sm text-slate-500 mt-1">Manage the header section of the transformations area.</p>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <button 
              onClick={triggerBulkDelete}
              className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm border border-red-200"
            >
              <Trash2 size={18} />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          )}
          <button 
            onClick={openAddModal}
            className="bg-primary hover:bg-primary-hover text-black px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>Add New Section</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-zinc-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : sections.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 text-gray-500">
            <p className="text-lg font-medium">No Sections found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[800px] text-left text-sm text-gray-500">
              <thead className="bg-zinc-50 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-zinc-200">
                <tr>
                  <th className="px-6 py-4 w-12">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20"
                      checked={sections.length > 0 && selectedIds.length === sections.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Section Details</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {sections.map((section) => (
                  <tr key={section.id} className={`hover:bg-zinc-50 transition-colors ${selectedIds.includes(section.id) ? 'bg-primary/5' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20 cursor-pointer"
                        checked={selectedIds.includes(section.id)}
                        onChange={() => handleSelectOne(section.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-16 h-12 rounded-md overflow-hidden border border-zinc-300 bg-gray-100">
                        {section.backgroundImage ? (
                          <img src={fixImageUrl(section.backgroundImage)} alt="Background Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">N/A</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-0.5 block">{section.badge}</div>
                      <div className="font-bold text-gray-900 text-base">{section.title}</div>
                      <div className="text-gray-500 font-medium text-xs mt-0.5 line-clamp-1">{section.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {section.status === 'ACTIVE' && <span className="px-2 py-1 rounded-full bg-green-50 text-green-600 border border-green-200 text-xs font-bold tracking-wider">ACTIVE</span>}
                      {section.status === 'INACTIVE' && <span className="px-2 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-bold tracking-wider">INACTIVE</span>}
                      {section.status === 'DRAFT' && <span className="px-2 py-1 rounded-full bg-yellow-50 text-yellow-600 border border-yellow-200 text-xs font-bold tracking-wider">DRAFT</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => openEditModal(section)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => confirmDelete(section.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {editingId ? 'Edit Transformation Section' : 'Add Transformation Section'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column - Text Details */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1.5">Badge <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={formData.badge} 
                      onChange={e => setFormData({...formData, badge: e.target.value})} 
                      className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" 
                      placeholder="e.g. TRANSFORMATIONS" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1.5">Title <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={formData.title} 
                      onChange={e => setFormData({...formData, title: e.target.value})} 
                      className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" 
                      placeholder="e.g. REAL PEOPLE. REAL PROGRESS." 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1.5">Description <span className="text-red-500">*</span></label>
                    <textarea 
                      value={formData.description} 
                      onChange={e => setFormData({...formData, description: e.target.value})} 
                      className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm min-h-[120px] resize-y" 
                      placeholder="Enter description..." 
                    />
                  </div>
                </div>

                {/* Right Column - Media & Status */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1.5">Background Image</label>
                    {formData.backgroundImage ? (
                      <div className="relative rounded-xl overflow-hidden border border-zinc-200 group bg-slate-50">
                        <img src={fixImageUrl(formData.backgroundImage)} alt="Preview" className="w-full h-40 object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <label className="cursor-pointer bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm transition-colors border border-white/30">
                            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={isUploading} />
                            Replace
                          </label>
                          <button onClick={handleRemoveImage} className="bg-red-500/90 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm transition-colors shadow-sm">
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-zinc-300 rounded-xl cursor-pointer bg-zinc-50 hover:bg-zinc-100 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        <UploadCloud className="w-8 h-8 text-zinc-400 mb-2" />
                        <span className="text-sm font-medium text-zinc-600">{isUploading ? 'Uploading...' : 'Click to upload image'}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={isUploading} />
                      </label>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1.5">Status</label>
                    <div className="relative">
                      <select 
                        value={formData.status} 
                        onChange={e => setFormData({...formData, status: e.target.value as any})} 
                        className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm appearance-none font-medium"
                      >
                        <option value="ACTIVE">Active (Visible)</option>
                        <option value="INACTIVE">Inactive (Hidden)</option>
                        <option value="DRAFT">Draft</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 md:p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
              <button 
                onClick={closeModal}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-5 py-2.5 text-sm font-medium text-black bg-primary hover:bg-primary-hover rounded-lg transition-colors shadow-sm flex items-center gap-2"
              >
                {editingId ? 'Update Section' : 'Create Section'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)} 
        onConfirm={handleDelete} 
        title="Delete Transformation Section" 
        message="Are you sure you want to delete this section? This action cannot be undone."
        itemCount={Array.isArray(deleteTarget) ? deleteTarget.length : 1}
      />
    </div>
  );
}
