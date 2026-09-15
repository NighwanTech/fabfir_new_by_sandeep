import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { api } from '@/services/api';
import { IconSelect } from '@/components/ui/IconSelect';

interface Counter {
  id: string;
  label: string;
  value: string;
  suffix: string | null;
  icon: string | null;
  status: string;
  displayOrder: number;
}

interface CounterFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData: Counter | null;
}

export default function CounterFormModal({ isOpen, onClose, onSuccess, editData }: CounterFormModalProps) {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    label: '',
    value: '',
    suffix: '',
    icon: '',
    status: 'ACTIVE',
    displayOrder: 1,
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        label: editData.label,
        value: editData.value,
        suffix: editData.suffix || '',
        icon: editData.icon || '',
        status: editData.status,
        displayOrder: editData.displayOrder,
      });
    } else {
      setFormData({
        label: '',
        value: '',
        suffix: '',
        icon: '',
        status: 'ACTIVE',
        displayOrder: 1,
      });
    }
  }, [editData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'displayOrder' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editData) {
        await api.put(`/counters/${editData.id}`, formData);
      } else {
        await api.post('/counters', formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving counter:', error);
      alert('Failed to save counter. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[95vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
          <h2 className="text-xl font-semibold text-slate-800">
            {editData ? 'Edit Counter' : 'Add New Counter'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Label</label>
            <input 
              type="text" 
              name="label"
              value={formData.label}
              onChange={handleChange}
              placeholder="e.g., Clients Transformed"
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Value</label>
              <input 
                type="text" 
                name="value"
                value={formData.value}
                onChange={handleChange}
                placeholder="e.g., 500"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Suffix (Optional)</label>
              <input 
                type="text" 
                name="suffix"
                value={formData.suffix}
                onChange={handleChange}
                placeholder="e.g., +"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
              />
            </div>
          </div>

          {/* Custom Icon Dropdown */}
          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Icon *</label>
            <IconSelect 
              value={formData.icon} 
              onChange={(val) => setFormData({...formData, icon: val})} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Display Order</label>
              <input 
                type="number" 
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium text-black bg-primary hover:bg-primary-hover rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? 'Saving...' : (editData ? 'Update Counter' : 'Save Counter')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
