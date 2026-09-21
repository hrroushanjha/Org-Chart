import React, { useState } from 'react';
import { OrgNode } from '../types';

interface DirectoryModalProps {
  nodes: OrgNode[];
  onClose: () => void;
  onSelectNode: (node: OrgNode) => void;
  onAddNode: () => void;
}

export const DirectoryModal: React.FC<DirectoryModalProps> = ({
  nodes,
  onClose,
  onSelectNode,
  onAddNode,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  const departments = ['All', ...Array.from(new Set(nodes.map((n) => n.department)))];

  const filteredNodes = nodes.filter((n) => {
    const matchesDept = deptFilter === 'All' || n.department === deptFilter;
    const matchesSearch =
      n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-[#c3c6d7] max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#f8f9ff] border-b border-[#c3c6d7] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[24px]">account_tree</span>
            <div>
              <h3 className="text-base font-bold text-[#0b1c30]">Organization Directory</h3>
              <p className="text-xs text-[#434655]">Total Members: {nodes.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onAddNode();
              }}
              className="bg-[#004ac6] text-white text-xs font-medium px-3 py-1.5 rounded-md hover:bg-[#003ea8] transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Add Member</span>
            </button>
            <button
              onClick={onClose}
              className="text-[#434655] hover:text-[#0b1c30] p-1.5 rounded hover:bg-[#e5eeff] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="p-4 border-b border-[#c3c6d7] bg-white flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737686] text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search by name, title, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#f8f9ff] border border-[#c3c6d7] rounded-lg py-2 pl-9 pr-4 text-sm text-[#0b1c30] focus:outline-none focus:border-[#004ac6]"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setDeptFilter(dept)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  deptFilter === dept
                    ? 'bg-[#2563eb] text-white'
                    : 'bg-[#f8f9ff] border border-[#c3c6d7] text-[#434655] hover:bg-[#e5eeff]'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Members List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#c3c6d7]/40 p-2">
          {filteredNodes.length === 0 ? (
            <div className="text-center py-12 text-[#737686] text-sm">
              No matching employees found for "{searchTerm}".
            </div>
          ) : (
            filteredNodes.map((node) => {
              const manager = nodes.find((n) => n.id === node.parentId);
              return (
                <div
                  key={node.id}
                  onClick={() => {
                    onSelectNode(node);
                    onClose();
                  }}
                  className="p-3 rounded-lg hover:bg-[#eff4ff] transition-colors cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {node.avatarUrl ? (
                      <img
                        src={node.avatarUrl}
                        alt={node.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#c3c6d7] shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#645efb] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {node.initials || node.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#0b1c30] group-hover:text-[#004ac6] transition-colors truncate">
                          {node.name}
                        </span>
                        <span className="bg-[#e5eeff] text-[#004ac6] text-[10px] font-semibold px-2 py-0.5 rounded">
                          {node.department}
                        </span>
                      </div>
                      <p className="text-xs text-[#434655] truncate">{node.title}</p>
                      <p className="text-[11px] text-[#737686] truncate">{node.email}</p>
                    </div>
                  </div>

                  <div className="hidden sm:flex flex-col items-end shrink-0 pl-3">
                    {manager && (
                      <span className="text-[11px] text-[#434655]">
                        Reports to: <strong className="text-[#0b1c30]">{manager.name}</strong>
                      </span>
                    )}
                    <div className="flex gap-1 mt-1">
                      {node.tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-[10px] bg-white border border-[#c3c6d7] px-1.5 py-0.5 rounded text-[#434655]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
