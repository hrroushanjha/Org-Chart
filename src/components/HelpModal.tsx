import React from 'react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-[#c3c6d7] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#f8f9ff] border-b border-[#c3c6d7] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[22px]">help_outline</span>
            <h3 className="text-base font-bold text-[#0b1c30]">OrgGraph Pro Help & Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#434655] hover:text-[#0b1c30] p-1 rounded hover:bg-[#e5eeff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-sm text-[#434655]">
          <div>
            <h4 className="font-semibold text-[#0b1c30] mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#004ac6]">mouse</span>
              Canvas Navigation
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-xs pl-1">
              <li><strong>Pan:</strong> Click and drag anywhere on the dotted canvas grid to reposition the view.</li>
              <li><strong>Zoom:</strong> Hold <kbd className="bg-slate-100 border px-1 py-0.5 rounded font-mono">Ctrl / ⌘</kbd> and scroll, or use the bottom-left zoom buttons.</li>
              <li><strong>Select:</strong> Click any person card to inspect and edit details in the Properties sidebar.</li>
              <li><strong>Add Report:</strong> Click the <kbd className="bg-slate-100 border px-1 py-0.5 rounded font-mono">+</kbd> button floating on the bottom of any node.</li>
            </ul>
          </div>

          <div className="pt-2 border-t border-[#c3c6d7]/40">
            <h4 className="font-semibold text-[#0b1c30] mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#004ac6]">keyboard</span>
              Keyboard Shortcuts
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-[#f8f9ff] rounded border border-[#c3c6d7]/40">
                <span>Undo</span>
                <kbd className="bg-white border px-1.5 py-0.5 rounded font-mono text-[11px]">Ctrl + Z</kbd>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#f8f9ff] rounded border border-[#c3c6d7]/40">
                <span>Redo</span>
                <kbd className="bg-white border px-1.5 py-0.5 rounded font-mono text-[11px]">Ctrl + Y</kbd>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#f8f9ff] rounded border border-[#c3c6d7]/40">
                <span>Add Node</span>
                <kbd className="bg-white border px-1.5 py-0.5 rounded font-mono text-[11px]">Alt + N</kbd>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#f8f9ff] rounded border border-[#c3c6d7]/40">
                <span>Export Flow</span>
                <kbd className="bg-white border px-1.5 py-0.5 rounded font-mono text-[11px]">Ctrl + E</kbd>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#c3c6d7]/40">
            <h4 className="font-semibold text-[#0b1c30] mb-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#004ac6]">ios_share</span>
              Exporting & Templates
            </h4>
            <p className="text-xs">
              Use <strong>Export Flow</strong> to generate production-ready PDF, PNG, SVG, or CSV data. Choose <strong>Create from Template</strong> to load standard structures like Corporate, Matrix, Flat, or Squad models.
            </p>
          </div>
        </div>

        <div className="p-4 bg-[#f8f9ff] border-t border-[#c3c6d7] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#004ac6] text-white text-xs font-semibold rounded-md hover:bg-[#003ea8] transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
