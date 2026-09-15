'use client';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { fixImageUrl } from '@/lib/apiConfig';
import { Plus, Edit3, Trash2, X, UploadCloud, Eye, Image as ImageIcon } from 'lucide-react';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import { IconSelect } from '@/components/ui/IconSelect';

interface TransformationCard {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  icon: string | null;
  beforeImage: string;
  afterImage: string;
  highlights: string[] | null;
  stat1Value: string | null;
  stat1Label: string | null;
  stat2Value: string | null;
  stat2Label: string | null;
  showInMain: boolean;
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
  displayOrder: number;
}

export default function TransformationCardsPage() {
  const [cards, setCards] = useState<TransformationCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingAfter, setIsUploadingAfter] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | string[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const initialFormState = {
    title: '',
    slug: '',
    subtitle: '',
    icon: '',
    beforeImage: '',
    afterImage: '',
    highlights: [] as string[],
    stat1Value: '',
    stat1Label: '',
    stat2Value: '',
    stat2Label: '',
    showInMain: false,
    status: 'ACTIVE' as any,
    displayOrder: 0
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/transformations');
      if (response.ok) {
        const json = await response.json();
        setCards(json.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch transformation cards:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadBefore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const data = new FormData();
    data.append('image', file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/upload`, {
        method: 'POST',
        body: data,
        credentials: 'include',
      });
      const json = await response.json();
      if (json.success) {
        setFormData(prev => ({ ...prev, beforeImage: json.url }));
      } else {
        alert("Upload failed: " + (json.message || "Unknown error"));
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      alert("Upload error: " + error.message);
    } finally {
      setIsUploading(false);
      // Reset input value to allow selecting same file again
      if (e.target) e.target.value = '';
    }
  };

  const handleUploadAfter = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAfter(true);
    const data = new FormData();
    data.append('image', file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/upload`, {
        method: 'POST',
        body: data,
        credentials: 'include',
      });
      const json = await response.json();
      if (json.success) {
        setFormData(prev => ({ ...prev, afterImage: json.url }));
      } else {
        alert("Upload failed: " + (json.message || "Unknown error"));
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      alert("Upload error: " + error.message);
    } finally {
      setIsUploadingAfter(false);
      // Reset input value to allow selecting same file again
      if (e.target) e.target.value = '';
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (card: TransformationCard) => {
    setEditingId(card.id);
    setFormData({
      title: card.title,
      slug: card.slug,
      subtitle: card.subtitle || '',
      icon: card.icon || '',
      beforeImage: card.beforeImage,
      afterImage: card.afterImage,
      highlights: card.highlights || [],
      stat1Value: card.stat1Value || '',
      stat1Label: card.stat1Label || '',
      stat2Value: card.stat2Value || '',
      stat2Label: card.stat2Label || '',
      showInMain: card.showInMain,
      status: card.status,
      displayOrder: card.displayOrder || 0
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.slug || !formData.beforeImage || !formData.afterImage) {
      alert("Please fill in all required fields (Title, Slug, Before Image, After Image)");
      return;
    }

    try {
      const url = editingId ? `/transformations/${editingId}` : '/transformations';
      const method = editingId ? 'PATCH' : 'POST';
      
      let finalHighlights = formData.highlights;
      let finalStat1Value = formData.stat1Value;
      let finalStat1Label = formData.stat1Label;
      let finalStat2Value = formData.stat2Value;
      let finalStat2Label = formData.stat2Label;

      if (formData.showInMain) {
        finalStat1Value = '';
        finalStat1Label = '';
        finalStat2Value = '';
        finalStat2Label = '';
      } else {
        finalHighlights = [];
      }

      const payload = {
        ...formData,
        highlights: finalHighlights,
        stat1Value: finalStat1Value,
        stat1Label: finalStat1Label,
        stat2Value: finalStat2Value,
        stat2Label: finalStat2Label,
        displayOrder: Number(formData.displayOrder)
      };

      const response = await api[method.toLowerCase() as 'post' | 'patch'](url, payload);

      if (response.ok) {
        fetchCards();
        closeModal();
      } else {
        const json = await response.json();
        alert(`Error: ${json.message}`);
      }
    } catch (error) {
      console.error("Save error:", error);
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
        await Promise.all(deleteTarget.map(id => api.delete(`/transformations/${id}`)));
        setSelectedIds([]);
        fetchCards();
      } else {
        const response = await api.delete(`/transformations/${deleteTarget}`);
        if (response.ok) {
          fetchCards();
          setSelectedIds(prev => prev.filter(id => id !== deleteTarget));
        } else {
          alert("Failed to delete card");
        }
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === cards.length && cards.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cards.map(c => c.id));
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

  const addHighlight = () => {
    setFormData({ ...formData, highlights: [...formData.highlights, ''] });
  };

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    setFormData({ ...formData, highlights: newHighlights });
  };

  const removeHighlight = (index: number) => {
    const newHighlights = [...formData.highlights];
    newHighlights.splice(index, 1);
    setFormData({ ...formData, highlights: newHighlights });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Transformation Cards</h1>
          <p className="text-sm text-slate-500 mt-1">Manage both Main Transformations and Real People cards.</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <button 
              onClick={triggerBulkDelete}
              className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
            >
              <Trash2 size={18} />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          )}
          {cards.length > 0 && (
            <button 
              onClick={handleSelectAll}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
            >
              <span>{selectedIds.length === cards.length ? 'Deselect All' : 'Select All'}</span>
            </button>
          )}
          <button 
            onClick={openAddModal}
            className="bg-primary hover:bg-primary-hover text-black px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>Add Transformation</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : cards.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center p-16 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Eye className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">No Transformations Found</h3>
          <p className="text-slate-500 max-w-sm mb-6">Create a transformation card to display on the public site.</p>
          <button 
            onClick={openAddModal}
            className="bg-primary hover:bg-primary-hover text-black px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>Add Transformation</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col relative ${selectedIds.includes(card.id) ? 'border-primary ring-1 ring-primary' : 'border-slate-200'}`}>
              <div className="absolute top-2 left-2 z-20">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary/20 shadow-sm"
                  checked={selectedIds.includes(card.id)}
                  onChange={() => handleSelectOne(card.id)}
                />
              </div>
              <div className="flex h-32 w-full relative">
                <div className="w-1/2 h-full relative">
                  <img src={fixImageUrl(card.beforeImage)} alt="Before" className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-9 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Before</div>
                </div>
                <div className="w-1/2 h-full relative">
                  <img src={fixImageUrl(card.afterImage)} alt="After" className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-primary/90 text-black text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">After</div>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 z-10">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded shadow-sm ${
                    card.showInMain ? 'bg-primary text-black' : 'bg-slate-700 text-white'
                  }`}>
                    {card.showInMain ? 'MAIN' : 'REAL PEOPLE'}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded shadow-sm ${
                    card.status === 'ACTIVE' ? 'bg-primarymerald-500 text-white' :
                    card.status === 'INACTIVE' ? 'bg-red-500 text-white' :
                    'bg-amber-500 text-white'
                  }`}>
                    {card.status}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between border-t border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-1">{card.title}</h3>
                  {card.subtitle && <p className="text-sm text-slate-500 font-medium mb-3">{card.subtitle}</p>}
                  
                  <div className="text-xs text-slate-400 mb-2">Order: {card.displayOrder} • Icon: {card.icon || 'hexagon'}</div>
                  
                  {card.showInMain && card.highlights && card.highlights.length > 0 && (
                    <div className="mt-3 bg-slate-50 p-2 rounded border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Highlights</p>
                      <ul className="text-xs text-slate-700 space-y-1">
                        {card.highlights.slice(0, 2).map((h, i) => (
                          <li key={i}>• {h}</li>
                        ))}
                        {card.highlights.length > 2 && <li className="text-slate-400">+{card.highlights.length - 2} more</li>}
                      </ul>
                    </div>
                  )}

                  {!card.showInMain && card.stat1Value && (
                    <div className="mt-3 flex gap-4 bg-slate-50 p-2 rounded border border-slate-100">
                      <div>
                        <div className="text-sm font-bold text-slate-800">{card.stat1Value}</div>
                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{card.stat1Label}</div>
                      </div>
                      {card.stat2Value && (
                        <div>
                          <div className="text-sm font-bold text-slate-800">{card.stat2Value}</div>
                          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{card.stat2Label}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => openEditModal(card)}
                    className="p-1.5 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => confirmDelete(card.id)}
                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {editingId ? 'Edit Transformation' : 'Add Transformation'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 md:p-6 overflow-y-auto bg-slate-50/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">BASIC INFORMATION</h3>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Title <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={formData.title} 
                        onChange={e => setFormData({...formData, title: e.target.value})} 
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20/20 focus:border-primary text-sm" 
                        placeholder="e.g. FAT LOSS" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Slug <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={formData.slug} 
                        onChange={e => setFormData({...formData, slug: e.target.value})} 
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20/20 focus:border-primary text-sm" 
                        placeholder="e.g. fat-loss" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle</label>
                      <input 
                        type="text" 
                        value={formData.subtitle} 
                        onChange={e => setFormData({...formData, subtitle: e.target.value})} 
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20/20 focus:border-primary text-sm" 
                        placeholder="e.g. 12-Week Transformation" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Icon Identifier</label>
                      <IconSelect 
                        value={formData.icon} 
                        onChange={val => setFormData({...formData, icon: val})} 
                      />
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">TRANSFORMATION IMAGES</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">Before Image <span className="text-red-500">*</span></label>
                        {formData.beforeImage ? (
                          <div className="relative rounded-lg overflow-hidden border border-slate-200 group h-32">
                            <img src={fixImageUrl(formData.beforeImage)} alt="Before" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                              <label className="cursor-pointer bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded text-xs font-medium backdrop-blur-sm transition-colors">
                                <input type="file" accept="image/*" className="hidden" onChange={handleUploadBefore} disabled={isUploading} />
                                Replace
                              </label>
                            </div>
                          </div>
                        ) : (
                          <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                            <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
                            <span className="text-[10px] font-medium text-slate-600">{isUploading ? 'Uploading...' : 'Upload Before'}</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleUploadBefore} disabled={isUploading} />
                          </label>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">After Image <span className="text-red-500">*</span></label>
                        {formData.afterImage ? (
                          <div className="relative rounded-lg overflow-hidden border border-slate-200 group h-32">
                            <img src={fixImageUrl(formData.afterImage)} alt="After" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                              <label className="cursor-pointer bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded text-xs font-medium backdrop-blur-sm transition-colors">
                                <input type="file" accept="image/*" className="hidden" onChange={handleUploadAfter} disabled={isUploadingAfter} />
                                Replace
                              </label>
                            </div>
                          </div>
                        ) : (
                          <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors ${isUploadingAfter ? 'opacity-50 pointer-events-none' : ''}`}>
                            <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
                            <span className="text-[10px] font-medium text-slate-600">{isUploadingAfter ? 'Uploading...' : 'Upload After'}</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleUploadAfter} disabled={isUploadingAfter} />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">CARD TYPE</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all ${
                        formData.showInMain 
                          ? 'border-violet-500 bg-primary/10 ring-2 ring-violet-500/20' 
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}>
                        <input 
                          type="radio" 
                          name="cardType"
                          checked={formData.showInMain} 
                          onChange={() => setFormData({...formData, showInMain: true})}
                          className="sr-only"
                        />
                        <div className="text-sm font-bold text-slate-800 mb-1">Main Transformation</div>
                        <div className="text-xs text-slate-500 text-center">Upper Featured Cards</div>
                      </label>

                      <label className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all ${
                        !formData.showInMain 
                          ? 'border-violet-500 bg-primary/10 ring-2 ring-violet-500/20' 
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}>
                        <input 
                          type="radio" 
                          name="cardType"
                          checked={!formData.showInMain} 
                          onChange={() => setFormData({...formData, showInMain: false})}
                          className="sr-only"
                        />
                        <div className="text-sm font-bold text-slate-800 mb-1">Real Progress</div>
                        <div className="text-xs text-slate-500 text-center">Lower Progress Grid</div>
                      </label>
                    </div>
                  </div>

                  {formData.showInMain ? (
                    <div className="bg-white p-5 rounded-xl border border-violet-300 shadow-md ring-1 ring-violet-50 transition-all">
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4 flex justify-between items-center">
                        MAIN CARD HIGHLIGHTS
                      </h3>
                      <div className="space-y-3">
                        {formData.highlights.map((highlight, index) => (
                          <div key={index} className="flex gap-2 items-center">
                            <input 
                              type="text" 
                              value={highlight} 
                              onChange={(e) => updateHighlight(index, e.target.value)} 
                              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20/20 focus:border-primary text-sm" 
                              placeholder="e.g. LEANER PHYSIQUE" 
                            />
                            <button 
                              onClick={() => removeHighlight(index)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                        <button 
                          onClick={addHighlight}
                          className="w-full py-2 border-2 border-dashed border-slate-200 text-slate-500 hover:text-primary hover:border-violet-300 hover:bg-primary/10 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus size={16} /> Add Highlight
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-5 rounded-xl border border-violet-300 shadow-md ring-1 ring-violet-50 transition-all">
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4 flex justify-between items-center">
                        REAL PEOPLE STATS
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3 border-r border-slate-100 pr-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Stat 1 Value</label>
                            <input 
                              type="text" 
                              value={formData.stat1Value} 
                              onChange={e => setFormData({...formData, stat1Value: e.target.value})} 
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20/20 focus:border-primary text-sm" 
                              placeholder="e.g. -14 KG" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Stat 1 Label</label>
                            <input 
                              type="text" 
                              value={formData.stat1Label} 
                              onChange={e => setFormData({...formData, stat1Label: e.target.value})} 
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20/20 focus:border-primary text-sm" 
                              placeholder="e.g. BODY WEIGHT" 
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Stat 2 Value</label>
                            <input 
                              type="text" 
                              value={formData.stat2Value} 
                              onChange={e => setFormData({...formData, stat2Value: e.target.value})} 
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20/20 focus:border-primary text-sm" 
                              placeholder="e.g. -18%" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Stat 2 Label</label>
                            <input 
                              type="text" 
                              value={formData.stat2Label} 
                              onChange={e => setFormData({...formData, stat2Label: e.target.value})} 
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20/20 focus:border-primary text-sm" 
                              placeholder="e.g. BODY FAT" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">PUBLISHING</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                        <select 
                          value={formData.status} 
                          onChange={e => setFormData({...formData, status: e.target.value as any})} 
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20/20 focus:border-primary text-sm"
                        >
                          <option value="DRAFT">Draft</option>
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Display Order</label>
                        <input 
                          type="number" 
                          value={formData.displayOrder} 
                          onChange={e => setFormData({...formData, displayOrder: parseInt(e.target.value) || 0})} 
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20/20 focus:border-primary text-sm" 
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            
            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-white rounded-b-xl shrink-0">
              <button 
                onClick={closeModal}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2.5 text-sm font-bold text-black bg-primary hover:bg-primary-hover rounded-lg transition-colors shadow-sm"
              >
                {editingId ? 'Update Transformation' : 'Save Transformation'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)} 
        onConfirm={handleDelete} 
        title="Delete Transformation" 
        message="Are you sure you want to delete this transformation card? This action cannot be undone." 
      />
    </div>
  );
}
