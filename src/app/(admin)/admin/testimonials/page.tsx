'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, Upload } from 'lucide-react';
import { api } from '@/services/api';
import { fixImageUrl } from '@/lib/apiConfig';
import { IconSelect } from '@/components/ui/IconSelect';

const EMPTY_FORM = {
  name: '',
  profession: '',
  quote: '',
  image: '',
  stat1Value: '',
  stat1Label: '',
  stat1Icon: '',
  stat2Value: '',
  stat2Label: '',
  stat2Icon: '',
  stat3Value: '',
  stat3Label: '',
  stat3Icon: '',
  status: 'ACTIVE',
  displayOrder: 0,
};

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [formData, setFormData] = useState<any>({ ...EMPTY_FORM });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | string[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/testimonials');
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data.data || []);
      }
    } catch (err) {
      console.error('Fetch testimonials error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openAdd = () => {
    setSelected(null);
    setFormData({ ...EMPTY_FORM, displayOrder: testimonials.length });
    setIsModalOpen(true);
  };

  const openEdit = (t: any) => {
    setSelected(t);
    setFormData({ ...t });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file); // must match multer field name
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/upload`, {
        method: 'POST',
        body: fd,
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setFormData((prev: any) => ({ ...prev, image: data.url }));
      } else {
        alert('Upload failed: ' + (data.message || 'Unknown error'));
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      alert('Error uploading image: ' + err.message);
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = { ...formData, displayOrder: Number(formData.displayOrder) };
      const res = selected
        ? await api.patch(`/testimonials/${selected.id}`, payload)
        : await api.post('/testimonials', payload);
      if (res.ok) {
        await fetchAll();
        setIsModalOpen(false);
      } else {
        alert('Failed to save testimonial');
      }
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const triggerDelete = (id: string) => { setDeleteId(id); setIsConfirmOpen(true); };

  const executeDelete = async () => {
    if (!deleteId) return;
    try {
      if (Array.isArray(deleteId)) {
        await Promise.all(deleteId.map(id => api.delete(`/testimonials/${id}`)));
        await fetchAll();
        setSelectedIds([]);
      } else {
        await api.delete(`/testimonials/${deleteId}`);
        await fetchAll();
        setSelectedIds(prev => prev.filter(id => id !== deleteId));
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setIsConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(testimonials.map(t => t.id));
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
    setDeleteId(selectedIds);
    setIsConfirmOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      ACTIVE: 'bg-green-100 text-green-700',
      INACTIVE: 'bg-gray-100 text-gray-600',
      DRAFT: 'bg-yellow-100 text-yellow-700',
    };
    return (
      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider ${map[status] || 'bg-gray-100 text-gray-600'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] min-w-0 w-full overflow-hidden">
      <div className="flex-1 flex flex-col transition-all duration-300">
        <div className="p-4 md:p-8 flex-1 overflow-y-auto w-full">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
              <p className="text-sm text-gray-500 mt-1">Manage client testimonials and their result stats.</p>
            </div>
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
                onClick={openAdd}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black rounded-lg hover:bg-primary-hover font-medium text-sm shadow-sm transition-colors"
              >
                <Plus size={16} />
                Add Testimonial
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
                      checked={testimonials.length > 0 && selectedIds.length === testimonials.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Order</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Person</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Quote</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Stats</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Status</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm w-24">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={6} className="py-12 text-center text-gray-500">Loading...</td></tr>
                ) : testimonials.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-gray-500">No testimonials. Click 'Add Testimonial' to create one.</td></tr>
                ) : (
                  testimonials.map((t) => (
                    <tr key={t.id} className={`border-b border-zinc-200 hover:bg-zinc-50 transition-colors ${selectedIds.includes(t.id) ? 'bg-primary/5' : ''}`}>
                      <td className="py-4 px-6">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20"
                          checked={selectedIds.includes(t.id)}
                          onChange={() => handleSelectOne(t.id)}
                        />
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500 font-medium">{t.displayOrder}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {t.image && (
                            <img src={fixImageUrl(t.image)} alt={t.name} className="w-9 h-9 rounded-full object-cover border border-zinc-300" />
                          )}
                          <div>
                            <div className="text-sm font-bold text-gray-900">{t.name}</div>
                            <div className="text-[11px] text-gray-500">{t.profession}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600 max-w-xs truncate">{t.quote}</td>
                      <td className="py-4 px-6">
                        <div className="flex gap-3 text-xs text-gray-600">
                          {t.stat1Value && <span className="font-bold text-gray-900">{t.stat1Value} <span className="font-normal text-gray-400">{t.stat1Label}</span></span>}
                          {t.stat2Value && <span className="font-bold text-gray-900">{t.stat2Value} <span className="font-normal text-gray-400">{t.stat2Label}</span></span>}
                          {t.stat3Value && <span className="font-bold text-gray-900">{t.stat3Value} <span className="font-normal text-gray-400">{t.stat3Label}</span></span>}
                        </div>
                      </td>
                      <td className="py-4 px-6">{getStatusBadge(t.status)}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(t)} className="p-1.5 text-blue-600 hover:bg-primary/10 border border-blue-200 rounded transition-colors" title="Edit"><Edit3 size={16} /></button>
                          <button onClick={() => triggerDelete(t.id)} className="p-1.5 text-red-600 hover:bg-red-50 border border-red-200 rounded transition-colors" title="Delete"><Trash2 size={16} /></button>
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden max-h-[90vh]">
            <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50">
              <h2 className="text-xl font-bold text-gray-900">{selected ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <div className="p-4 md:p-6 flex-1 overflow-y-auto space-y-6">
              {/* Person Info */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Person Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Full Name</label>
                    <input
                      type="text" placeholder="e.g. ROHIT SHARMA"
                      className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:border-primary text-sm font-medium"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Profession</label>
                    <input
                      type="text" placeholder="e.g. IT Professional"
                      className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:border-primary text-sm font-medium"
                      value={formData.profession}
                      onChange={e => setFormData({ ...formData, profession: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-bold text-gray-900 mb-1.5">Quote / Testimonial</label>
                  <textarea
                    rows={4} placeholder="Client's testimonial text..."
                    className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:border-primary text-sm font-medium resize-none"
                    value={formData.quote}
                    onChange={e => setFormData({ ...formData, quote: e.target.value })}
                  />
                </div>

                {/* Profile Image */}
                <div className="mt-4">
                  <label className="block text-xs font-bold text-gray-900 mb-1.5">Profile Image</label>
                  <div className="flex items-center gap-4">
                    {formData.image && (
                      <img src={fixImageUrl(formData.image)} alt="Preview" className="w-14 h-14 rounded-full object-cover border-2 border-violet-200" />
                    )}
                    <label className="flex items-center gap-2 cursor-pointer px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg hover:border-violet-400 transition-colors text-sm text-gray-600 font-medium">
                      <Upload size={16} />
                      {isUploading ? 'Uploading...' : 'Upload Photo'}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                    </label>
                    {formData.image && (
                      <button onClick={() => setFormData({ ...formData, image: '' })} className="text-red-500 hover:text-red-700 text-xs font-medium">Remove</button>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="border-t border-zinc-200 pt-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Stats (shown on card)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-gray-50 border border-zinc-200 rounded-lg p-4">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Stat {i}</p>
                      <div className="space-y-2 mb-3">
                        <input
                          type="text" placeholder={i === 1 ? '-18 KG' : i === 2 ? '+7 KG' : '5.0/5'}
                          className="w-full px-3 py-2 border border-zinc-300 rounded focus:outline-none focus:border-primary text-sm font-bold"
                          value={formData[`stat${i}Value`]}
                          onChange={e => setFormData({ ...formData, [`stat${i}Value`]: e.target.value })}
                        />
                        <input
                          type="text" placeholder={i === 1 ? 'FAT LOSS' : i === 2 ? 'MUSCLE GAIN' : 'RATING'}
                          className="w-full px-3 py-2 border border-zinc-300 rounded focus:outline-none focus:border-primary text-sm text-gray-600"
                          value={formData[`stat${i}Label`]}
                          onChange={e => setFormData({ ...formData, [`stat${i}Label`]: e.target.value })}
                        />
                      </div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Icon (Optional)</label>
                      <IconSelect
                        value={formData[`stat${i}Icon`] || ''}
                        onChange={(val) => setFormData({ ...formData, [`stat${i}Icon`]: val })}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Fields */}
              <div className="border-t border-zinc-200 pt-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Status</label>
                    <select
                      className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:border-primary text-sm font-medium"
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                      <option value="DRAFT">DRAFT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5">Display Order</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:border-primary text-sm font-medium"
                      value={formData.displayOrder}
                      onChange={e => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-zinc-200 flex justify-end gap-3 bg-zinc-50">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 border border-zinc-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors">Cancel</button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2.5 bg-primary text-black rounded-lg font-medium text-sm hover:bg-primary-hover transition-colors disabled:opacity-70"
              >
                {isSaving ? 'Saving...' : selected ? 'Save Changes' : 'Create Testimonial'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsConfirmOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 text-red-600"><Trash2 size={24} /></div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Testimonial</h3>
            <p className="text-gray-500 text-sm mb-6">Are you sure you want to delete {Array.isArray(deleteId) ? `these ${deleteId.length} testimonials` : 'this testimonial'}? This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setIsConfirmOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={executeDelete} className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
