'use client';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Plus, Edit3, Trash2, X, Eye } from 'lucide-react';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';

interface TeamSection {
  id: string;
  badge: string;
  title: string;
  description: string;
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
  updatedAt: string;
}

export default function TeamSectionPage() {
  const [teamSections, setTeamSections] = useState<TeamSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [viewingSection, setViewingSection] = useState<TeamSection | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | string[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    badge: '',
    title: '',
    description: '',
    status: 'ACTIVE'
  });

  const fetchTeamSections = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/team-section');
      if (response.ok) {
        const data = await response.json();
        const items = data.success ? data.data : data;
        setTeamSections(Array.isArray(items) ? items : []);
      }
    } catch (error) {
      console.error("Failed to fetch Team Sections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamSections();
  }, []);

  const openAddModal = () => {
    setFormData({
      badge: '',
      title: '',
      description: '',
      status: 'ACTIVE'
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (section: TeamSection) => {
    setFormData({
      badge: section.badge || '',
      title: section.title || '',
      description: section.description || '',
      status: section.status || 'ACTIVE'
    });
    setEditingId(section.id);
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
        await Promise.all(deleteTarget.map(id => api.delete(`/team-section/${id}`)));
        setSelectedIds([]);
      } else {
        await api.delete(`/team-section/${deleteTarget}`);
        setSelectedIds(prev => prev.filter(id => id !== deleteTarget));
      }
      fetchTeamSections();
    } catch (error) {
      console.error("Error deleting Team Section(s):", error);
    } finally {
      setIsConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(teamSections.map(m => m.id));
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
        response = await api.patch(`/team-section/${editingId}`, payload);
      } else {
        response = await api.post('/team-section', payload);
      }

      if (response.ok) {
        setIsModalOpen(false);
        fetchTeamSections();
      } else {
        const errorData = await response.json();
        alert(`Failed to save: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error saving Team Section:", error);
      alert("Failed to save Team Section");
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
              <h1 className="text-2xl font-bold text-gray-900">Team Section Header</h1>
              <p className="text-gray-500 text-sm mt-1">Manage all Team Section configurations</p>
            </div>
            {!isLoading && (
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
                  Add Team Section
                </button>
              </div>
            )}
          </div>

          {/* Table Content */}
          <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-zinc-200 overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center h-64 text-gray-500">Loading...</div>
            ) : teamSections.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-64 text-gray-500">
                <p className="text-lg font-medium">No Team Sections found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500 min-w-[800px]">
                  <thead className="bg-zinc-50 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-zinc-200">
                    <tr>
                      <th className="px-6 py-4 w-12">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20"
                          checked={teamSections.length > 0 && selectedIds.length === teamSections.length}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="px-6 py-4">Title & Badge</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {teamSections.map((section) => (
                      <tr key={section.id} className={`hover:bg-zinc-50 transition-colors ${selectedIds.includes(section.id) ? 'bg-primary/5' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20"
                            checked={selectedIds.includes(section.id)}
                            onChange={() => handleSelectOne(section.id)}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 text-base">{section.title}</div>
                          <div className="text-gray-500 font-medium text-xs mt-0.5 uppercase tracking-wider">{section.badge}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-600 line-clamp-2 max-w-md">{section.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(section.status)}
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
                              onClick={() => triggerDelete(section.id)}
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
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-5 border-b border-zinc-200 flex justify-between items-center bg-white">
              <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Team Section' : 'Add Team Section'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 flex-1 overflow-y-auto">
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wider">Badge (Yellow Label)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. OUR ELITE TEAM"
                    className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm font-medium"
                    value={formData.badge}
                    onChange={e => setFormData({...formData, badge: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wider">Main Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. MEET YOUR GUIDES"
                    className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm font-black uppercase"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wider">Description</label>
                  <textarea 
                    placeholder="Enter the paragraph text below the heading..."
                    rows={4}
                    className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm leading-relaxed resize-none"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wider">Status</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm font-medium"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="DRAFT">Draft</option>
                  </select>
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
                {editingId ? 'Save Changes' : 'Create Section'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setViewingSection(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-5 border-b border-zinc-200 flex justify-between items-center bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">Team Section Preview</h2>
              <button onClick={() => setViewingSection(null)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 bg-[#f8f9fa]">
              <div className="bg-[#0a0a0c] rounded-2xl p-10 relative overflow-hidden flex flex-col items-center text-center shadow-2xl max-w-3xl mx-auto border border-gray-800">
                {/* Decorative UI mimicking the frontend */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FFD700]/20 to-transparent" />
                <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-[#FFD700]/10 rounded-full blur-[80px] pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="h-px w-8 bg-[#FFD700]/50" />
                    <span className="text-[#FFD700] font-bold tracking-[0.2em] text-sm uppercase">
                      {viewingSection.badge}
                    </span>
                    <div className="h-px w-8 bg-[#FFD700]/50" />
                  </div>
                  
                  <h2 className="font-black text-4xl md:text-5xl text-white leading-tight uppercase tracking-tight drop-shadow-lg mb-6">
                    {viewingSection.title}
                  </h2>
                  
                  <p className="text-gray-400 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                    {viewingSection.description}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                {getStatusBadge(viewingSection.status)}
              </div>
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
