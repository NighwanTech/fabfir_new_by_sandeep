"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, TrendingUp, AlertCircle, CheckSquare, Trash } from 'lucide-react';
import { api } from '@/services/api';
import CounterFormModal from './CounterFormModal';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';

interface Counter {
  id: string;
  label: string;
  value: string;
  suffix: string | null;
  icon: string | null;
  status: string;
  displayOrder: number;
}

export default function CountersPage() {
  const [counters, setCounters] = useState<Counter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<Counter | null>(null);
  
  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Delete Confirmation State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | string[] | null>(null);

  const fetchCounters = async () => {
    setLoading(true);
    try {
      const res = await api.get('/counters');
      const data = await res.json();
      if (data.success) {
        setCounters(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch counters:', error);
    } finally {
      setLoading(false);
      setSelectedIds([]); // Clear selection on refresh
    }
  };

  useEffect(() => {
    fetchCounters();
  }, []);

  const handleAdd = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (counter: Counter) => {
    setEditData(counter);
    setIsModalOpen(true);
  };

  // Selection Logic
  const toggleSelectAll = () => {
    if (selectedIds.length === counters.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(counters.map(c => c.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Delete Action Triggers (Opens Modal)
  const triggerSingleDelete = (id: string) => {
    setDeleteTarget(id);
    setIsConfirmOpen(true);
  };

  const triggerBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setDeleteTarget(selectedIds);
    setIsConfirmOpen(true);
  };

  // Actual Delete Logic (After Confirmation)
  const executeDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (Array.isArray(deleteTarget)) {
        // Bulk delete
        await api.post('/counters/bulk-delete', { ids: deleteTarget });
      } else {
        // Single delete
        await api.delete(`/counters/${deleteTarget}`);
      }
      fetchCounters();
    } catch (error) {
      console.error('Failed to delete counter(s):', error);
      alert('Failed to delete counter(s).');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="text-primary" />
            Counters
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage homepage statistics and metrics</p>
        </div>
        
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <button 
              onClick={triggerBulkDelete}
              className="inline-flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
            >
              <Trash size={16} />
              Delete Selected ({selectedIds.length})
            </button>
          )}
          <button 
            onClick={handleAdd}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-black px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm"
          >
            <Plus size={18} />
            Add Counter
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-4 w-12">
                  <div className="flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-violet-600"
                      checked={counters.length > 0 && selectedIds.length === counters.length}
                      onChange={toggleSelectAll}
                      disabled={counters.length === 0}
                    />
                  </div>
                </th>
                <th className="px-6 py-4">Label</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Suffix</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex justify-center mb-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    Loading counters...
                  </td>
                </tr>
              ) : counters.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                    No counters found. Add one to get started!
                  </td>
                </tr>
              ) : (
                counters.map((counter, index) => {
                  const isSelected = selectedIds.includes(counter.id);
                  return (
                    <tr key={counter.id} className={`hover:bg-slate-50/50 transition-colors ${isSelected ? 'bg-primary/10/30' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-violet-600"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(counter.id)}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">{counter.label}</td>
                      <td className="px-6 py-4 font-semibold text-primary">{counter.value}</td>
                      <td className="px-6 py-4 text-slate-500">{counter.suffix || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                          ${counter.status === 'ACTIVE' ? 'bg-primarymerald-50 text-emerald-700 border-emerald-200' : 
                            counter.status === 'DRAFT' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                            'bg-slate-100 text-slate-700 border-slate-200'}`}
                        >
                          {counter.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(counter)}
                            className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => triggerSingleDelete(counter.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CounterFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCounters}
        editData={editData}
      />

      <ConfirmDeleteModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={executeDelete}
        itemCount={Array.isArray(deleteTarget) ? deleteTarget.length : 1}
      />
    </div>
  );
}
