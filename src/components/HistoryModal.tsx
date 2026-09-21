import React from 'react';
import { OrgNode } from '../types';

interface HistoryEntry {
  timestamp: string;
  description: string;
  nodes: OrgNode[];
}

interface HistoryModalProps {
  history: HistoryEntry[];
  currentIndex: number;
  onRestore: (index: number) => void;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  history,
  currentIndex,
  onRestore,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-[#c3c6d7] overflow-hidden max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#f8f9ff] border-b border-[#c3c6d7] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[22px]">history</span>
            <h3 className="text-base font-bold text-[#0b1c30]">Revision History</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#434655] hover:text-[#0b1c30] p-1 rounded hover:bg-[#e5eeff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto divide-y divide-[#c3c6d7]/30">
          {history.length === 0 ? (
            <p className="text-sm text-[#737686] text-center py-6">No change history recorded yet.</p>
          ) : (
            history.map((entry, index) => {
              const isCurrent = index === currentIndex;
              return (
                <div
                  key={index}
                  onClick={() => {
                    onRestore(index);
                    onClose();
                  }}
                  className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                    isCurrent ? 'bg-[#e5eeff] border border-[#2563eb]/40' : 'hover:bg-[#eff4ff]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#0b1c30]">
                        {entry.description}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] bg-[#004ac6] text-white px-2 py-0.5 rounded-full font-semibold">
                          Active
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#737686]">{entry.timestamp}</span>
                  </div>
                  <button
                    className={`text-xs px-2.5 py-1 rounded transition-colors ${
                      isCurrent
                        ? 'text-[#004ac6] font-medium'
                        : 'text-[#434655] hover:bg-[#dce9ff]'
                    }`}
                  >
                    {isCurrent ? 'Current' : 'Revert'}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
