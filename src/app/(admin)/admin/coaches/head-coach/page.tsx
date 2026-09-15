'use client';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { fixImageUrl } from '@/lib/apiConfig';
import { Plus, Edit3, Trash2, X, UploadCloud, Eye } from 'lucide-react';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

interface HeadCoach {
  id: string;
  coachName: string;
  label: string;
  subtitle: string;
  heading: string;
  description: string;
  image: string;
  badgeText: string | null;
  ctaText: string;
  ctaLink: string;
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
  updatedAt: string;
}

export default function HeadCoachPage() {
  const [headCoaches, setHeadCoaches] = useState<HeadCoach[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [viewingCoach, setViewingCoach] = useState<HeadCoach | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | string[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    coachName: '',
    label: '',
    subtitle: '',
    heading: '',
    description: '',
    image: '',
    badgeText: '',
    ctaText: '',
    ctaLink: '',
    status: 'ACTIVE'
  });

  const fetchHeadCoaches = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/head-coach');
      if (response.ok) {
        const data = await response.json();
        const items = data.success ? data.data : data;
        setHeadCoaches(Array.isArray(items) ? items : []);
      }
    } catch (error) {
      console.error("Failed to fetch Head Coaches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHeadCoaches();
  }, []);

  const openAddModal = () => {
    setFormData({
      coachName: '',
      label: '',
      subtitle: '',
      heading: '',
      description: '',
      image: '',
      badgeText: '',
      ctaText: '',
      ctaLink: '',
      status: 'ACTIVE'
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (coach: HeadCoach) => {
    setFormData({
      coachName: coach.coachName || '',
      label: coach.label || '',
      subtitle: coach.subtitle || '',
      heading: coach.heading || '',
      description: coach.description || '',
      image: coach.image || '',
      badgeText: coach.badgeText || '',
      ctaText: coach.ctaText || '',
      ctaLink: coach.ctaLink || '',
      status: coach.status || 'ACTIVE'
    });
    setEditingId(coach.id);
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
        await Promise.all(deleteTarget.map(id => api.delete(`/head-coach/${id}`)));
        setSelectedIds([]);
      } else {
        await api.delete(`/head-coach/${deleteTarget}`);
        setSelectedIds(prev => prev.filter(id => id !== deleteTarget));
      }
      fetchHeadCoaches();
    } catch (error) {
      console.error("Error deleting Head Coach(es):", error);
    } finally {
      setIsConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(headCoaches.map(m => m.id));
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
      const payload = { ...formData };
      let response;
      if (editingId) {
        response = await api.patch(`/head-coach/${editingId}`, payload);
      } else {
        response = await api.post('/head-coach', payload);
      }

      if (response.ok) {
        setIsModalOpen(false);
        fetchHeadCoaches();
      } else {
        const errorData = await response.json();
        alert(`Failed to save: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error saving Head Coach:", error);
      alert("Failed to save Head Coach");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert("File size must be less than 50MB");
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
        if (data.success) {
          setFormData(prev => ({ ...prev, image: data.url }));
        } else {
          alert('Upload failed: ' + data.message);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <span className="px-2 py-1 rounded-full bg-green-50 text-green-600 border border-green-200 text-xs font-bold tracking-wider">ACTIVE</span>;
      case 'INACTIVE': return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 border border-zinc-300 text-xs font-bold tracking-wider">INACTIVE</span>;
      case 'DRAFT': return <span className="px-2 py-1 rounded-full bg-yellow-50 text-yellow-600 border border-yellow-200 text-xs font-bold tracking-wider">DRAFT</span>;
      default: return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 border border-zinc-300 text-xs font-bold tracking-wider">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] min-w-0 w-full overflow-hidden">
      <div className="flex-1 flex flex-col transition-all duration-300">
        <div className="p-8 flex-1 overflow-y-auto">
          <AdminPageHeader 
            title="Head Coach Settings"
            description="Manage all Head Coach configurations"
            action={
              !isLoading && (
                <div className="flex items-center gap-2">
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
                    Add Head Coach
                  </button>
                </div>
              )
            }
          />

          {/* Table Content */}
          <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-zinc-200 overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center h-64 text-gray-500">Loading...</div>
            ) : headCoaches.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-64 text-gray-500">
                <p className="text-lg font-medium">No Head Coaches found.</p>
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
                          checked={headCoaches.length > 0 && selectedIds.length === headCoaches.length}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="px-6 py-4">Image</th>
                      <th className="px-6 py-4">Coach Details</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {headCoaches.map((coach) => (
                      <tr key={coach.id} className={`hover:bg-zinc-50 transition-colors ${selectedIds.includes(coach.id) ? 'bg-primary/5' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20"
                            checked={selectedIds.includes(coach.id)}
                            onChange={() => handleSelectOne(coach.id)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-300 bg-gray-100 cursor-pointer" onClick={() => setPreviewImage(coach.image)}>
                            {coach.image ? (
                              <img src={fixImageUrl(coach.image)} alt={coach.coachName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">N/A</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 text-base">{coach.coachName}</div>
                          <div className="text-gray-500 font-medium text-xs mt-0.5">{coach.label} • {coach.subtitle}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(coach.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => openEditModal(coach)}
                              className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button
                              onClick={() => triggerDelete(coach.id)}
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
        </div>
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-5 border-b border-zinc-200 flex justify-between items-center bg-white">
              <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Head Coach' : 'Add Head Coach'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Coach Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. JOHN DOE"
                      className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
                      value={formData.coachName}
                      onChange={e => setFormData({...formData, coachName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Label</label>
                    <input 
                      type="text" 
                      placeholder="e.g. HEAD COACH"
                      className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
                      value={formData.label}
                      onChange={e => setFormData({...formData, label: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Subtitle (Role)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. EVIDENCE-BASED FITNESS & NUTRITION COACH"
                      className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
                      value={formData.subtitle}
                      onChange={e => setFormData({...formData, subtitle: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Heading</label>
                    <textarea 
                      placeholder="e.g. TRAIN SMARTER. FUEL BETTER. PERFORM FOR LIFE."
                      rows={3}
                      className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm resize-none"
                      value={formData.heading}
                      onChange={e => setFormData({...formData, heading: e.target.value})}
                    ></textarea>
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
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Bottom Badge Text (Credentials)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. HYROX Athlete • National Men's Physique Athlete"
                      className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
                      value={formData.badgeText}
                      onChange={e => setFormData({...formData, badgeText: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-900 mb-1.5">CTA Text</label>
                      <input 
                        type="text" 
                        placeholder="e.g. BOOK YOUR ASSESSMENT"
                        className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
                        value={formData.ctaText}
                        onChange={e => setFormData({...formData, ctaText: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-900 mb-1.5">CTA Link</label>
                      <input 
                        type="text" 
                        placeholder="e.g. /assessment or https://wa.me/..."
                        className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
                        value={formData.ctaLink}
                        onChange={e => setFormData({...formData, ctaLink: e.target.value})}
                      />
                    </div>
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

                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-2">Head Coach Image</label>
                    <div className="w-full h-48 rounded-lg border-2 border-dashed border-gray-300 relative overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center cursor-pointer">
                      {formData.image ? (
                        <>
                          <img src={fixImageUrl(formData.image)} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <UploadCloud className="text-white mb-2" size={24} />
                            <span className="text-white text-xs font-bold">Change Image</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="text-gray-400 mb-2" size={32} />
                          <span className="text-sm font-bold text-gray-600">Click to Upload Image</span>
                          <span className="text-xs text-gray-500 mt-1">PNG/JPG under 50MB</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={handleImageUpload}
                      />
                    </div>
                    {isUploading && <p className="text-xs text-[#6320ee] mt-2 text-center animate-pulse font-medium">Uploading image...</p>}
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
                disabled={isUploading}
                className="px-6 py-2.5 bg-primary text-black rounded-lg font-medium text-sm hover:bg-primary-hover transition-colors disabled:opacity-50"
              >
                {editingId ? 'Save Changes' : 'Create Head Coach'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewingCoach && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setViewingCoach(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-5 border-b border-zinc-200 flex justify-between items-center bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">Head Coach Details</h2>
              <button onClick={() => setViewingCoach(null)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 bg-[#f8f9fa]">
              <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-zinc-200 p-8">
                <div className="flex flex-col lg:flex-row gap-10">
                  <div className="flex-1 space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{viewingCoach.coachName}</h2>
                        <p className="text-gray-500 font-bold tracking-widest text-sm mt-1">{viewingCoach.label}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(viewingCoach.status)}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-zinc-200">
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Subtitle / Role</label>
                        <p className="font-semibold text-gray-800 mt-1">{viewingCoach.subtitle}</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Heading</label>
                        <p className="font-black text-xl text-gray-900 uppercase mt-1 whitespace-pre-line">{viewingCoach.heading}</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</label>
                        <p className="text-gray-600 leading-relaxed mt-1 whitespace-pre-line">{viewingCoach.description}</p>
                      </div>
                      {viewingCoach.badgeText && (
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bottom Credentials Badge</label>
                          <p className="font-semibold text-gray-800 mt-1">{viewingCoach.badgeText}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">CTA Text</label>
                          <p className="font-bold text-[#6320ee] mt-1">{viewingCoach.ctaText}</p>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">CTA Link</label>
                          <p className="text-blue-600 truncate mt-1">{viewingCoach.ctaLink}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-1/3 flex flex-col items-center">
                    <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 border border-zinc-300 relative group mb-4">
                      {viewingCoach.image ? (
                        <>
                          <img src={fixImageUrl(viewingCoach.image)} alt={viewingCoach.coachName} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onClick={() => setPreviewImage(viewingCoach.image)} className="p-3 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm">
                              <Eye size={24} />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-2xl max-h-[90vh] w-full flex justify-center" onClick={e => e.stopPropagation()}>
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
