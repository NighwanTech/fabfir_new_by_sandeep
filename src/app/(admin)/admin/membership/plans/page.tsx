'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, Activity, Dumbbell, Flame, Heart, Zap, Crosshair, Users, Trophy } from 'lucide-react';
import { api } from '@/services/api';
import { IconSelect } from '@/components/ui/IconSelect';

export default function MembershipPlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  
  // Modal Form State
  const [formData, setFormData] = useState({
    name: '',
    duration: '' as string | number,
    price: '' as string | number,
    pricePeriod: '',
    isPopular: false,
    enquiryText: '',
    enquiryLink: '',
    status: 'ACTIVE',
    displayOrder: 0,
    features: [] as any[]
  });
  const [isSaving, setIsSaving] = useState(false);

  // Delete Confirmation State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | string[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/membership-plans');
      if (res.ok) {
        const data = await res.json();
        setPlans(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch plans', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openAddModal = () => {
    setSelectedPlan(null);
    setFormData({
      name: '',
      duration: '',
      price: '',
      pricePeriod: '',
      isPopular: false,
      enquiryText: '',
      enquiryLink: '',
      status: 'ACTIVE',
      displayOrder: plans.length,
      features: []
    });
    setIsModalOpen(true);
  };

  const openEditModal = (plan: any) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      duration: plan.duration,
      price: plan.price,
      pricePeriod: plan.pricePeriod,
      isPopular: plan.isPopular,
      enquiryText: plan.enquiryText,
      enquiryLink: plan.enquiryLink,
      status: plan.status,
      displayOrder: plan.displayOrder,
      features: plan.features ? [...plan.features] : []
    });
    setIsModalOpen(true);
  };

  const handleAddFeature = () => {
    setFormData({
      ...formData,
      features: [
        ...formData.features,
        { title: '', icon: 'badge-check', status: 'ACTIVE', displayOrder: formData.features.length }
      ]
    });
  };

  const handleFeatureChange = (index: number, key: string, value: any) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = { ...updatedFeatures[index], [key]: value };
    setFormData({ ...formData, features: updatedFeatures });
  };

  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures.splice(index, 1);
    setFormData({ ...formData, features: updatedFeatures });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        duration: Number(formData.duration),
        price: Number(formData.price),
        displayOrder: Number(formData.displayOrder),
      };

      const url = selectedPlan ? `/membership-plans/${selectedPlan.id}` : '/membership-plans';

      let res;
      if (selectedPlan) {
        res = await api.patch(url, payload);
      } else {
        res = await api.post(url, payload);
      }

      if (res.ok) {
        await fetchPlans();
        setIsModalOpen(false);
      } else {
        alert('Failed to save plan');
      }
    } catch (error) {
      console.error('Error saving plan', error);
      alert('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const triggerDelete = (id: string) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    try {
      if (Array.isArray(deleteId)) {
        await Promise.all(deleteId.map(id => api.delete(`/membership-plans/${id}`)));
        setSelectedIds([]);
      } else {
        await api.delete(`/membership-plans/${deleteId}`);
        setSelectedIds(prev => prev.filter(id => id !== deleteId));
      }
      await fetchPlans();
    } catch (error) {
      console.error('Error deleting plan(s)', error);
    } finally {
      setIsConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(plans.map(p => p.id));
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
    switch(status) {
      case 'ACTIVE': return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-md text-[10px] font-bold tracking-wider">ACTIVE</span>;
      case 'INACTIVE': return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-[10px] font-bold tracking-wider">INACTIVE</span>;
      default: return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-[10px] font-bold tracking-wider">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] min-w-0 w-full overflow-hidden">
      <div className="flex-1 flex flex-col transition-all duration-300">
        <div className="p-8 flex-1 overflow-y-auto scrollbar-hide w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Membership Plans</h1>
              <p className="text-sm text-gray-500 mt-1">Manage pricing plans and their dynamic features.</p>
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
                Add Plan
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
                      checked={plans.length > 0 && selectedIds.length === plans.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Order</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Name</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Price</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Features</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Status</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm w-24">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={6} className="py-12 text-center text-gray-500">Loading...</td></tr>
                ) : plans.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-gray-500">No plans found. Click 'Add Plan' to create one.</td></tr>
                ) : (
                  plans.map((plan) => (
                    <tr key={plan.id} className={`border-b border-zinc-200 hover:bg-zinc-50 transition-colors ${selectedIds.includes(plan.id) ? 'bg-primary/5' : ''}`}>
                      <td className="py-4 px-6">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20"
                          checked={selectedIds.includes(plan.id)}
                          onChange={() => handleSelectOne(plan.id)}
                        />
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500 font-medium">{plan.displayOrder}</td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900 font-bold flex items-center gap-2">
                          {plan.name}
                          {plan.isPopular && <span className="bg-amber-100 text-amber-700 text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">Popular</span>}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">{plan.duration} Month(s)</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-bold text-gray-900">₹{plan.price}</div>
                        <div className="text-[10px] text-gray-500 uppercase">/ {plan.pricePeriod}</div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {plan.features?.length || 0} features
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(plan.status)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openEditModal(plan)}
                            className="p-1.5 text-blue-600 hover:bg-primary/10 border border-blue-200 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => triggerDelete(plan.id)}
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
            <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50">
              <h2 className="text-xl font-bold text-gray-900">{selectedPlan ? 'Edit Membership Plan' : 'Add Membership Plan'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5">Plan Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 6 MONTHS or FAT LOSS"
                    className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm font-medium"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                  <p className="text-[10px] text-gray-500 mt-1">This is the title shown at the top of the plan card.</p>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5">Duration (in Months)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 6"
                    className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm font-medium"
                    value={formData.duration}
                    onChange={e => setFormData({...formData, duration: e.target.value ? Number(e.target.value) : ''})}
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Numeric value for how long the plan lasts (e.g. 3, 6, 12).</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5">Price</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 21000"
                    className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm font-medium"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value ? Number(e.target.value) : ''})}
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Total cost of the plan in INR.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5">Billing Period</label>
                  <input 
                    type="text" 
                    placeholder="e.g. MONTH, YEAR, TOTAL"
                    className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm font-medium uppercase"
                    value={formData.pricePeriod}
                    onChange={e => setFormData({...formData, pricePeriod: e.target.value})}
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Text shown next to price (e.g. ₹21000 / TOTAL).</p>
                </div>

                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox"
                    id="isPopular"
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20"
                    checked={formData.isPopular}
                    onChange={e => setFormData({...formData, isPopular: e.target.checked})}
                  />
                  <label htmlFor="isPopular" className="text-sm font-bold text-gray-900">Mark as Popular Plan</label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5">Display Order</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm font-medium"
                    value={formData.displayOrder}
                    onChange={e => setFormData({...formData, displayOrder: Number(e.target.value)})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5">Status</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm font-medium"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5">Button Text (Enquiry Text)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. ENQUIRE NOW"
                    className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm font-medium"
                    value={formData.enquiryText}
                    onChange={e => setFormData({...formData, enquiryText: e.target.value})}
                  />
                  <p className="text-[10px] text-gray-500 mt-1">What the button on the card should say.</p>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-xs font-bold text-gray-900 mb-1.5">WhatsApp/Enquiry Link</label>
                <input 
                  type="text" 
                  placeholder="e.g. https://wa.me/919220393004?text=Hi"
                  className="w-full px-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm font-medium"
                  value={formData.enquiryLink}
                  onChange={e => setFormData({...formData, enquiryLink: e.target.value})}
                />
                <p className="text-[10px] text-gray-500 mt-1">Where the user goes when they click the button (e.g. a WhatsApp link).</p>
              </div>

              {/* FEATURES SECTION */}
              <div className="mt-10 border-t border-zinc-200 pt-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Plan Features</h3>
                  <button 
                    onClick={handleAddFeature}
                    type="button"
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-md hover:bg-primary/20 font-semibold text-xs transition-colors border border-violet-200"
                  >
                    <Plus size={14} />
                    Add Feature
                  </button>
                </div>
                
                <div className="space-y-4">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg border border-zinc-200">
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Feature Title</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Everything in 3 months"
                          className="w-full px-3 py-2 bg-white border border-zinc-300 rounded focus:outline-none focus:border-primary text-sm"
                          value={feature.title}
                          onChange={e => handleFeatureChange(index, 'title', e.target.value)}
                        />
                      </div>
                      
                      <div className="w-48">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Icon</label>
                        <IconSelect 
                          value={feature.icon || 'badge-check'}
                          onChange={val => handleFeatureChange(index, 'icon', val)}
                        />
                      </div>

                      <div className="w-20">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Order</label>
                        <input 
                          type="number" 
                          className="w-full px-3 py-2 bg-white border border-zinc-300 rounded focus:outline-none focus:border-primary text-sm"
                          value={feature.displayOrder}
                          onChange={e => handleFeatureChange(index, 'displayOrder', Number(e.target.value))}
                        />
                      </div>

                      <button 
                        onClick={() => handleRemoveFeature(index)}
                        className="mt-6 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Remove Feature"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  
                  {formData.features.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <p className="text-sm text-gray-500">No features added yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-zinc-200 flex justify-end gap-3 bg-zinc-50 mt-auto">
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
                {isSaving ? 'Saving...' : (selectedPlan ? 'Save Changes' : 'Create Plan')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsConfirmOpen(false)}></div>
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 text-red-600">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Plan</h3>
            <p className="text-gray-500 text-sm mb-6">Are you sure you want to delete this plan? This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setIsConfirmOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={executeDelete} className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">Delete Plan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
