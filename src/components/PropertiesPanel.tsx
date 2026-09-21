import React, { useState, useEffect } from 'react';
import { OrgNode } from '../types';
import { DEPARTMENTS, ASSET_IMAGES } from '../data/initialData';

interface PropertiesPanelProps {
  selectedNode: OrgNode | null;
  onClose: () => void;
  onUpdateNode: (updated: OrgNode) => void;
  onDeleteNode?: (nodeId: string) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedNode,
  onClose,
  onUpdateNode,
  onDeleteNode,
}) => {
  const [formData, setFormData] = useState<OrgNode | null>(null);
  const [newTagInput, setNewTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (selectedNode) {
      setFormData({ ...selectedNode });
      setSavedSuccess(false);
      setIsAddingTag(false);
      setNewTagInput('');
    }
  }, [selectedNode]);

  if (!formData || !selectedNode) {
    return (
      <aside
        id="properties-panel"
        className="hidden lg:flex flex-col w-[320px] bg-white border-l border-[#c3c6d7] h-full shrink-0 shadow-[-4px_0_15px_rgba(15,23,42,0.03)] z-20"
      >
        <div className="p-4 border-b border-[#c3c6d7] flex justify-between items-center bg-[#f8f9ff]">
          <h2 className="text-lg font-semibold text-[#0b1c30]">Properties</h2>
          <button
            onClick={onClose}
            className="text-[#434655] hover:text-[#0b1c30] p-1 rounded hover:bg-[#e5eeff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-[#737686]">
          <span className="material-symbols-outlined text-4xl mb-2 text-[#c3c6d7]">touch_app</span>
          <p className="text-sm">Select any card on the canvas to view and edit its details.</p>
        </div>
      </aside>
    );
  }

  const handleInputChange = (field: keyof OrgNode, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            tags: prev.tags.filter((t) => t !== tagToRemove),
          }
        : null
    );
  };

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    const tag = newTagInput.trim();
    if (!formData.tags.includes(tag)) {
      setFormData((prev) => (prev ? { ...prev, tags: [...prev.tags, tag] } : null));
    }
    setNewTagInput('');
    setIsAddingTag(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onUpdateNode(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  const handleCancel = () => {
    if (selectedNode) {
      setFormData({ ...selectedNode });
    }
  };

  const isSarahJenkins = formData.name.toLowerCase().includes('sarah jenkins');

  return (
    <aside
      id="properties-panel"
      className="flex flex-col w-[320px] bg-white border-l border-[#c3c6d7] h-full shrink-0 shadow-[-4px_0_15px_rgba(15,23,42,0.03)] z-20"
    >
      {/* Header */}
      <div className="p-4 border-b border-[#c3c6d7] flex justify-between items-center bg-[#f8f9ff]">
        <h2 className="text-lg font-semibold text-[#0b1c30]">Properties</h2>
        <button
          onClick={onClose}
          className="text-[#434655] hover:text-[#0b1c30] p-1 rounded hover:bg-[#e5eeff] transition-colors cursor-pointer"
          title="Close properties panel"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* Form Content */}
      <div className="p-4 overflow-y-auto flex-1">
        {/* Selected Node Header */}
        <div className="flex items-center gap-4 mb-6">
          {formData.avatarUrl ? (
            <img
              alt={formData.name}
              src={isSarahJenkins ? ASSET_IMAGES.sarahJenkinsCloseup : formData.avatarUrl}
              className="w-12 h-12 rounded-full object-cover border border-[#c3c6d7] shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#645efb] text-white flex items-center justify-center font-bold text-base shrink-0">
              {formData.initials || formData.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-[#0b1c30] truncate">{formData.name}</h3>
            <p className="text-xs text-[#434655] truncate">{formData.title}</p>
          </div>
        </div>

        {savedSuccess && (
          <div className="mb-4 py-2 px-3 bg-[#e5eeff] border border-[#2563eb]/40 text-[#004ac6] text-xs rounded-md flex items-center gap-1.5 animate-in fade-in duration-150">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>Changes saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-[#434655] mb-1">Full Name</label>
            <input
              className="w-full bg-white border border-[#c3c6d7] rounded-md px-3 py-2 text-sm text-[#0b1c30] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] transition-all"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          {/* Role / Title */}
          <div>
            <label className="block text-xs font-medium text-[#434655] mb-1">Role / Title</label>
            <input
              className="w-full bg-white border border-[#c3c6d7] rounded-md px-3 py-2 text-sm text-[#0b1c30] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] transition-all"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-medium text-[#434655] mb-1">Department</label>
            <div className="relative">
              <select
                className="w-full bg-white border border-[#c3c6d7] rounded-md px-3 py-2 text-sm text-[#0b1c30] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] transition-all appearance-none cursor-pointer pr-8"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#737686] text-[18px]">
                arrow_drop_down
              </span>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-[#434655] mb-1">Email</label>
            <input
              className="w-full bg-white border border-[#c3c6d7] rounded-md px-3 py-2 text-sm text-[#0b1c30] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] transition-all"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>

          {/* Tags */}
          <div className="pt-2 border-t border-[#c3c6d7] mt-4">
            <label className="block text-xs font-medium text-[#434655] mb-2">Tags</label>
            <div className="flex flex-wrap gap-1.5 items-center">
              {formData.tags.map((tag, idx) => (
                <span
                  key={tag}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                    idx === 0
                      ? 'bg-[#2563eb] text-white'
                      : 'bg-[#dce9ff] text-[#0b1c30]'
                  }`}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:opacity-75 focus:outline-none cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </span>
              ))}

              {isAddingTag ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Tag name"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      } else if (e.key === 'Escape') {
                        setIsAddingTag(false);
                      }
                    }}
                    className="w-24 text-xs px-2 py-0.5 border border-[#004ac6] rounded-full focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="text-[#004ac6] hover:bg-[#e5eeff] p-0.5 rounded-full"
                  >
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingTag(true)}
                  className="border border-dashed border-[#737686] text-[#434655] px-2.5 py-1 rounded-full text-xs hover:border-[#004ac6] hover:text-[#004ac6] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  <span>Tag</span>
                </button>
              )}
            </div>
          </div>

          {/* Delete action if not root node */}
          {formData.parentId && onDeleteNode && (
            <div className="pt-4 border-t border-[#c3c6d7] mt-4">
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Are you sure you want to remove ${formData.name}?`)) {
                    onDeleteNode(formData.id);
                  }
                }}
                className="w-full text-xs text-[#ba1a1a] hover:bg-[#ffdad6] py-1.5 px-3 rounded transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                <span>Remove from Organization</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-[#c3c6d7] bg-[#f8f9ff] flex gap-2">
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 bg-white border border-[#c3c6d7] text-[#0b1c30] text-sm py-2 px-4 rounded-md hover:bg-[#eff4ff] transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="flex-1 bg-[#004ac6] text-white text-sm py-2 px-4 rounded-md hover:bg-[#003ea8] transition-colors cursor-pointer shadow-xs font-medium"
        >
          Save Changes
        </button>
      </div>
    </aside>
  );
};
