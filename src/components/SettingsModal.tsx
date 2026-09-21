import React from 'react';

interface SettingsModalProps {
  chartTitle: string;
  chartSubtitle: string;
  onUpdateTitle: (title: string, subtitle: string) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  chartTitle,
  chartSubtitle,
  onUpdateTitle,
  onClose,
}) => {
  const [title, setTitle] = React.useState(chartTitle);
  const [subtitle, setSubtitle] = React.useState(chartSubtitle);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTitle(title, subtitle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-[#c3c6d7] overflow-hidden">
        <div className="p-4 bg-[#f8f9ff] border-b border-[#c3c6d7] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[22px]">settings</span>
            <h3 className="text-base font-bold text-[#0b1c30]">Chart Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#434655] hover:text-[#0b1c30] p-1 rounded hover:bg-[#e5eeff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#434655] mb-1">Organization / Chart Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-[#c3c6d7] rounded-md px-3 py-2 text-sm text-[#0b1c30] focus:outline-none focus:border-[#004ac6]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#434655] mb-1">Division / Subtitle</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full border border-[#c3c6d7] rounded-md px-3 py-2 text-sm text-[#0b1c30] focus:outline-none focus:border-[#004ac6]"
            />
          </div>

          <div className="pt-2 border-t border-[#c3c6d7] flex gap-2 justify-end">
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
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
