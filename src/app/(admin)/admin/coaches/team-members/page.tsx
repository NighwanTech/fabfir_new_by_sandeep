'use client';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { fixImageUrl } from '@/lib/apiConfig';
import { Plus, Edit3, Trash2, X, UploadCloud, Eye } from 'lucide-react';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';

interface TeamMember {
  id: string;
  name: string;
  category: string;
  specialization: string;
  description: string;
  image: string;
  instagramUrl: string | null;
  facebookUrl: string | null;
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
  displayOrder: number;
  updatedAt: string;
}

export default function TeamMembersPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [viewingMember, setViewingMember] = useState<TeamMember | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | string[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    specialization: '',
    description: '',
    image: '',
    instagramUrl: '',
    facebookUrl: '',
    status: 'ACTIVE',
    displayOrder: 0
  });

  const fetchTeamMembers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/team-members');
      if (response.ok) {
        const data = await response.json();
        const items = data.success ? data.data : data;
        setTeamMembers(Array.isArray(items) ? items : []);
      }
    } catch (error) {
      console.error("Failed to fetch Team Members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const openAddModal = () => {
    setFormData({
      name: '',
      category: '',
      specialization: '',
      description: '',
      image: '',
      instagramUrl: '',
      facebookUrl: '',
      status: 'ACTIVE',
      displayOrder: teamMembers.length + 1
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setFormData({
      name: member.name || '',
      category: member.category || '',
      specialization: member.specialization || '',
      description: member.description || '',
      image: member.image || '',
      instagramUrl: member.instagramUrl || '',
      facebookUrl: member.facebookUrl || '',
      status: member.status || 'ACTIVE',
      displayOrder: member.displayOrder || 0
    });
    setEditingId(member.id);
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
        await Promise.all(deleteTarget.map(id => api.delete(`/team-members/${id}`)));
        setSelectedIds([]);
      } else {
        await api.delete(`/team-members/${deleteTarget}`);
        setSelectedIds(prev => prev.filter(id => id !== deleteTarget));
      }
      fetchTeamMembers();
    } catch (error) {
      console.error("Error deleting Team Member(s):", error);
    } finally {
      setIsConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(teamMembers.map(m => m.id));
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
      // Format empty strings to null/empty for URL fields
      if (!payload.instagramUrl) payload.instagramUrl = '';
      if (!payload.facebookUrl) payload.facebookUrl = '';

      let response;
      if (editingId) {
        response = await api.patch(`/team-members/${editingId}`, payload);
      } else {
        response = await api.post('/team-members', payload);
      }

      if (response.ok) {
        setIsModalOpen(false);
        fetchTeamMembers();
      } else {
        const errorData = await response.json();
        alert(`Failed to save: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error saving Team Member:", error);
      alert("Failed to save Team Member");
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
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
              <p className="text-gray-500 text-sm mt-1">Manage individual trainers and guides</p>
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
                  Add Team Member
                </button>
              </div>
            )}
          </div>

          {/* Table Content */}
          <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-zinc-200 overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center h-64 text-gray-500">Loading...</div>
            ) : teamMembers.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-64 text-gray-500">
                <p className="text-lg font-medium">No Team Members found.</p>
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
                          checked={teamMembers.length > 0 && selectedIds.length === teamMembers.length}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="px-6 py-4">Image</th>
                      <th className="px-6 py-4">Details</th>
                      <th className="px-6 py-4">Order</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {teamMembers.map((member) => (
                      <tr key={member.id} className={`hover:bg-zinc-50 transition-colors ${selectedIds.includes(member.id) ? 'bg-primary/5' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20"
                            checked={selectedIds.includes(member.id)}
                            onChange={() => handleSelectOne(member.id)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-300 bg-gray-100 cursor-pointer" onClick={() => setPreviewImage(member.image)}>
                            {member.image ? (
                              <img src={fixImageUrl(member.image)} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">N/A</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 text-base">{member.name}</div>
                          <div className="text-gray-500 font-medium text-xs mt-0.5 uppercase tracking-wider">{member.category} • {member.specialization}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                          {member.displayOrder}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(member.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => openEditModal(member)}
                              className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button
                              onClick={() => triggerDelete(member.id)}
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
              <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Team Member' : 'Add Team Member'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wider">Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. SARAH JENNINGS"
                      className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm font-medium"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wider">Category (Yellow Badge)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. ASHTANGA & VINYASA FLOW"
                      className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm font-medium"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wider">Specialization</label>
                    <input 
                      type="text" 
                      placeholder="e.g. YOGA & MOBILITY SPECIALIST"
                      className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm font-medium"
                      value={formData.specialization}
                      onChange={e => setFormData({...formData, specialization: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wider">Description</label>
                    <textarea 
                      placeholder="Short bio..."
                      rows={5}
                      className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm resize-none"
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div>
                      <label className="block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wider">Display Order</label>
                      <input 
                        type="number" 
                        min="1"
                        className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm font-medium"
                        value={formData.displayOrder}
                        onChange={e => setFormData({...formData, displayOrder: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wider">Instagram URL (Optional)</label>
                    <input 
                      type="url" 
                      placeholder="https://instagram.com/..."
                      className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
                      value={formData.instagramUrl}
                      onChange={e => setFormData({...formData, instagramUrl: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wider">Facebook URL (Optional)</label>
                    <input 
                      type="url" 
                      placeholder="https://facebook.com/..."
                      className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
                      value={formData.facebookUrl}
                      onChange={e => setFormData({...formData, facebookUrl: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">Member Image</label>
                    <div className="w-full h-48 rounded-lg border-2 border-dashed border-gray-300 relative overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center cursor-pointer">
                      {formData.image ? (
                        <>
                          <img src={fixImageUrl(formData.image)} alt="Preview" className="absolute inset-0 w-full h-full object-contain object-bottom" />
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
                {editingId ? 'Save Changes' : 'Create Member'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setViewingMember(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-5 border-b border-zinc-200 flex justify-between items-center bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">Member Details</h2>
              <button onClick={() => setViewingMember(null)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 bg-[#f8f9fa]">
              <div className="bg-[#0a0a0c] rounded-2xl p-0 relative overflow-hidden shadow-2xl max-w-md mx-auto border border-gray-800">
                
                {/* Visual Card mimicking Frontend */}
                <div className="relative h-[400px] w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/20 to-transparent z-10" />
                  <img
                    src={fixImageUrl(viewingMember.image)}
                    alt={viewingMember.name}
                    className="w-full h-full object-cover object-top"
                  />
                  
                  {/* Category Badge over the image */}
                  <div className="absolute bottom-5 left-6 z-20">
                    <span className="inline-block px-3 py-1.5 bg-black/40 backdrop-blur-md text-[#FFD700] border border-[#FFD700]/30 text-xs font-bold tracking-wider rounded-md shadow-lg">
                      {viewingMember.category}
                    </span>
                  </div>

                  {/* Social Links Preview */}
                  <div className="absolute top-6 right-6 z-20 flex flex-col gap-3">
                    {viewingMember.instagramUrl && (
                      <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                      </div>
                    )}
                    {viewingMember.facebookUrl && (
                      <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative z-20 px-6 pb-6 pt-5">
                  <div className="mb-2">
                    <h3 className="font-heading text-2xl lg:text-3xl font-black tracking-tight drop-shadow-md bg-gradient-to-r from-white via-white to-[#FFD700] bg-clip-text text-transparent">
                      {viewingMember.name}
                    </h3>
                    <p className="text-white/80 font-semibold text-sm tracking-widest mt-1">
                      {viewingMember.specialization}
                    </p>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                      {viewingMember.description}
                    </p>
                  </div>

                  <div className="w-full h-px bg-[#FFD700] relative" />
                </div>
              </div>
              
              <div className="mt-8 flex justify-center gap-4">
                <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded font-bold text-sm">Order: {viewingMember.displayOrder}</span>
                {getStatusBadge(viewingMember.status)}
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
