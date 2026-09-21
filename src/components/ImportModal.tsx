import React, { useState } from 'react';
import { OrgNode } from '../types';

interface ImportModalProps {
  onClose: () => void;
  onImportNodes: (nodes: OrgNode[]) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ onClose, onImportNodes }) => {
  const sampleCSV = `id,name,title,department,email,parentId,tags
emp-1,Sarah Jenkins,Chief Executive Officer,Executive,s.jenkins@orggraph.pro,,Leadership;Full-Time
emp-2,Jordan Smith,Chief Technology Officer,Engineering,j.smith@orggraph.pro,emp-1,Engineering;Full-Time
emp-3,Mia Lopez,VP of Design,Product,m.lopez@orggraph.pro,emp-1,Product;Creative
emp-4,David Chen,Chief Marketing Officer,Marketing,d.chen@orggraph.pro,emp-1,Marketing;Full-Time
emp-5,Marcus Chen,Director of Core Engineering,Engineering,m.chen@orggraph.pro,emp-2,Cloud;Lead
emp-6,Jessica Miller,Staff UX Researcher,Product,j.miller@orggraph.pro,emp-3,Research;Design`;

  const [csvText, setCsvText] = useState(sampleCSV);
  const [error, setError] = useState<string | null>(null);

  const handleImport = () => {
    setError(null);
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        setError('CSV must contain a header and at least one row.');
        return;
      }

      const parsedNodes: OrgNode[] = [];
      // Skip header row
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(',').map((p) => p.trim());
        if (parts.length < 4) continue;

        const [id, name, title, department, email, parentId, tagsStr] = parts;
        const initials = name
          .split(' ')
          .map((p) => p[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();

        parsedNodes.push({
          id: id || `node-${i}`,
          name,
          title,
          department: department || 'Engineering',
          email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@orggraph.pro`,
          initials,
          parentId: parentId || null,
          tags: tagsStr ? tagsStr.split(';').map((t) => t.trim()) : ['Full-Time'],
          isExpanded: true,
        });
      }

      if (parsedNodes.length === 0) {
        setError('No valid nodes parsed from the provided input.');
        return;
      }

      onImportNodes(parsedNodes);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to parse CSV');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvText(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-[#c3c6d7] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#f8f9ff] border-b border-[#c3c6d7] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[22px]">upload_file</span>
            <h3 className="text-base font-bold text-[#0b1c30]">Import Organization Hierarchy</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#434655] hover:text-[#0b1c30] p-1 rounded hover:bg-[#e5eeff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-[#434655]">
            Paste your CSV formatted organization records below or upload a .csv file directly:
          </p>

          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#004ac6] hover:underline cursor-pointer flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">attach_file</span>
              <span>Upload CSV file</span>
              <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
            <button
              type="button"
              onClick={() => setCsvText(sampleCSV)}
              className="text-xs text-[#737686] hover:text-[#004ac6] cursor-pointer"
            >
              Reset to Sample
            </button>
          </div>

          <textarea
            rows={8}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            className="w-full border border-[#c3c6d7] rounded-md p-3 font-mono text-xs text-[#0b1c30] focus:outline-none focus:border-[#004ac6] bg-[#f8f9ff]"
          />

          {error && (
            <div className="text-xs text-[#ba1a1a] bg-[#ffdad6] p-2.5 rounded-md flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Footer */}
          <div className="pt-3 border-t border-[#c3c6d7] flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#434655] hover:bg-[#eff4ff] rounded-md transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              className="px-4 py-2 text-sm bg-[#004ac6] hover:bg-[#003ea8] text-white font-medium rounded-md shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">publish</span>
              <span>Import Hierarchy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
