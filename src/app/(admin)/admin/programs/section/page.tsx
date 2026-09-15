'use client';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Plus, Edit3, X, Trash2 } from 'lucide-react';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';

interface ProgramSection {
  id: string;
  badge: string;
  title: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
}

const capitalizeFirstLetter = (str: string) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default function ProgramSectionPage() {
  const [sections, setSections] = useState<ProgramSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | string[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedSection, setSelectedSection] = useState<ProgramSection | null>(null);

  const [formData, setFormData] = useState({
    badge: '',
    title: '',
    description: '',
    status: 'ACTIVE'
  });

  const fetchSection = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/program-section');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          setSections(data.data);
        } else {
          setSections([]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch program section:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSection();
  }, []);

  const openAddModal = () => {
    setSelectedSection(null);
    setFormData({
      badge: '',
      title: '',
      description: '',
      status: 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (section: ProgramSection) => {
    setSelectedSection(section);
    setFormData({
      badge: section.badge || '',
      title: section.title || '',
      description: section.description || '',
      status: section.status || 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let response;
      if (selectedSection) {
        response = await api.patch(`/program-section/${selectedSection.id}`, formData);
      } else {
        response = await api.post('/program-section', formData);
      }

      if (response.ok) {
        setIsModalOpen(false);
        fetchSection();
      } else {
        const errorData = await response.json();
        alert(`Failed to save: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error saving program section:", error);
      alert("Failed to save program section");
    } finally {
      setIsSaving(false);
    }
  };

  const triggerDelete = (id: string) => {
    setDeleteTarget(id);
    setIsConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (Array.isArray(deleteTarget)) {
        await Promise.all(deleteTarget.map(id => api.delete(`/program-section/${id}`)));
        setSections(sections.filter(s => !deleteTarget.includes(s.id)));
        setSelectedIds([]);
      } else {
        const response = await api.delete(`/program-section/${deleteTarget}`);
        if (response.ok) {
          setSections(sections.filter(s => s.id !== deleteTarget));
          setSelectedIds(prev => prev.filter(id => id !== deleteTarget));
        }
      }
    } catch (error) {
      console.error("Error deleting program section:", error);
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
      <div className="flex-1 flex flex-col transition-all duration-300">
        <div className="p-4 md:p-8 flex-1 overflow-y-auto scrollbar-hide w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Program Section</h1>
              <p className="text-gray-500 text-sm mt-1">Manage the main heading and content for the Programs area</p>
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
                Add Program Section
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
                      checked={sections.length > 0 && selectedIds.length === sections.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Badge</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Title & Description</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Status</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm w-24">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={4} className="py-12 text-center text-gray-500">Loading...</td></tr>
                ) : sections.length === 0 ? (
                  <tr><td colSpan={4} className="py-12 text-center text-gray-500">No program section found. Click 'Add Program Section' to create one.</td></tr>
                ) : (
                  sections.map((section) => (
                    <tr key={section.id} className={`border-b border-zinc-200 hover:bg-zinc-50 transition-colors ${selectedIds.includes(section.id) ? 'bg-primary/5' : ''}`}>
                      <td className="py-4 px-6">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20"
                          checked={selectedIds.includes(section.id)}
                          onChange={() => handleSelectOne(section.id)}
                        />
                      </td>
                      <td className="py-4 px-6 text-sm text-primary font-bold">{section.badge}</td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900 font-bold max-w-sm truncate">{section.title}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5 truncate max-w-sm">{section.description}</div>
                      </td>
                      <td className="py-4 px-6">{getStatusBadge(section.status)}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openEditModal(section)}
                            className="p-1.5 text-primary hover:bg-primary/10 border border-violet-200 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => triggerDelete(section.id)}
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
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] md:max-h-[85vh]">
            <div className="px-8 py-5 border-b border-zinc-200 flex justify-between items-center bg-white">
              <h2 className="text-xl font-bold text-gray-900">{selectedSection ? 'Edit Program Section' : 'Add Program Section'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 md:p-8 flex-1 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5">Badge</label>
                  <input 
                    type="text" 
                    placeholder="e.g. OUR PROGRAMS"
                    className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm font-medium"
                    value={formData.badge}
                    onChange={e => setFormData({...formData, badge: capitalizeFirstLetter(e.target.value)})}
                  />
                  <p className="text-[10px] text-gray-400 mt-1.5">The small highlighted text above the main title.</p>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5">Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. TRAIN WITH PURPOSE. CHOOSE YOUR GOAL."
                    className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm font-bold"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: capitalizeFirstLetter(e.target.value)})}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5">Description</label>
                  <textarea 
                    placeholder="Enter description here..."
                    rows={4}
                    className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm resize-none"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: capitalizeFirstLetter(e.target.value)})}
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5">Status</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm font-medium"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' | 'DRAFT'})}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6 border-t border-zinc-200 flex justify-end gap-3 bg-zinc-50">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 border border-zinc-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2.5 bg-primary text-black rounded-lg font-medium text-sm hover:bg-primary-hover transition-colors disabled:opacity-70 flex items-center gap-2"
              >
                {isSaving ? 'Saving...' : (selectedSection ? 'Save Changes' : 'Create Section')}
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
