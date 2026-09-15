'use client';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Plus, Edit3, Trash2, X, UploadCloud, ImageIcon, Eye } from 'lucide-react';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import { fixImageUrl } from '@/lib/apiConfig';

interface Hero {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  backgroundImage: string;
  foregroundImage: string;
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
  displayOrder: number;
  updatedAt: string;
}

export default function HeroPage() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Bulk Selection & Deletion State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | string[] | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    badge: '',
    title: '',
    subtitle: '',
    description: '',
    primaryButtonText: '',
    primaryButtonLink: '',
    secondaryButtonText: '',
    secondaryButtonLink: '',
    backgroundImage: '',
    foregroundImage: '',
    status: 'ACTIVE',
    displayOrder: 1
  });

  const fetchHeroes = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/heroes');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setHeroes(data.data);
        } else if (Array.isArray(data)) {
          setHeroes(data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch heroes:", error);
    } finally {
      setIsLoading(false);
      setSelectedIds([]);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  const openAddModal = () => {
    setSelectedHero(null);
    setFormData({
      badge: '',
      title: '',
      subtitle: '',
      description: '',
      primaryButtonText: '',
      primaryButtonLink: '',
      secondaryButtonText: '',
      secondaryButtonLink: '',
      backgroundImage: '',
      foregroundImage: '',
      status: 'ACTIVE',
      displayOrder: heroes.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (hero: Hero) => {
    setSelectedHero(hero);
    setFormData({
      badge: hero.badge || '',
      title: hero.title || '',
      subtitle: hero.subtitle || '',
      description: hero.description || '',
      primaryButtonText: hero.primaryButtonText || '',
      primaryButtonLink: hero.primaryButtonLink || '',
      secondaryButtonText: hero.secondaryButtonText || '',
      secondaryButtonLink: hero.secondaryButtonLink || '',
      backgroundImage: hero.backgroundImage || '',
      foregroundImage: hero.foregroundImage || '',
      status: hero.status || 'ACTIVE',
      displayOrder: hero.displayOrder || 1
    });
    setIsModalOpen(true);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === heroes.length && heroes.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(heroes.map(h => h.id));
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
        const response = await api.post('/heroes/bulk-delete', { ids: deleteTarget });
        if (response.ok) {
          setHeroes(heroes.filter(h => !deleteTarget.includes(h.id)));
          setSelectedIds([]);
        }
      } else {
        const response = await api.delete(`/heroes/${deleteTarget}`);
        if (response.ok) {
          setHeroes(heroes.filter(h => h.id !== deleteTarget));
        }
      }
    } catch (error) {
      console.error("Error deleting hero:", error);
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        displayOrder: parseInt(formData.displayOrder as any, 10) || 1
      };
      
      let response;
      if (selectedHero) {
        response = await api.patch(`/heroes/${selectedHero.id}`, payload);
      } else {
        response = await api.post('/heroes', payload);
      }

      if (response.ok) {
        setIsModalOpen(false);
        fetchHeroes();
      } else {
        const errorData = await response.json();
        alert(`Failed to save: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error saving hero:", error);
      alert("Failed to save hero section");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'backgroundImage' | 'foregroundImage') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert("File size must be less than 50MB");
        return;
      }
      
      const formData = new FormData();
      formData.append('image', file);
      
      setIsUploading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/upload`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        
        const data = await response.json();
        const uploadedUrl = data.url || data.data?.url;
        if (data.success && uploadedUrl) {
          setFormData(prev => ({ ...prev, [field]: uploadedUrl }));
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
    <div className="flex flex-col h-full gap-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hero Section</h1>
            <p className="text-gray-500 text-sm mt-1">Manage website hero sections</p>
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
              className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary-hover font-medium text-sm shadow-sm transition-colors"
            >
              <Plus size={16} />
              Add Hero
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 flex flex-col min-h-0 flex-1">
          <div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10 shadow-sm">
                <tr className="border-b border-zinc-200 bg-gray-50">
                  <th className="py-4 pl-6 pr-2 w-10">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-[#6320ee] focus:ring-[#6320ee] cursor-pointer"
                      checked={heroes.length > 0 && selectedIds.length === heroes.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm w-16">#</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Title</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Subtitle</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Status</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Order</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Updated At</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={7} className="py-12 text-center text-gray-500">Loading...</td></tr>
                ) : heroes.length === 0 ? (
                  <tr><td colSpan={7} className="py-12 text-center text-gray-500">No hero sections found.</td></tr>
                ) : (
                  heroes.sort((a, b) => a.displayOrder - b.displayOrder).map((hero, index) => (
                    <tr key={hero.id} className={`border-b border-zinc-200 hover:bg-zinc-50 transition-colors ${selectedIds.includes(hero.id) ? 'bg-primary text-black/5' : ''}`}>
                      <td className="py-4 pl-6 pr-2">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-gray-300 text-[#6320ee] focus:ring-[#6320ee] cursor-pointer"
                          checked={selectedIds.includes(hero.id)}
                          onChange={() => toggleSelectOne(hero.id)}
                        />
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">{index + 1}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          {hero.backgroundImage ? (
                            <div className="block relative">
                              <img src={fixImageUrl(hero.backgroundImage)} alt={hero.title} className="w-16 h-12 object-cover rounded-md bg-gray-100 shadow-sm" />
                            </div>
                          ) : (
                            <div className="w-16 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                              <ImageIcon size={20} />
                            </div>
                          )}
                          <div>
                            <div className="text-sm text-gray-900 font-bold max-w-[200px] truncate">{hero.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500 max-w-[250px] truncate">{hero.subtitle || '-'}</td>
                      <td className="py-4 px-6">{getStatusBadge(hero.status)}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">{hero.displayOrder}</td>
                      <td className="py-4 px-6 text-sm text-gray-500">{formatDate(hero.updatedAt)}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openEditModal(hero)}
                            className="p-1.5 text-primary hover:bg-primary/10 border border-violet-200 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => triggerSingleDelete(hero.id)}
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
            
            {!isLoading && heroes.length > 0 && (
              <div className="px-6 py-4 border-t border-zinc-200">
                <div className="text-sm text-gray-500">
                  Showing 1 to {heroes.length} of {heroes.length} results
                </div>
              </div>
            )}
          </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-5 border-b border-zinc-200 flex justify-between items-center bg-white">
              <h2 className="text-xl font-bold text-gray-900">{selectedHero ? 'Edit Hero' : 'Add New Hero'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Badge / Small Text</label>
                    <input 
                      type="text" 
                      placeholder="e.g. ELITE PERFORMANCE COACHING"
                      className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
                      value={formData.badge}
                      onChange={e => setFormData({...formData, badge: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. TRANSFORM YOUR BODY."
                      className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Subtitle</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Science-Based Training. Real Results."
                      className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
                      value={formData.subtitle}
                      onChange={e => setFormData({...formData, subtitle: e.target.value})}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-900 mb-1.5">Primary Button Text</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Start Your Journey"
                        className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
                        value={formData.primaryButtonText}
                        onChange={e => setFormData({...formData, primaryButtonText: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-900 mb-1.5">Primary Button Link</label>
                      <input 
                        type="text" 
                        placeholder="e.g. /assessment"
                        className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
                        value={formData.primaryButtonLink}
                        onChange={e => setFormData({...formData, primaryButtonLink: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1">
                      <label className="block text-xs font-bold text-gray-900 mb-1.5">Secondary Button Text</label>
                      <input 
                        type="text" 
                        placeholder="e.g. View Programs"
                        className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
                        value={formData.secondaryButtonText}
                        onChange={e => setFormData({...formData, secondaryButtonText: e.target.value})}
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-xs font-bold text-gray-900 mb-1.5">Secondary Button Link</label>
                      <input 
                        type="text" 
                        placeholder="e.g. /programs"
                        className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
                        value={formData.secondaryButtonLink}
                        onChange={e => setFormData({...formData, secondaryButtonLink: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Background Image (Required)</label>
                    <div className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors group h-36">
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg, image/webp" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={(e) => handleImageUpload(e, 'backgroundImage')}
                      />
                      {isUploading ? (
                        <div className="flex flex-col items-center justify-center z-0">
                          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-2" />
                          <span className="text-xs font-semibold text-amber-600">Uploading to Cloudinary...</span>
                        </div>
                      ) : formData.backgroundImage ? (
                        <div className="absolute inset-0 z-0">
                          <img src={fixImageUrl(formData.backgroundImage)} alt="Background Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                            <span className="bg-white/90 text-gray-900 px-3 py-1.5 rounded-md text-xs font-bold shadow-md">Click to Change Image</span>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                Save Hero
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
