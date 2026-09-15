"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Eye, RefreshCw, Download, Calendar, X, ChevronDown, Trash2 } from 'lucide-react';
import { api } from '@/services/api';
import { fixImageUrl } from '@/lib/apiConfig';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';

// Interface matching the backend Prisma schema
interface Assessment {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  height: string;
  weight: string;
  email: string;
  phone: string;
  activityLevel: string;
  primaryGoal: string;
  experience: string;
  frequency: string;
  equipment: string;
  cardio: string;
  occupation: string;
  steps: string;
  sleep: string;
  stress: string;
  diet: string;
  meals: string;
  alcohol: string;
  tobacco: string;
  supplements?: string;
  conditions: string;
  medications: string;
  injuries: string;
  allergies: string;
  waist: string;
  commitmentLevel: number;
  notes?: string;
  status: 'NEW' | 'REVIEWING' | 'CONTACTED' | 'ACCEPTED' | 'REJECTED';
  bloodReportUrl?: string;
  physiqueImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const TABS = [
  { label: 'All' },
  { label: 'NEW' },
  { label: 'REVIEWING' },
  { label: 'CONTACTED' },
  { label: 'ACCEPTED' },
  { label: 'REJECTED' }
];

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState('Personal Details');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Delete Confirmation State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | string[] | null>(null);
  
  // Filter states
  const [dateFilter, setDateFilter] = useState('All Time');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [genderFilter, setGenderFilter] = useState('All');
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  
  // Full screen image state
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  const fetchAssessments = async () => {
    setIsLoading(true);
    try {
      // Fetch directly from the backend DB via API
      const response = await api.get('/assessments'); // Backend route is /api/assessments
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAssessments(data.data);
        } else if (Array.isArray(data)) {
          setAssessments(data);
        } else if (data.data && Array.isArray(data.data)) {
          setAssessments(data.data);
        } else {
          setAssessments([]);
        }
      } else {
        console.error("Failed to fetch assessments:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!selectedAssessment) return;
    try {
      const response = await api.patch(`/assessments/${selectedAssessment.id}`, { status: newStatus });
      if (response.ok) {
        setAssessments(assessments.map(a => 
          a.id === selectedAssessment.id ? { ...a, status: newStatus as Assessment['status'] } : a
        ));
        setSelectedAssessment({ ...selectedAssessment, status: newStatus as Assessment['status'] });
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const triggerSingleDelete = (id: string) => {
    setDeleteTarget(id);
    setIsConfirmOpen(true);
    setOpenDropdownId(null);
  };

  const triggerBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setDeleteTarget(selectedIds);
    setIsConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (Array.isArray(deleteTarget)) {
        // Bulk delete
        const response = await api.post('/assessments/bulk-delete', { ids: deleteTarget });
        if (response.ok) {
          setAssessments(assessments.filter(a => !deleteTarget.includes(a.id)));
          setSelectedIds([]);
        }
      } else {
        // Single delete
        const response = await api.delete(`/assessments/${deleteTarget}`);
        if (response.ok) {
          setAssessments(assessments.filter(a => a.id !== deleteTarget));
        }
      }
    } catch (error) {
      console.error("Failed to perform deletion", error);
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredAssessments.length && filteredAssessments.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAssessments.map(a => a.id));
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'NEW': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'REVIEWING': return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'CONTACTED': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'ACCEPTED': return 'bg-green-50 text-green-600 border-green-200';
      case 'REJECTED': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab, genderFilter, dateFilter]);

  // Filter logic
  const filteredAssessments = assessments.filter(assessment => {
    const fullName = `${assessment.firstName} ${assessment.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || 
                          assessment.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          assessment.phone.includes(searchQuery);
    
    const matchesTab = activeTab === 'All' || assessment.status === activeTab;
    
    let matchesGender = true;
    if (genderFilter !== 'All') {
      matchesGender = assessment.gender?.toLowerCase() === genderFilter.toLowerCase();
    }

    let matchesDate = true;
    if (dateFilter !== 'All Time' && assessment.createdAt) {
      const createdDate = new Date(assessment.createdAt);
      const now = new Date();
      if (dateFilter === 'Today') {
        matchesDate = createdDate.toDateString() === now.toDateString();
      } else if (dateFilter === 'Last 7 Days') {
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
        matchesDate = createdDate >= sevenDaysAgo;
      } else if (dateFilter === 'This Month') {
        matchesDate = createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
      }
    }
    
    return matchesSearch && matchesTab && matchesGender && matchesDate;
  });

  const totalPages = Math.max(1, Math.ceil(filteredAssessments.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAssessments = filteredAssessments.slice(startIndex, endIndex);

  const getTabCount = (tabName: string) => {
    if (tabName === 'All') return null;
    return assessments.filter(a => a.status === tabName).length;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleExport = () => {
    if (filteredAssessments.length === 0) {
      alert("No data to export");
      return;
    }
    
    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'Gender', 'Age', 'Status', 'Primary Goal', 'Created At'];
    
    const csvRows = [
      headers.join(','),
      ...filteredAssessments.map(a => [
        `"${a.firstName} ${a.lastName}"`,
        `"${a.email}"`,
        `"${a.phone}"`,
        `"${a.gender}"`,
        `"${a.age}"`,
        `"${a.status}"`,
        `"${a.primaryGoal}"`,
        `"${new Date(a.createdAt).toISOString()}"`
      ].join(','))
    ];
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `assessments_export_${new Date().getTime()}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <div>
      <div className="text-xs text-gray-500 mb-1 flex items-center gap-1.5">{icon} {label}</div>
      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg border border-zinc-200">{value || '-'}</div>
    </div>
  );

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Assessments</h1>
              <p className="text-gray-500 text-sm mt-1">Manage all form submissions from website</p>
            </div>
            <div className="flex items-center gap-3">
              {selectedIds.length > 0 && (
                <button 
                  onClick={triggerBulkDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700 hover:bg-red-100 font-medium text-sm shadow-sm transition-colors"
                >
                  <Trash2 size={16} />
                  Delete Selected ({selectedIds.length})
                </button>
              )}
              <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm shadow-sm transition-colors"
              >
                <Download size={16} />
                Export
              </button>
              <button 
                onClick={fetchAssessments}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary-hover font-medium text-sm shadow-sm transition-colors"
              >
                <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-2 overflow-x-auto pb-1 max-w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {TABS.map((tab) => {
              const count = getTabCount(tab.label);
              return (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(tab.label)}
                  className={`shrink-0 flex items-center px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    activeTab === tab.label 
                      ? 'bg-primary text-black border-primary' 
                      : 'bg-white text-gray-600 border-zinc-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="capitalize">{tab.label.toLowerCase()}</span>
                  {count !== null && count > 0 && (
                    <span className={`ml-2 px-1.5 py-0.5 rounded text-xs font-bold ${
                      activeTab === tab.label ? 'bg-primary/100 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-4 gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name, email, phone..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20/20 focus:border-primary transition-all text-sm"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <button 
                  onClick={() => { setShowFiltersDropdown(!showFiltersDropdown); setShowDateDropdown(false); }}
                  className={`flex items-center gap-2 px-4 py-2.5 bg-white border rounded-lg text-sm font-medium transition-colors ${genderFilter !== 'All' ? 'border-violet-500 text-primary bg-primary/10' : 'border-zinc-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  <Filter size={16} />
                  Filters {genderFilter !== 'All' && '(1)'}
                </button>
                {showFiltersDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowFiltersDropdown(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-zinc-200 rounded-xl shadow-lg z-20 p-3">
                      <div className="text-xs font-bold text-gray-500 uppercase mb-2">Gender</div>
                      <div className="space-y-1">
                        {['All', 'Male', 'Female', 'Other'].map(g => (
                          <button
                            key={g}
                            onClick={() => { setGenderFilter(g); setShowFiltersDropdown(false); }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${genderFilter === g ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => { setShowDateDropdown(!showDateDropdown); setShowFiltersDropdown(false); }}
                  className={`flex items-center gap-2 px-4 py-2.5 bg-white border rounded-lg text-sm font-medium transition-colors ${dateFilter !== 'All Time' ? 'border-violet-500 text-primary bg-primary/10' : 'border-zinc-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  <Calendar size={18} />
                  {dateFilter !== 'All Time' ? dateFilter : ''}
                </button>
                {showDateDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowDateDropdown(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-zinc-200 rounded-xl shadow-lg z-20 p-2">
                      <div className="space-y-1">
                        {['All Time', 'Today', 'Last 7 Days', 'This Month'].map(range => (
                          <button
                            key={range}
                            onClick={() => { setDateFilter(range); setShowDateDropdown(false); }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${dateFilter === range ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                          >
                            {range}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-zinc-200 flex flex-col min-h-0 flex-1">
            <div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10 shadow-sm">
                <tr className="border-b border-zinc-200 bg-gray-50">
                  <th className="py-4 pl-6 pr-2 w-10">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
                      checked={filteredAssessments.length > 0 && selectedIds.length === filteredAssessments.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm w-12">#</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Name</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Email</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Phone</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Primary Goal</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Status</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Submitted At</th>
                  <th className="py-4 px-6 font-semibold text-gray-900 text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={8} className="py-12 text-center text-gray-500">Loading assessments from database...</td></tr>
                ) : currentAssessments.length === 0 ? (
                  <tr><td colSpan={8} className="py-12 text-center text-gray-500">No assessments found.</td></tr>
                ) : (
                  currentAssessments.map((item, index) => (
                    <tr key={item.id} className={`border-b border-zinc-200 hover:bg-zinc-50 transition-colors ${selectedIds.includes(item.id) ? 'bg-primary/10/40' : ''}`}>
                      <td className="py-4 pl-6 pr-2">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => toggleSelectOne(item.id)}
                        />
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">{startIndex + index + 1}</td>
                      <td className="py-4 px-6 text-sm text-gray-900 font-medium">{item.firstName} {item.lastName}</td>
                      <td className="py-4 px-6 text-sm text-gray-500"><a href={`mailto:${item.email}`} className="hover:text-primary hover:underline transition-colors">{item.email}</a></td>
                      <td className="py-4 px-6 text-sm text-gray-500"><a href={`tel:${item.phone}`} className="hover:text-primary hover:underline transition-colors">{item.phone}</a></td>
                      <td className="py-4 px-6 text-sm text-gray-500 capitalize">{item.primaryGoal}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider border ${getStatusStyle(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">{formatDate(item.createdAt)}</td>
                      <td className="py-4 px-6 relative">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setSelectedAssessment(item)}
                            className="p-1.5 text-gray-400 hover:text-primary border border-zinc-300 rounded hover:border-violet-200 hover:bg-primary/10 transition-all"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          
                          <div className="relative">
                            <button 
                              onClick={() => setOpenDropdownId(openDropdownId === item.id ? null : item.id)}
                              className="p-1.5 text-gray-400 hover:text-gray-700 border border-zinc-300 rounded hover:bg-gray-50 transition-all"
                            >
                              <MoreVertical size={16} />
                            </button>
                            
                            {openDropdownId === item.id && (
                              <>
                                <div 
                                  className="fixed inset-0 z-10" 
                                  onClick={() => setOpenDropdownId(null)}
                                ></div>
                                <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-zinc-200 z-20 py-1">
                                  <button 
                                    onClick={() => triggerSingleDelete(item.id)}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                  >
                                    <Trash2 size={14} /> Delete
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
            
            {/* Pagination */}
            {!isLoading && filteredAssessments.length > 0 && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-zinc-200 bg-white sticky bottom-0">
                <div className="text-sm font-medium text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-1 items-center">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center border border-zinc-300 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >&lt;</button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button 
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 flex items-center justify-center border rounded font-medium ${
                        currentPage === page 
                          ? 'border-primary bg-primary text-black' 
                          : 'border-zinc-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center border border-zinc-300 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >&gt;</button>
                </div>
              </div>
            )}
          </div>

      {/* Centered Modal Panel */}
      {selectedAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedAssessment(null)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Panel Header */}
            <div className="px-8 pt-6 pb-4 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold text-gray-900">Assessment Details</h2>
              <button 
                onClick={() => setSelectedAssessment(null)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
              {/* Profile Section */}
              <div className="px-8 pb-6 border-b border-zinc-200 shrink-0">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex gap-4 items-start sm:items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 shrink-0">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="text-lg font-bold text-gray-900">{selectedAssessment.firstName} {selectedAssessment.lastName}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border ${getStatusStyle(selectedAssessment.status)}`}>
                          {selectedAssessment.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> <a href={`mailto:${selectedAssessment.email}`} className="hover:text-primary hover:underline transition-colors">{selectedAssessment.email}</a></div>
                        <div className="flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> <a href={`tel:${selectedAssessment.phone}`} className="hover:text-primary hover:underline transition-colors">{selectedAssessment.phone}</a></div>
                        <div className="flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> Submitted At: {formatDate(selectedAssessment.createdAt)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="relative pt-2 shrink-0">
                    <select 
                      className="appearance-none bg-white border border-zinc-300 rounded-lg pl-4 pr-10 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:border-primary cursor-pointer shadow-sm capitalize"
                      value={selectedAssessment.status}
                      onChange={(e) => updateStatus(e.target.value)}
                    >
                      <option value="NEW">New</option>
                      <option value="REVIEWING">Reviewing</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="ACCEPTED">Accepted</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none mt-1" />
                  </div>
                </div>
              </div>

              {/* Detail Tabs */}
              <div className="px-8 flex gap-6 overflow-x-auto border-b border-zinc-200 shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {['Personal Details', 'Goals', 'Lifestyle', 'Health', 'Attachments'].map(tab => {
                  const mappedTab = tab === 'Health' ? 'Medical & Notes' : tab; // Internal mapping if needed
                  return (
                    <button 
                      key={tab}
                      onClick={() => setActiveDetailTab(mappedTab)}
                      className={`py-4 text-sm font-bold border-b-[3px] whitespace-nowrap transition-colors ${
                        (activeDetailTab === mappedTab)
                          ? 'border-primary text-primary' 
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              {/* Detail Content */}
              <div className="p-4 sm:p-8 flex-1 overflow-y-auto min-h-0">
                {activeDetailTab === 'Personal Details' && (
                  <div className="border border-zinc-300 rounded-2xl p-6">
                    <h4 className="text-sm font-bold text-gray-900 mb-5">Personal Information</h4>
                    <div className="grid grid-cols-2 gap-y-6 gap-x-8 mb-8">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Full Name</div>
                        <div className="text-sm text-gray-900">{selectedAssessment.firstName} {selectedAssessment.lastName}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Gender</div>
                        <div className="text-sm text-gray-900 capitalize">{selectedAssessment.gender}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Email</div>
                        <div className="text-sm text-gray-900"><a href={`mailto:${selectedAssessment.email}`} className="hover:text-primary hover:underline transition-colors">{selectedAssessment.email}</a></div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Location</div>
                        <div className="text-sm text-gray-900">Delhi, India</div> {/* Hardcoded placeholder based on design */}
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Phone</div>
                        <div className="text-sm text-gray-900"><a href={`tel:${selectedAssessment.phone}`} className="hover:text-primary hover:underline transition-colors">{selectedAssessment.phone}</a></div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Occupation</div>
                        <div className="text-sm text-gray-900 capitalize">{selectedAssessment.occupation}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Age</div>
                        <div className="text-sm text-gray-900">{selectedAssessment.age} yrs</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Emergency Contact</div>
                        <div className="text-sm text-gray-900">Not Provided</div>
                      </div>
                    </div>

                    <div className="border-t border-zinc-200 pt-6">
                      <h4 className="text-sm font-bold text-gray-900 mb-5">Health Snapshot</h4>
                      <div className="grid grid-cols-4 gap-6">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Height</div>
                          <div className="text-sm text-gray-900">{selectedAssessment.height} cm</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Weight</div>
                          <div className="text-sm text-gray-900">{selectedAssessment.weight} kg</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Waist</div>
                          <div className="text-sm text-gray-900">{selectedAssessment.waist ? `${selectedAssessment.waist} cm` : 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Commitment</div>
                          <div className="text-sm text-gray-900">{selectedAssessment.commitmentLevel} / 10</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeDetailTab === 'Goals' && (
                  <div className="border border-zinc-300 rounded-2xl p-6">
                    <h4 className="text-sm font-bold text-gray-900 mb-5">Fitness Goals</h4>
                    <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Primary Goal</div>
                        <div className="text-sm text-gray-900 capitalize">{selectedAssessment.primaryGoal}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Experience Level</div>
                        <div className="text-sm text-gray-900 capitalize">{selectedAssessment.experience}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Commitment Level</div>
                        <div className="text-sm text-gray-900">{selectedAssessment.commitmentLevel} / 10</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Workout Frequency</div>
                        <div className="text-sm text-gray-900 capitalize">{selectedAssessment.frequency}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Available Equipment</div>
                        <div className="text-sm text-gray-900 capitalize">{selectedAssessment.equipment}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Cardio Preference</div>
                        <div className="text-sm text-gray-900 capitalize">{selectedAssessment.cardio}</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeDetailTab === 'Lifestyle' && (
                  <div className="border border-zinc-300 rounded-2xl p-6">
                    <h4 className="text-sm font-bold text-gray-900 mb-5">Lifestyle & Habits</h4>
                    <div className="grid grid-cols-2 gap-y-6 gap-x-8 mb-8">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Activity Level</div>
                        <div className="text-sm text-gray-900 capitalize">{selectedAssessment.activityLevel}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Daily Steps</div>
                        <div className="text-sm text-gray-900 capitalize">{selectedAssessment.steps} steps</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Sleep Quality / Hours</div>
                        <div className="text-sm text-gray-900 capitalize">{selectedAssessment.sleep} hrs</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Stress Levels</div>
                        <div className="text-sm text-gray-900 capitalize">{selectedAssessment.stress}</div>
                      </div>
                    </div>
                    
                    <div className="border-t border-zinc-200 pt-6">
                      <h4 className="text-sm font-bold text-gray-900 mb-5">Nutrition</h4>
                      <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Current Diet</div>
                          <div className="text-sm text-gray-900 capitalize">{selectedAssessment.diet}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Daily Meals</div>
                          <div className="text-sm text-gray-900 capitalize">{selectedAssessment.meals}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Alcohol</div>
                          <div className="text-sm text-gray-900 capitalize">{selectedAssessment.alcohol}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Tobacco</div>
                          <div className="text-sm text-gray-900 capitalize">{selectedAssessment.tobacco}</div>
                        </div>
                        {selectedAssessment.supplements && (
                          <div className="col-span-2">
                            <div className="text-xs text-gray-500 mb-1">Supplements</div>
                            <div className="text-sm text-gray-900 capitalize">{selectedAssessment.supplements}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeDetailTab === 'Medical & Notes' && (
                  <div className="flex flex-col gap-6">
                    <div className="border border-zinc-300 rounded-2xl p-6">
                      <h4 className="text-sm font-bold text-gray-900 mb-5">Medical History</h4>
                      <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Medical Conditions</div>
                          <div className="text-sm text-gray-900">{selectedAssessment.conditions}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Current Medications</div>
                          <div className="text-sm text-gray-900">{selectedAssessment.medications}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Past Injuries</div>
                          <div className="text-sm text-gray-900">{selectedAssessment.injuries}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Allergies</div>
                          <div className="text-sm text-gray-900">{selectedAssessment.allergies}</div>
                        </div>
                      </div>
                    </div>
                    
                    {selectedAssessment.notes && (
                      <div className="border border-yellow-200 bg-yellow-50 rounded-2xl p-6">
                        <h4 className="text-sm font-bold text-yellow-800 mb-2">Additional Notes</h4>
                        <p className="text-sm text-yellow-900 leading-relaxed">{selectedAssessment.notes}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeDetailTab === 'Attachments' && (
                  <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-2xl border border-zinc-300 shadow-sm">
                        <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                          Physique Image
                        </h4>
                        {selectedAssessment.physiqueImageUrl ? (
                          <button 
                            type="button"
                            onClick={() => setFullScreenImage(selectedAssessment.physiqueImageUrl || null)}
                            className="relative block aspect-square w-full rounded-xl overflow-hidden border border-zinc-200 hover:opacity-90 transition-opacity"
                            title="Click to view full size"
                          >
                            <img src={fixImageUrl(selectedAssessment.physiqueImageUrl)} alt="Physique" className="object-cover w-full h-full" />
                          </button>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <span className="text-sm text-gray-500">No image uploaded</span>
                          </div>
                        )}
                      </div>

                      <div className="bg-white p-6 rounded-2xl border border-zinc-300 shadow-sm">
                        <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                          Blood Report
                        </h4>
                        {selectedAssessment.bloodReportUrl ? (
                          <div className="flex flex-col items-center justify-center h-48 bg-primary/10 rounded-xl border border-violet-100 p-6 text-center">
                            <span className="text-sm font-medium text-violet-900 mb-1">Report Uploaded</span>
                            <a href={selectedAssessment.bloodReportUrl} target="_blank" rel="noopener noreferrer" className="mt-4 px-5 py-2.5 bg-primary text-black text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors shadow-sm">
                              View / Download PDF
                            </a>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <span className="text-sm text-gray-500">No report uploaded</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
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

      {/* Full Screen Image Modal */}
      {fullScreenImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200">
          <button 
            onClick={() => setFullScreenImage(null)}
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-all"
            title="Close image"
          >
            <X size={24} />
          </button>
          <img 
            src={fixImageUrl(fullScreenImage)} 
            alt="Full size physique" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
