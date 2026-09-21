import React, { useState } from 'react';
import { Template } from '../types';
import { TEMPLATES, ASSET_IMAGES } from '../data/initialData';

interface TemplatesScreenProps {
  onSelectTemplate: (template: Template | null) => void;
  onBackToEditor: () => void;
  onOpenDirectory: () => void;
  onOpenHistory: () => void;
  onOpenHelp: () => void;
  onSignOut: () => void;
}

export const TemplatesScreen: React.FC<TemplatesScreenProps> = ({
  onSelectTemplate,
  onBackToEditor,
  onOpenDirectory,
  onOpenHistory,
  onOpenHelp,
  onSignOut,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All Templates');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filterCategories = ['All Templates', 'Enterprise', 'Startup', 'Education', 'Healthcare'];

  const filteredTemplates = TEMPLATES.filter((tpl) => {
    const matchesCategory =
      selectedFilter === 'All Templates' ||
      tpl.category.toLowerCase() === selectedFilter.toLowerCase() ||
      (selectedFilter === 'Enterprise' && tpl.category === 'Agile');
    const matchesSearch =
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f9ff] text-[#0b1c30] antialiased">
      {/* SideNavBar (Screen 3 specific variant) */}
      <aside className="hidden md:flex flex-col h-screen w-[320px] bg-[#eff4ff] p-4 gap-2 shrink-0 sticky top-0 border-r border-[#c3c6d7]/30">
        {/* Header with Enterprise tier mark */}
        <div className="flex items-center gap-3 mb-6 px-2 pt-2">
          <div className="w-10 h-10 rounded-full bg-[#2563eb] flex items-center justify-center shrink-0 overflow-hidden text-white font-bold text-lg shadow-sm">
            <img
              src={ASSET_IMAGES.companyLogo}
              alt="OrgGraph Pro Enterprise"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-base font-bold text-[#0b1c30] truncate">Global Operations</span>
            <span className="text-xs font-medium text-[#434655]">Enterprise Tier</span>
          </div>
        </div>

        {/* CTA: New Chart */}
        <button
          onClick={() => onSelectTemplate(null)}
          className="w-full bg-[#004ac6] text-white rounded-lg py-2 px-4 flex items-center justify-center gap-2 hover:bg-[#2563eb] active:scale-[0.99] transition-all mb-6 shadow-sm text-sm font-semibold h-10 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>New Chart</span>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex-1 flex flex-col gap-1">
          <button
            onClick={onBackToEditor}
            className="text-[#434655] hover:bg-[#dce9ff] transition-all rounded-lg p-2.5 flex items-center gap-3 text-sm font-medium w-full text-left cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">account_tree</span>
            <span>Hierarchy</span>
          </button>

          <button
            onClick={onOpenDirectory}
            className="text-[#434655] hover:bg-[#dce9ff] transition-all rounded-lg p-2.5 flex items-center gap-3 text-sm font-medium w-full text-left cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">groups</span>
            <span>Directory</span>
          </button>

          {/* Active Tab: Templates */}
          <button
            className="bg-[#645efb] text-white rounded-lg font-semibold p-2.5 flex items-center gap-3 text-sm shadow-xs w-full text-left"
          >
            <span className="material-symbols-outlined filled text-[20px]">dashboard_customize</span>
            <span>Templates</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="text-[#434655] hover:bg-[#dce9ff] transition-all rounded-lg p-2.5 flex items-center gap-3 text-sm font-medium w-full text-left cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">history</span>
            <span>History</span>
          </button>
        </nav>

        {/* Footer Tabs */}
        <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-[#c3c6d7]/30">
          <button
            onClick={onOpenHelp}
            className="text-[#434655] hover:bg-[#dce9ff] transition-all rounded-lg p-2.5 flex items-center gap-3 text-sm font-medium w-full text-left cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">help</span>
            <span>Help</span>
          </button>

          <button
            onClick={onSignOut}
            className="text-[#434655] hover:bg-[#ffdad6] hover:text-[#ba1a1a] transition-all rounded-lg p-2.5 flex items-center gap-3 text-sm font-medium w-full text-left cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full h-screen overflow-y-auto bg-white">
        {/* Top Header */}
        <header className="bg-[#f8f9ff] shadow-xs flex justify-between items-center px-6 w-full h-16 sticky top-0 z-10 shrink-0 border-b border-[#c3c6d7]/30">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={onBackToEditor}
              className="text-[#004ac6] font-bold text-lg md:hidden flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              <span>OrgGraph Pro</span>
            </button>

            {/* Search Bar */}
            <div className="hidden md:flex relative max-w-md w-full ml-4">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737686] text-[20px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#eff4ff] border border-[#c3c6d7] rounded-full py-2 pl-10 pr-4 text-sm text-[#0b1c30] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] transition-all"
              />
            </div>
          </div>

          {/* Trailing Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToEditor}
              className="p-2 text-[#434655] hover:bg-[#eff4ff] hover:text-[#004ac6] transition-colors rounded-full cursor-pointer"
              title="Return to Canvas"
            >
              <span className="material-symbols-outlined text-[20px]">schema</span>
            </button>

            <button
              className="p-2 text-[#434655] hover:bg-[#eff4ff] hover:text-[#004ac6] transition-colors rounded-full cursor-pointer"
              title="Share"
            >
              <span className="material-symbols-outlined text-[20px]">share</span>
            </button>

            <button
              className="p-2 text-[#434655] hover:bg-[#eff4ff] hover:text-[#004ac6] transition-colors rounded-full cursor-pointer"
              title="Settings"
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </button>

            <div className="w-8 h-8 rounded-full overflow-hidden ml-2 border border-[#c3c6d7] shadow-xs cursor-pointer">
              <img
                src={ASSET_IMAGES.userProfile2}
                alt="User Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <div className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[#0b1c30] mb-2">
              Create New Chart
            </h1>
            <p className="text-base text-[#434655] max-w-2xl">
              Start fresh or accelerate your workflow with a professionally structured organizational
              template.
            </p>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden relative w-full mb-6">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737686] text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#eff4ff] border border-[#c3c6d7] rounded-full py-2.5 pl-10 pr-4 text-sm text-[#0b1c30] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] transition-all"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            {filterCategories.map((category) => {
              const isActive = selectedFilter === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedFilter(category)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#2563eb] text-white border border-transparent shadow-xs'
                      : 'bg-[#f8f9ff] text-[#434655] border border-[#c3c6d7] hover:bg-[#eff4ff]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Start from Scratch Card */}
            <div
              onClick={() => onSelectTemplate(null)}
              className="bg-white border border-dashed border-[#737686] rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#004ac6] hover:bg-[#eff4ff]/50 transition-all min-h-[280px] group shadow-xs"
            >
              <div className="w-16 h-16 rounded-full bg-[#d3e4fe] flex items-center justify-center text-[#004ac6] mb-4 group-hover:scale-110 group-hover:bg-[#2563eb] group-hover:text-white transition-all shadow-xs">
                <span className="material-symbols-outlined text-[32px]">add</span>
              </div>
              <h3 className="text-lg font-semibold text-[#0b1c30] mb-1">Start from Scratch</h3>
              <p className="text-sm text-[#434655] mb-4">
                Build a custom hierarchy node by node on a blank canvas.
              </p>
            </div>

            {/* Template Cards */}
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className="bg-white border border-[#c3c6d7] rounded-xl p-6 flex flex-col cursor-pointer transition-all min-h-[280px] hover:border-[#004ac6] hover:shadow-[0_10px_25px_rgba(15,23,42,0.08)] group"
              >
                <div className="w-12 h-12 rounded-lg bg-[#eaf1ff] flex items-center justify-center text-[#004ac6] mb-4 group-hover:bg-[#004ac6] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[24px]">{template.icon}</span>
                </div>

                <h3 className="text-lg font-semibold text-[#0b1c30] mb-1 group-hover:text-[#004ac6] transition-colors">
                  {template.title}
                </h3>
                <p className="text-sm text-[#434655] mb-6 flex-1">{template.description}</p>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#c3c6d7]/40">
                  <span className="text-xs font-medium text-[#737686] px-2.5 py-1 bg-[#e5eeff] rounded">
                    {template.tag}
                  </span>
                  <span className="text-[#004ac6] text-xs font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Use Template <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
