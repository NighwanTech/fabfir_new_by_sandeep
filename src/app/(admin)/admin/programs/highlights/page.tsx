'use client';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Plus, Edit3, Trash2, X } from 'lucide-react';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import { IconSelect } from '@/components/ui/IconSelect';

interface ProgramHighlight {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: 'ACTIVE' | 'INACTIVE';
  displayOrder: number;
}

export default function ProgramHighlightsPage() {
  const [highlights, setHighlights] = useState<ProgramHighlight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState<ProgramHighlight | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | string[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    status: 'ACTIVE',
    displayOrder: 1
  });

  const fetchHighlights = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/program-highlights');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setHighlights(data.data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch highlights:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHighlights();
  }, []);

  const openAddModal = () => {
    setSelectedHighlight(null);
    setFormData({
      title: '',
      description: '',
      icon: '',
      status: 'ACTIVE',
      displayOrder: highlights.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (highlight: ProgramHighlight) => {
    setSelectedHighlight(highlight);
    setFormData({
      title: highlight.title || '',
      description: highlight.description || '',
      icon: highlight.icon || '',
      status: highlight.status || 'ACTIVE',
      displayOrder: highlight.displayOrder || 1
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
        await Promise.all(deleteTarget.map(id => api.delete(`/program-highlights/${id}`)));
        setHighlights(highlights.filter(h => !deleteTarget.includes(h.id)));
        setSelectedIds([]);
      } else {
        const response = await api.delete(`/program-highlights/${deleteTarget}`);
        if (response.ok) {
          setHighlights(highlights.filter(h => h.id !== deleteTarget));
          setSelectedIds(prev => prev.filter(id => id !== deleteTarget));
        }
      }
    } catch (error) {
      console.error("Error deleting highlight:", error);
    } finally {
      setIsConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(highlights.map(h => h.id));
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
        displayOrder: parseInt(formData.displayOrder as any, 10) || 1
      };
      
      let response;
      if (selectedHighlight) {
        response = await api.patch(`/program-highlights/${selectedHighlight.id}`, payload);
      } else {
        response = await api.post('/program-highlights', payload);
      }

      if (response.ok) {
        setIsModalOpen(false);
        fetchHighlights();
      } else {
        const errorData = await response.json();
        alert(`Failed to save: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error saving highlight:", error);
      alert("Failed to save highlight");
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
        <div className="p-4 md:p-8 flex-1 overflow-y-auto scrollbar-hide w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Program Highlights</h1>
              <p className="text-gray-500 text-sm mt-1">Manage the small feature cards below the main programs</p>
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
                onClick={openAddModal}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black rounded-lg hover:bg-primary-hover font-medium text-sm shadow-sm transition-colors"
              >
                <Plus size={16} />
                Add Highlight
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
                      checked={highlights.length > 0 && selectedIds.length === highlights.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm w-16">#</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm w-24">Icon</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Title & Description</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Status</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Order</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={6} className="py-12 text-center text-gray-500">Loading...</td></tr>
                ) : highlights.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-gray-500">No highlights found.</td></tr>
                ) : (
                  highlights.sort((a, b) => a.displayOrder - b.displayOrder).map((highlight, index) => (
                    <tr key={highlight.id} className={`border-b border-zinc-200 hover:bg-zinc-50 transition-colors ${selectedIds.includes(highlight.id) ? 'bg-primary/5' : ''}`}>
                      <td className="py-4 px-6">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20"
                          checked={selectedIds.includes(highlight.id)}
                          onChange={() => handleSelectOne(highlight.id)}
                        />
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">{index + 1}</td>
                      <td className="py-4 px-6">
                        <div className="w-10 h-10 bg-primary/10 rounded text-primary flex items-center justify-center font-bold text-xs uppercase shadow-sm border border-violet-100">
                          {highlight.icon ? highlight.icon.substring(0, 2) : '?'}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900 font-bold">{highlight.title}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5 truncate max-w-xs">{highlight.description}</div>
                      </td>
                      <td className="py-4 px-6">{getStatusBadge(highlight.status)}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">{highlight.displayOrder}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openEditModal(highlight)}
                            className="p-1.5 text-primary hover:bg-primary/10 border border-violet-200 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => triggerDelete(highlight.id)}
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
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] md:max-h-[85vh]">
            <div className="px-6 py-5 border-b border-zinc-200 flex justify-between items-center bg-white">
              <h2 className="text-lg font-bold text-gray-900">{selectedHighlight ? 'Edit Highlight' : 'Add New Highlight'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 md:p-6 overflow-y-auto">
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5">Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Goal Focused"
                    className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5">Description</label>
                  <textarea 
                    placeholder="Enter short description here..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm resize-none"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5">Icon *</label>
                  <IconSelect 
                    value={formData.icon} 
                    onChange={val => setFormData({...formData, icon: val})} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
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

            <div className="p-5 border-t border-zinc-200 flex justify-end gap-3 bg-zinc-50">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 border border-zinc-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2 bg-primary text-black rounded-lg font-medium text-sm hover:bg-primary-hover transition-colors"
              >
                Save Highlight
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
