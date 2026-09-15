'use client';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { fixImageUrl } from '@/lib/apiConfig';
import * as LucideIcons from 'lucide-react';
import { Plus, Eye, ImageIcon, X, Edit3, Trash2, UploadCloud } from 'lucide-react';
import { IconSelect } from '@/components/ui/IconSelect';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';

interface Program {
  id: string;
  title: string;
  shortDescription: string;
  image: string;
  icon: string;
  isFeatured: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  displayOrder: number;
  featuredItem1Title?: string | null;
  featuredItem1Icon?: string | null;
  featuredItem2Title?: string | null;
  featuredItem2Icon?: string | null;
  featuredItem3Title?: string | null;
  featuredItem3Icon?: string | null;
  featuredItem4Title?: string | null;
  featuredItem4Icon?: string | null;
  updatedAt: string;
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    image: '',
    icon: '',
    isFeatured: false,
    status: 'ACTIVE',
    displayOrder: 1,
    featuredItem1Title: '',
    featuredItem1Icon: '',
    featuredItem2Title: '',
    featuredItem2Icon: '',
    featuredItem3Title: '',
    featuredItem3Icon: '',
    featuredItem4Title: '',
    featuredItem4Icon: ''
  });

  const fetchPrograms = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/programs');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPrograms(data.data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch programs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const openAddModal = () => {
    setSelectedProgram(null);
    setFormData({
      title: '',
      shortDescription: '',
      image: '',
      icon: '',
      isFeatured: false,
      status: 'ACTIVE',
      displayOrder: programs.length + 1,
      featuredItem1Title: '',
      featuredItem1Icon: '',
      featuredItem2Title: '',
      featuredItem2Icon: '',
      featuredItem3Title: '',
      featuredItem3Icon: '',
      featuredItem4Title: '',
      featuredItem4Icon: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (program: Program) => {
    setSelectedProgram(program);
    setFormData({
      title: program.title || '',
      shortDescription: program.shortDescription || '',
      image: program.image || '',
      icon: program.icon || '',
      isFeatured: program.isFeatured || false,
      status: program.status || 'ACTIVE',
      displayOrder: program.displayOrder || 1,
      featuredItem1Title: program.featuredItem1Title || '',
      featuredItem1Icon: program.featuredItem1Icon || '',
      featuredItem2Title: program.featuredItem2Title || '',
      featuredItem2Icon: program.featuredItem2Icon || '',
      featuredItem3Title: program.featuredItem3Title || '',
      featuredItem3Icon: program.featuredItem3Icon || '',
      featuredItem4Title: program.featuredItem4Title || '',
      featuredItem4Icon: program.featuredItem4Icon || ''
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
        await Promise.all(deleteTarget.map(id => api.delete(`/programs/${id}`)));
        setPrograms(programs.filter(p => !deleteTarget.includes(p.id)));
        setSelectedIds([]);
      } else {
        const response = await api.delete(`/programs/${deleteTarget}`);
        if (response.ok) {
          setPrograms(programs.filter(p => p.id !== deleteTarget));
          setSelectedIds(selectedIds.filter(id => id !== deleteTarget));
        }
      }
    } catch (error) {
      console.error("Error deleting program:", error);
    } finally {
      setIsConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(programs.map(p => p.id));
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
    setDeleteTarget(selectedIds as any);
    setIsConfirmOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        displayOrder: parseInt(formData.displayOrder as any, 10) || 1
      };
      
      let response;
      if (selectedProgram) {
        response = await api.patch(`/programs/${selectedProgram.id}`, payload);
      } else {
        response = await api.post('/programs', payload);
      }

      if (response.ok) {
        setIsModalOpen(false);
        fetchPrograms();
      } else {
        const errorData = await response.json();
        alert(`Failed to save: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error saving program:", error);
      alert("Failed to save program");
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
        const uploadedUrl = data.url || data.data?.url;
        if (data.success && uploadedUrl) {
          setFormData(prev => ({ ...prev, image: uploadedUrl }));
        } else {
          alert('Upload failed: ' + (data.message || 'Unknown error'));
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
    return status === 'ACTIVE' 
      ? <span className="px-2 py-1 rounded bg-green-50 text-green-600 border border-green-200 text-[10px] font-bold tracking-wider">ACTIVE</span>
      : <span className="px-2 py-1 rounded bg-gray-100 text-gray-600 border border-zinc-300 text-[10px] font-bold tracking-wider">{status}</span>;
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] min-w-0 w-full overflow-hidden">
      <div className="flex-1 flex flex-col transition-all duration-300">
        <div className="p-8 flex-1 overflow-y-auto scrollbar-hide">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Programs</h1>
              <p className="text-gray-500 text-sm mt-1">Manage public program cards (Featured & Regular)</p>
            </div>
            <div className="flex gap-2">
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
                Add Program
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
                      checked={programs.length > 0 && selectedIds.length === programs.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm w-16">#</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Program</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Featured</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Status</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Order</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={6} className="py-12 text-center text-gray-500">Loading...</td></tr>
                ) : programs.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-gray-500">No programs found.</td></tr>
                ) : (
                  programs.sort((a, b) => a.displayOrder - b.displayOrder).map((program, index) => (
                    <tr key={program.id} className={`border-b border-zinc-200 hover:bg-zinc-50 transition-colors ${selectedIds.includes(program.id) ? 'bg-primary/5' : ''}`}>
                      <td className="py-4 px-6">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20"
                          checked={selectedIds.includes(program.id)}
                          onChange={() => handleSelectOne(program.id)}
                        />
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">{index + 1}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          {program.image ? (
                            <button onClick={() => setPreviewImage(program.image)} className="block hover:opacity-80 transition-opacity relative group">
                              <img src={fixImageUrl(program.image)} alt={program.title} className="w-12 h-12 object-cover rounded-md bg-gray-100 shadow-sm" />
                            </button>
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                              <ImageIcon size={16} />
                            </div>
                          )}
                          <div>
                            <div className="text-sm text-gray-900 font-bold">{program.title}</div>
                            <div className="text-[11px] text-gray-500 mt-0.5 truncate max-w-[200px]">{program.shortDescription}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {program.isFeatured ? (
                          <span className="px-2 py-1 rounded bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-bold tracking-wider">FEATURED</span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="py-4 px-6">{getStatusBadge(program.status)}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">{program.displayOrder}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openEditModal(program)}
                            className="p-1.5 text-primary hover:bg-primary/10 border border-violet-200 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => triggerDelete(program.id)}
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
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-5 border-b border-zinc-200 flex justify-between items-center bg-white">
              <h2 className="text-xl font-bold text-gray-900">{selectedProgram ? 'Edit Program' : 'Add New Program'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 flex-1 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Core & Abs"
                      className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Short Description</label>
                    <textarea 
                      placeholder="Enter description here..."
                      rows={3}
                      className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm resize-none"
                      value={formData.shortDescription}
                      onChange={e => setFormData({...formData, shortDescription: e.target.value})}
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Icon *</label>
                    <IconSelect 
                      value={formData.icon} 
                      onChange={(val) => setFormData({...formData, icon: val})} 
                    />
                  </div>
                  
                  <div className="flex items-center mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100">
                    <input 
                      type="checkbox" 
                      id="featured"
                      className="w-4 h-4 rounded border-gray-300 text-[#6320ee] focus:ring-[#6320ee] cursor-pointer mr-3"
                      checked={formData.isFeatured}
                      onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
                    />
                    <div>
                      <label htmlFor="featured" className="text-sm font-bold text-gray-900 cursor-pointer">Mark as Featured</label>
                      <p className="text-[10px] text-gray-500 mt-0.5">Will display as the large main card on the UI.</p>
                    </div>
                  </div>

                  {formData.isFeatured && (
                    <div className="mt-6 space-y-4 border-t border-zinc-200 pt-5">
                      <h3 className="text-sm font-bold text-gray-900">Featured Items (Optional)</h3>
                      
                      {[1, 2, 3, 4].map((num) => (
                        <div key={num} className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg border border-zinc-200">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-700 mb-1">Item {num} Title</label>
                            <input 
                              type="text" 
                              placeholder={`Title ${num}`}
                              className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-xs"
                              value={(formData as any)[`featuredItem${num}Title`]}
                              onChange={e => setFormData({...formData, [`featuredItem${num}Title`]: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-700 mb-1">Item {num} Icon</label>
                            <IconSelect 
                              value={(formData as any)[`featuredItem${num}Icon`]} 
                              onChange={(val) => setFormData({...formData, [`featuredItem${num}Icon`]: val})} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Card Image (Required)</label>
                    <div className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors group h-40">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={handleImageUpload}
                      />
                      {isUploading ? (
                        <div className="text-sm text-gray-500 font-medium">Uploading...</div>
                      ) : formData.image ? (
                        <div className="absolute inset-0 z-0">
                          <img src={fixImageUrl(formData.image)} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="bg-white/90 px-3 py-1 rounded text-xs font-bold shadow-sm">Change Image</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <UploadCloud className="text-gray-400 mb-2" size={24} />
                          <div className="text-xs text-gray-600 font-medium">Click to upload</div>
                          <div className="text-[10px] text-gray-400 mt-1">PNG, JPG (Max 50MB)</div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-900 mb-1.5">Status</label>
                      <select 
                        className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value})}
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-900 mb-1.5">Display Order</label>
                      <input 
                        type="number" 
                        min="1"
                        className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
                        value={formData.displayOrder || ''}
                        onChange={e => {
                          const val = parseInt(e.target.value, 10);
                          setFormData({...formData, displayOrder: isNaN(val) ? ('' as any) : val});
                        }}
                      />
                    </div>
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
                Save Program
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm" onClick={() => setPreviewImage(null)}>
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
