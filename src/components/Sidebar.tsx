import React from 'react';
import { LayoutDashboard, FileText, ClipboardCheck, ShieldCheck, UserCheck, FileSignature } from 'lucide-react';
import { Section } from '../types';

interface SidebarProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'info', label: 'Info & Details', icon: LayoutDashboard },
    { id: 'demand', label: 'Demand Form', icon: FileText },
    { id: 'undertaking1', label: 'Undertaking 1', icon: ClipboardCheck },
    { id: 'undertaking2', label: 'Undertaking 2', icon: ShieldCheck },
    { id: 'permission', label: 'Permission Form', icon: FileSignature },
    { id: 'declaration', label: 'Declaration', icon: UserCheck },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col no-print">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6" />
          RecruitPro
        </h1>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold">SaaS Dashboard</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as Section)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeSection === item.id
                  ? 'bg-blue-50 text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${activeSection === item.id ? 'text-blue-600' : 'text-gray-400'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm text-gray-700">System Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
