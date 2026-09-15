"use client";

import { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  GripVertical, 
  Save, 
  AlertCircle, 
  LayoutGrid,
  Home,
  Info,
  Users,
  BarChart2,
  Dumbbell,
  Settings,
  Crown,
  Image as ImageIcon,
  Mail,
  MoreVertical
} from 'lucide-react';

// Define the interface based on what backend returns
interface PageSection {
  id: string;
  sectionId: string;
  title: string;
  order: number;
  isActive: boolean;
}

// Icon mapping based on sectionId
const getSectionIconInfo = (sectionId: string) => {
  const map: Record<string, { icon: any, color: string, bg: string }> = {
    home: { icon: Home, color: 'text-blue-500', bg: 'bg-blue-50' },
    about: { icon: Info, color: 'text-green-500', bg: 'bg-green-50' },
    coaches: { icon: Users, color: 'text-pink-500', bg: 'bg-pink-50' },
    transformations: { icon: BarChart2, color: 'text-purple-500', bg: 'bg-purple-50' },
    programs: { icon: Dumbbell, color: 'text-orange-500', bg: 'bg-orange-50' },
    services: { icon: Settings, color: 'text-blue-400', bg: 'bg-blue-50' },
    membership: { icon: Crown, color: 'text-rose-500', bg: 'bg-rose-50' },
    gallery: { icon: ImageIcon, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    contact: { icon: Mail, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  };
  return map[sectionId.toLowerCase()] || { icon: LayoutGrid, color: 'text-gray-500', bg: 'bg-gray-100' };
};

// Sub-component for individual sortable item
function SortableItem({ section, onTitleChange, onToggleActive }: { 
  section: PageSection, 
  onTitleChange: (id: string, newTitle: string) => void,
  onToggleActive: (id: string, currentStatus: boolean) => void 
}) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  const { icon: Icon, color, bg } = getSectionIconInfo(section.sectionId);

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`group flex items-center gap-4 px-4 py-3 mb-3 rounded-xl border ${
        isDragging ? 'bg-white border-yellow-400 shadow-[0_4px_20px_rgba(0,0,0,0.1)] scale-[1.02]' : 'bg-white border-gray-100 shadow-sm'
      } transition-all duration-300 relative`}
    >
      {/* Drag Handle */}
      <button 
        className="p-2 cursor-grab active:cursor-grabbing bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-colors touch-none"
        {...attributes} 
        {...listeners}
      >
        <GripVertical size={16} />
      </button>

      {/* Section Icon */}
      <div className={`p-2.5 rounded-xl ${bg} ${color}`}>
        <Icon size={20} strokeWidth={2.5} />
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4">
        {/* Badge */}
        <div className="text-[10px] font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg hidden md:block uppercase tracking-wider text-center min-w-[120px]">
          {section.sectionId}
        </div>
        
        {/* Title Input */}
        <div className="flex-1 relative">
          <input 
            type="text"
            value={section.title}
            onChange={(e) => onTitleChange(section.id, e.target.value)}
            className="w-full bg-transparent text-gray-900 text-sm font-bold uppercase tracking-wider px-2 py-1 outline-none transition-colors border-b border-transparent focus:border-gray-200"
            placeholder="Enter Menu Label"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-6 pr-2">
        
        {/* Toggle Switch */}
        <div className="flex items-center gap-3">
          <span className={`text-[11px] font-bold tracking-widest uppercase transition-colors ${section.isActive ? 'text-yellow-500' : 'text-gray-400'}`}>
            {section.isActive ? 'Visible' : 'Hidden'}
          </span>
          <button
            onClick={() => onToggleActive(section.id, section.isActive)}
            className={`w-[46px] h-[26px] rounded-full relative transition-colors duration-300 ${
              section.isActive ? 'bg-yellow-400' : 'bg-gray-200'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white absolute top-[3px] transition-all duration-300 shadow-sm ${
              section.isActive ? 'left-[23px]' : 'left-[3px]'
            }`} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PageStructureAdmin() {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  // Configure Sensors: 
  // - Mouse/Desktop: No delay (instant drag)
  // - Touch/Mobile: 1000ms (1 second) delay for a proper "long press"
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 1000, 
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/page-structure`);
      const data = await res.json();
      if (data.success) {
        setSections(data.data);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        
        // Reorder array
        const reorderedItems = arrayMove(items, oldIndex, newIndex);
        
        // Update order numbers
        return reorderedItems.map((item, index) => ({
          ...item,
          order: index + 1
        }));
      });
    }
  };

  const handleTitleChange = (id: string, newTitle: string) => {
    setSections(items => items.map(item => 
      item.id === id ? { ...item, title: newTitle } : item
    ));
  };

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    setSections(items => items.map(item => 
      item.id === id ? { ...item, isActive: !currentStatus } : item
    ));
  };

  const saveChanges = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/page-structure/bulk-update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({ sections })
      });
      
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Page structure updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (isLoading) return <div className="p-10 text-gray-500 font-semibold">Loading sections...</div>;

  return (
    <div className="flex flex-col h-full gap-4">
      
      {/* Header Area */}
      <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="bg-yellow-50 text-yellow-500 p-3 rounded-xl">
            <LayoutGrid size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Website Layout Builder</h1>
            <p className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
              <AlertCircle size={14} className="text-yellow-500" fill="currentColor" />
              <span className="text-gray-400">Drag and drop sections to reorder your homepage layout. Toggle visibility to hide sections.</span>
            </p>
          </div>
        </div>
        
        <button
          onClick={saveChanges}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#ffb700] text-black px-6 py-3 rounded-lg font-bold text-sm tracking-wider uppercase hover:bg-[#e5a400] transition-colors disabled:opacity-50 shadow-md shadow-yellow-500/20"
        >
          <Save size={18} strokeWidth={2.5} />
          {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
        </button>
      </div>

      {message && (
        <div className={`shrink-0 p-4 rounded-xl text-sm font-bold ${
          message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Main List Area */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-[#fcfcfd] border border-gray-100 p-6 rounded-2xl shadow-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={sections.map(s => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {sections.map((section) => (
              <SortableItem 
                key={section.id} 
                section={section} 
                onTitleChange={handleTitleChange}
                onToggleActive={handleToggleActive}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
