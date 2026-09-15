'use client';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { fixImageUrl } from '@/lib/apiConfig';
import { Plus, Edit3, Trash2, X, UploadCloud, Eye } from 'lucide-react';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import * as LucideIcons from 'lucide-react';
import { IconSelect } from '@/components/ui/IconSelect';

interface Service {
  id: string;
  title: string;
  slug: string;
  badge: string;
  shortDescription: string;
  description: string;
  cardImage: string;
  heroImage: string;
  duration: string;
  sessions: string;
  level: string;
  equipment: string;
  features: { title: string; description: string; icon: string }[];
  methodologyDescription: string | null;
  items: { title: string; icon: string }[];

  ctaPrimaryText: string | null;
  ctaPrimaryLink: string | null;
  ctaSecondaryText: string | null;
  ctaSecondaryLink: string | null;

  ctaBadge: string | null;
  ctaTitle: string | null;
  ctaDescription: string | null;
  ctaButtonText: string | null;
  ctaButtonLink: string | null;
  ctaImage: string | null;

  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
  displayOrder: number;
  updatedAt: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isHeroUploading, setIsHeroUploading] = useState(false);
  const [isCtaUploading, setIsCtaUploading] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | string[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const defaultForm = {
    title: '', slug: '', badge: '', shortDescription: '', description: '',
    cardImage: '', heroImage: '',
    duration: '', sessions: '', level: '', equipment: '',
    features: [],
    methodologyDescription: '',
    items: [],
    ctaPrimaryText: '', ctaPrimaryLink: '',
    ctaSecondaryText: '', ctaSecondaryLink: '',
    ctaBadge: '', ctaTitle: '', ctaDescription: '', ctaButtonText: '', ctaButtonLink: '', ctaImage: '',
    status: 'ACTIVE', displayOrder: 0
  };

  const [formData, setFormData] = useState<any>(defaultForm);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/services');
      if (response.ok) {
        const data = await response.json();
        const items = data.success ? data.data : data;
        setServices(Array.isArray(items) ? items : []);
      }
    } catch (error) {
      console.error("Failed to fetch Services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setFormData({ ...defaultForm, displayOrder: services.length + 1 });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    const editData: any = {};
    Object.keys(defaultForm).forEach(key => {
      editData[key] = (service as any)[key] === null ? '' : (service as any)[key];
    });
    // Ensure arrays are initialized if missing from old data
    editData.features = Array.isArray(service.features) ? service.features : [];
    editData.items = Array.isArray(service.items) ? service.items : [];
    setFormData(editData);
    setEditingId(service.id);
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
        await Promise.all(deleteTarget.map(id => api.delete(`/services/${id}`)));
        setSelectedIds([]);
        fetchServices();
      } else {
        const response = await api.delete(`/services/${deleteTarget}`);
        if (response.ok) {
          fetchServices();
          setSelectedIds(prev => prev.filter(id => id !== deleteTarget));
        }
      }
    } catch (error) {
      console.error("Error deleting Service:", error);
    } finally {
      setIsConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(services.map(s => s.id));
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
        displayOrder: Number(formData.displayOrder)
      };

      let response;
      if (editingId) {
        response = await api.patch(`/services/${editingId}`, payload);
      } else {
        response = await api.post('/services', payload);
      }

      if (response.ok) {
        setIsModalOpen(false);
        fetchServices();
      } else {
        const errorData = await response.json();
        alert(`Failed to save: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error saving Service:", error);
      alert("Failed to save Service");
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, setUploadingState: (v: boolean) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert("File size must be less than 50MB");
        return;
      }
      const uploadData = new FormData();
      uploadData.append('image', file);
      
      setUploadingState(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/upload`, {
          method: 'POST',
          body: uploadData,
        credentials: 'include',
      });
        const data = await response.json();
        const uploadedUrl = data.url || data.data?.url;
        if (data.success && uploadedUrl) {
          setFormData((prev: any) => ({ ...prev, [fieldName]: uploadedUrl }));
        } else {
          alert('Upload failed: ' + (data.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image');
      } finally {
        setUploadingState(false);
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
        <div className="p-4 md:p-8 flex-1 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Services / Training</h1>
              <p className="text-gray-500 text-sm mt-1">Manage all public training services</p>
            </div>
            {!isLoading && (
              <div className="flex items-center gap-2">
                {selectedIds.length > 0 && (
                  <button 
                    onClick={triggerBulkDelete}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium text-sm shadow-sm transition-colors border border-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Selected ({selectedIds.length})
                  </button>
                )}
                <button 
                  onClick={openAddModal}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black rounded-lg hover:bg-primary-hover font-medium text-sm shadow-sm transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Service
                </button>
              </div>
            )}
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6320ee]"></div>
            </div>
          ) : services.length === 0 ? (
            <div className="bg-white rounded-xl border border-zinc-300 p-12 text-center shadow-sm">
              <div className="bg-[#f8f9ff] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UploadCloud className="h-8 w-8 text-[#6320ee]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No Services Yet</h3>
              <p className="text-gray-500 text-sm">Add your first service to show on the public page.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-zinc-300 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-zinc-200">
                      <th className="py-4 px-6 w-12">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20"
                          checked={services.length > 0 && selectedIds.length === services.length}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Service Name</th>
                      <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Badge</th>
                      <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                      <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Display Order</th>
                      <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {services.map((service) => (
                      <tr key={service.id} className={`hover:bg-zinc-50 transition-colors ${selectedIds.includes(service.id) ? 'bg-primary/5' : ''}`}>
                        <td className="py-4 px-6">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20"
                            checked={selectedIds.includes(service.id)}
                            onChange={() => handleSelectOne(service.id)}
                          />
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <img src={fixImageUrl(service.cardImage) || 'https://via.placeholder.com/150'} alt={service.title} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{service.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{service.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">{service.badge}</td>
                        <td className="py-4 px-6 text-center">{getStatusBadge(service.status)}</td>
                        <td className="py-4 px-6 text-center text-sm font-medium text-gray-600">{service.displayOrder}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEditModal(service)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => triggerDelete(service.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Service' : 'Add New Service'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:bg-gray-100 p-2 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="space-y-8">
                
                {/* BASIC INFO */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#0f172a] border-b pb-2">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                      <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6320ee] text-sm" placeholder="e.g. Personal Training" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                      <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6320ee] text-sm" placeholder="e.g. personal-training" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Badge *</label>
                      <input type="text" value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6320ee] text-sm" placeholder="e.g. Premium Program" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Description (Card) *</label>
                    <textarea value={formData.shortDescription} onChange={e => setFormData({...formData, shortDescription: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6320ee] text-sm h-24" placeholder="Brief summary for the service card..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Description (Detail Page) *</label>
                    <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6320ee] text-sm h-32" placeholder="Detailed description for the main service page..." />
                  </div>
                </div>

                {/* IMAGES */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#0f172a] border-b pb-2">Images</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Card Image *</label>
                      {formData.cardImage ? (
                        <div className="relative rounded-lg overflow-hidden border border-zinc-300 group">
                          <img src={fixImageUrl(formData.cardImage)} alt="Card Preview" className="w-full h-48 object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <label className="cursor-pointer bg-white text-gray-900 px-3 py-1.5 rounded text-sm font-medium shadow-sm hover:bg-gray-100 transition-colors">
                              Replace
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'cardImage', setIsUploading)} disabled={isUploading} />
                            </label>
                            <button type="button" onClick={() => setFormData({...formData, cardImage: ''})} className="bg-red-500 text-white px-3 py-1.5 rounded text-sm font-medium shadow-sm hover:bg-red-600 transition-colors">
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                          <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm font-medium text-gray-600">{isUploading ? 'Uploading...' : 'Upload Card Image'}</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'cardImage', setIsUploading)} disabled={isUploading} />
                        </label>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image *</label>
                      {formData.heroImage ? (
                        <div className="relative rounded-lg overflow-hidden border border-zinc-300 group">
                          <img src={fixImageUrl(formData.heroImage)} alt="Hero Preview" className="w-full h-48 object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <label className="cursor-pointer bg-white text-gray-900 px-3 py-1.5 rounded text-sm font-medium shadow-sm hover:bg-gray-100 transition-colors">
                              Replace
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'heroImage', setIsHeroUploading)} disabled={isHeroUploading} />
                            </label>
                            <button type="button" onClick={() => setFormData({...formData, heroImage: ''})} className="bg-red-500 text-white px-3 py-1.5 rounded text-sm font-medium shadow-sm hover:bg-red-600 transition-colors">
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${isHeroUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                          <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm font-medium text-gray-600">{isHeroUploading ? 'Uploading...' : 'Upload Hero Image'}</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'heroImage', setIsHeroUploading)} disabled={isHeroUploading} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* PROGRAM DETAILS */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#0f172a] border-b pb-2">Program Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                      <input type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6320ee] text-sm" placeholder="e.g. 8 - 12 Weeks" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sessions *</label>
                      <input type="text" value={formData.sessions} onChange={e => setFormData({...formData, sessions: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6320ee] text-sm" placeholder="e.g. 3 - 5 Per Week" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
                      <input type="text" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6320ee] text-sm" placeholder="e.g. All Levels" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Equipment *</label>
                      <input type="text" value={formData.equipment} onChange={e => setFormData({...formData, equipment: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6320ee] text-sm" placeholder="e.g. Gym Equipment" />
                    </div>
                  </div>
                </div>

                {/* WHAT'S INCLUDED */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-lg font-semibold text-[#0f172a]">What's Included (Features)</h3>
                    <button type="button" onClick={() => setFormData({...formData, features: [...(formData.features || []), { title: '', description: '', icon: '' }]})} className="flex items-center gap-1 text-sm font-medium text-white hover:text-white bg-primary text-black hover:bg-primary-hover px-3 py-1.5 rounded-lg transition-colors">
                      <Plus className="w-4 h-4" /> Add Feature
                    </button>
                  </div>
                  
                  {(!formData.features || formData.features.length === 0) ? (
                    <div className="text-sm text-gray-500 text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      No features added yet. Click Add Feature to add one.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.features.map((feature: any, index: number) => (
                        <div key={index} className="p-5 border border-zinc-300 rounded-lg bg-gray-50">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-bold text-gray-800">Feature {index + 1}</h4>
                            <button type="button" onClick={() => {
                              const newFeatures = [...formData.features];
                              newFeatures.splice(index, 1);
                              setFormData({...formData, features: newFeatures});
                            }} className="text-red-500 hover:bg-red-50 px-2 py-1 rounded transition-colors text-xs font-semibold flex items-center gap-1">
                              <Trash2 className="w-3.5 h-3.5" /> Remove Feature
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Title *</label>
                              <input type="text" value={feature.title} onChange={e => {
                                const newFeatures = [...formData.features];
                                newFeatures[index].title = e.target.value;
                                setFormData({...formData, features: newFeatures});
                              }} className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#6320ee]" placeholder="e.g. Strength Building" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Icon *</label>
                              <IconSelect value={feature.icon} onChange={(val) => {
                                const newFeatures = [...formData.features];
                                newFeatures[index].icon = val;
                                setFormData({...formData, features: newFeatures});
                              }} />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Description *</label>
                            <textarea value={feature.description} onChange={e => {
                              const newFeatures = [...formData.features];
                              newFeatures[index].description = e.target.value;
                              setFormData({...formData, features: newFeatures});
                            }} className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#6320ee] h-20" placeholder="Feature description..." />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ABOUT THIS PROGRAM */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#0f172a] border-b pb-2">About This Program</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Methodology Description</label>
                    <textarea value={formData.methodologyDescription} onChange={e => setFormData({...formData, methodologyDescription: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6320ee] text-sm h-32" placeholder="Explain the methodology of this program..." />
                  </div>
                </div>

                {/* BENEFITS / ITEMS */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-lg font-semibold text-[#0f172a]">Benefits / Items</h3>
                    <button type="button" onClick={() => setFormData({...formData, items: [...(formData.items || []), { title: '', icon: '' }]})} className="flex items-center gap-1 text-sm font-medium text-white hover:text-white bg-primary text-black hover:bg-primary-hover px-3 py-1.5 rounded-lg transition-colors">
                      <Plus className="w-4 h-4" /> Add Item
                    </button>
                  </div>
                  
                  {(!formData.items || formData.items.length === 0) ? (
                    <div className="text-sm text-gray-500 text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      No items added yet. Click Add Item to add one.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.items.map((item: any, index: number) => (
                        <div key={index} className="p-5 border border-zinc-300 rounded-lg bg-gray-50 flex flex-col gap-3">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-bold text-gray-800">Item {index + 1}</h4>
                            <button type="button" onClick={() => {
                              const newItems = [...formData.items];
                              newItems.splice(index, 1);
                              setFormData({...formData, items: newItems});
                            }} className="text-red-500 hover:bg-red-50 px-2 py-1 rounded transition-colors text-xs font-semibold flex items-center gap-1">
                              <Trash2 className="w-3.5 h-3.5" /> Remove
                            </button>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Title *</label>
                            <input type="text" value={item.title} onChange={e => {
                              const newItems = [...formData.items];
                              newItems[index].title = e.target.value;
                              setFormData({...formData, items: newItems});
                            }} className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#6320ee]" placeholder="e.g. Increase strength" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Icon *</label>
                            <IconSelect value={item.icon} onChange={(val) => {
                              const newItems = [...formData.items];
                              newItems[index].icon = val;
                              setFormData({...formData, items: newItems});
                            }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* HERO BUTTONS */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#0f172a] border-b pb-2">Hero Buttons (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 border border-zinc-300 rounded-lg bg-gray-50">
                      <h4 className="text-sm font-bold mb-3 text-gray-800">Primary CTA</h4>
                      <input type="text" placeholder="Text (e.g. Get Started)" value={formData.ctaPrimaryText} onChange={e => setFormData({...formData, ctaPrimaryText: e.target.value})} className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-[#6320ee]" />
                      <input type="text" placeholder="Link (e.g. /assessment)" value={formData.ctaPrimaryLink} onChange={e => setFormData({...formData, ctaPrimaryLink: e.target.value})} className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#6320ee]" />
                    </div>
                    <div className="p-5 border border-zinc-300 rounded-lg bg-gray-50">
                      <h4 className="text-sm font-bold mb-3 text-gray-800">Secondary CTA</h4>
                      <input type="text" placeholder="Text (e.g. Book Session)" value={formData.ctaSecondaryText} onChange={e => setFormData({...formData, ctaSecondaryText: e.target.value})} className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-[#6320ee]" />
                      <input type="text" placeholder="Link (e.g. /#contact)" value={formData.ctaSecondaryLink} onChange={e => setFormData({...formData, ctaSecondaryLink: e.target.value})} className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#6320ee]" />
                    </div>
                  </div>
                </div>

                {/* BOTTOM CTA */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#0f172a] border-b pb-2">Bottom CTA Section (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
                      <input type="text" value={formData.ctaBadge} onChange={e => setFormData({...formData, ctaBadge: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6320ee] text-sm" placeholder="e.g. Take The Next Step" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input type="text" value={formData.ctaTitle} onChange={e => setFormData({...formData, ctaTitle: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6320ee] text-sm" placeholder="e.g. Ready to Get Stronger?" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea value={formData.ctaDescription} onChange={e => setFormData({...formData, ctaDescription: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6320ee] text-sm h-24" placeholder="Brief CTA description..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                      <input type="text" value={formData.ctaButtonText} onChange={e => setFormData({...formData, ctaButtonText: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6320ee] text-sm" placeholder="e.g. Join Now" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                      <input type="text" value={formData.ctaButtonLink} onChange={e => setFormData({...formData, ctaButtonLink: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6320ee] text-sm" placeholder="e.g. /assessment" />
                    </div>
                    <div className="md:col-span-2 mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">CTA Background Image (Optional)</label>
                      {formData.ctaImage ? (
                        <div className="relative rounded-lg overflow-hidden border border-zinc-300 group w-full md:w-1/2">
                          <img src={fixImageUrl(formData.ctaImage)} alt="CTA Preview" className="w-full h-40 object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <label className="cursor-pointer bg-white text-gray-900 px-3 py-1.5 rounded text-sm font-medium shadow-sm hover:bg-gray-100 transition-colors">
                              Replace
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'ctaImage', setIsCtaUploading)} disabled={isCtaUploading} />
                            </label>
                            <button type="button" onClick={() => setFormData({...formData, ctaImage: ''})} className="bg-red-500 text-white px-3 py-1.5 rounded text-sm font-medium shadow-sm hover:bg-red-600 transition-colors">
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className={`flex flex-col items-center justify-center w-full md:w-1/2 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${isCtaUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                          <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm font-medium text-gray-600">{isCtaUploading ? 'Uploading...' : 'Upload Image'}</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'ctaImage', setIsCtaUploading)} disabled={isCtaUploading} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* PUBLISHING */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#0f172a] border-b pb-2">Publishing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                      <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6320ee] text-sm">
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="DRAFT">DRAFT</option>
                        <option value="INACTIVE">INACTIVE</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Display Order *</label>
                      <input type="number" value={formData.displayOrder} onChange={e => setFormData({...formData, displayOrder: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6320ee] text-sm" />
                    </div>
                  </div>
                </div>

              </div>
            </div>
            
            <div className="p-4 md:p-6 border-t border-zinc-200 bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors text-sm">
                Cancel
              </button>
              <button onClick={handleSave} className="px-6 py-2.5 bg-primary text-black font-medium hover:bg-primary-hover rounded-lg transition-colors text-sm shadow-sm">
                Save Service
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
