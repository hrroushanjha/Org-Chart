import React, { useState } from 'react';
import { OrgNode } from '../types';
import { DEPARTMENTS } from '../data/initialData';

interface AddNodeModalProps {
  nodes: OrgNode[];
  defaultParentId?: string | null;
  onClose: () => void;
  onAddNode: (newNode: OrgNode) => void;
}

export const AddNodeModal: React.FC<AddNodeModalProps> = ({
  nodes,
  defaultParentId,
  onClose,
  onAddNode,
}) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [email, setEmail] = useState('');
  const [parentId, setParentId] = useState<string>(defaultParentId || (nodes[0]?.id ?? ''));
  const [tagInput, setTagInput] = useState('Full-Time');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !title.trim()) return;

    const initials = name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const newNode: OrgNode = {
      id: `node-${Date.now()}`,
      name: name.trim(),
      title: title.trim(),
      department,
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@orggraph.pro`,
      initials,
      tags: tagInput ? tagInput.split(',').map((t) => t.trim()).filter(Boolean) : ['Full-Time'],
      parentId: parentId || null,
      isExpanded: true,
    };

    onAddNode(newNode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-[#c3c6d7] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#f8f9ff] border-b border-[#c3c6d7] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[22px]">person_add</span>
            <h3 className="text-base font-semibold text-[#0b1c30]">Add New Organization Node</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#434655] hover:text-[#0b1c30] p-1 rounded hover:bg-[#e5eeff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#434655] mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Katherine Pierce"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-[#c3c6d7] rounded-md px-3 py-2 text-sm text-[#0b1c30] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#434655] mb-1">Role / Job Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Senior Frontend Architect"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-[#c3c6d7] rounded-md px-3 py-2 text-sm text-[#0b1c30] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#434655] mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full border border-[#c3c6d7] rounded-md px-3 py-2 text-sm text-[#0b1c30] focus:outline-none focus:border-[#004ac6] bg-white cursor-pointer"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#434655] mb-1">Reports To (Manager)</label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full border border-[#c3c6d7] rounded-md px-3 py-2 text-sm text-[#0b1c30] focus:outline-none focus:border-[#004ac6] bg-white cursor-pointer truncate"
              >
                {nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.name} ({node.title})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#434655] mb-1">Email Address</label>
            <input
              type="email"
              placeholder="e.g. k.pierce@orggraph.pro"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#c3c6d7] rounded-md px-3 py-2 text-sm text-[#0b1c30] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#434655] mb-1">Tags (Comma-separated)</label>
            <input
              type="text"
              placeholder="Leadership, Full-Time, Remote"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="w-full border border-[#c3c6d7] rounded-md px-3 py-2 text-sm text-[#0b1c30] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6]"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#c3c6d7] flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#434655] hover:bg-[#eff4ff] rounded-md transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-[#004ac6] hover:bg-[#003ea8] text-white font-medium rounded-md shadow-xs transition-colors cursor-pointer"
            >
              Add Node
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
