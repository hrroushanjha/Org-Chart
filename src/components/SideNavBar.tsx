import React from 'react';
import { NavTab } from '../types';

interface SideNavBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onCreateFromTemplate: () => void;
  onOpenHelp: () => void;
  onSignOut: () => void;
  chartTitle?: string;
  chartSubtitle?: string;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({
  activeTab,
  onTabChange,
  onCreateFromTemplate,
  onOpenHelp,
  onSignOut,
  chartTitle = 'Corporate Map',
  chartSubtitle = 'Global Operations'
}) => {
  return (
    <nav className="hidden md:flex flex-col h-full py-4 px-3 border-r border-[#c3c6d7] bg-[#eff4ff] w-[320px] shrink-0 overflow-y-auto select-none">
      {/* Organization Header */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-lg bg-[#2563eb] flex items-center justify-center text-[#eeefff] shadow-xs shrink-0">
          <span className="material-symbols-outlined text-[24px]">domain</span>
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-[#0b1c30] truncate">{chartTitle}</h2>
          <p className="text-xs font-medium text-[#434655] tracking-wide truncate">{chartSubtitle}</p>
        </div>
      </div>

      {/* Primary CTA: Create from Template */}
      <button
        onClick={onCreateFromTemplate}
        className="w-full bg-[#004ac6] text-white font-medium text-sm py-2 px-4 rounded-lg mb-6 hover:bg-[#003ea8] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        id="btn-create-template"
      >
        <span className="material-symbols-outlined text-[20px]">dashboard_customize</span>
        <span>Create from Template</span>
      </button>

      {/* Navigation items */}
      <div className="flex flex-col gap-1 flex-1">
        <button
          onClick={() => onTabChange('directory')}
          className={`w-full text-left rounded-lg px-3 py-2 flex items-center gap-3 text-sm font-medium transition-colors cursor-pointer ${
            activeTab === 'directory'
              ? 'bg-[#2563eb] text-white shadow-xs font-semibold'
              : 'text-[#434655] hover:bg-[#dce9ff]'
          }`}
          id="nav-directory"
        >
          <span className="material-symbols-outlined text-[20px]">account_tree</span>
          <span>Directory</span>
        </button>

        <button
          onClick={() => onTabChange('properties')}
          className={`w-full text-left rounded-lg px-3 py-2 flex items-center gap-3 text-sm font-medium transition-colors cursor-pointer ${
            activeTab === 'properties'
              ? 'bg-[#2563eb] text-white shadow-xs font-semibold'
              : 'text-[#434655] hover:bg-[#dce9ff]'
          }`}
          id="nav-properties"
        >
          <span className="material-symbols-outlined text-[20px]">edit_note</span>
          <span>Properties</span>
        </button>

        <button
          onClick={() => onTabChange('templates')}
          className={`w-full text-left rounded-lg px-3 py-2 flex items-center gap-3 text-sm font-medium transition-colors cursor-pointer ${
            activeTab === 'templates'
              ? 'bg-[#2563eb] text-white shadow-xs font-semibold'
              : 'text-[#434655] hover:bg-[#dce9ff]'
          }`}
          id="nav-templates"
        >
          <span className="material-symbols-outlined text-[20px]">dashboard</span>
          <span>Templates</span>
        </button>

        <button
          onClick={() => onTabChange('import')}
          className={`w-full text-left rounded-lg px-3 py-2 flex items-center gap-3 text-sm font-medium transition-colors cursor-pointer ${
            activeTab === 'import'
              ? 'bg-[#2563eb] text-white shadow-xs font-semibold'
              : 'text-[#434655] hover:bg-[#dce9ff]'
          }`}
          id="nav-import"
        >
          <span className="material-symbols-outlined text-[20px]">upload_file</span>
          <span>Import</span>
        </button>

        <button
          onClick={() => onTabChange('history')}
          className={`w-full text-left rounded-lg px-3 py-2 flex items-center gap-3 text-sm font-medium transition-colors cursor-pointer ${
            activeTab === 'history'
              ? 'bg-[#2563eb] text-white shadow-xs font-semibold'
              : 'text-[#434655] hover:bg-[#dce9ff]'
          }`}
          id="nav-history"
        >
          <span className="material-symbols-outlined text-[20px]">history</span>
          <span>History</span>
        </button>
      </div>

      {/* Bottom links: Help and Sign Out */}
      <div className="mt-auto pt-4 border-t border-[#c3c6d7] flex flex-col gap-1">
        <button
          onClick={onOpenHelp}
          className="w-full text-left text-[#434655] hover:bg-[#dce9ff] px-3 py-2 rounded-lg flex items-center gap-3 text-sm font-medium transition-colors cursor-pointer"
          id="nav-help"
        >
          <span className="material-symbols-outlined text-[20px]">help_outline</span>
          <span>Help</span>
        </button>

        <button
          onClick={onSignOut}
          className="w-full text-left text-[#434655] hover:bg-[#ffdad6] hover:text-[#ba1a1a] px-3 py-2 rounded-lg flex items-center gap-3 text-sm font-medium transition-colors cursor-pointer"
          id="nav-signout"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
};
