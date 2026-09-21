import React, { useState } from 'react';
import { ExportConfig, OrgNode } from '../types';
import { ASSET_IMAGES, DEPARTMENTS } from '../data/initialData';

interface ExportModalProps {
  nodes: OrgNode[];
  onClose: () => void;
  orgName?: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  nodes,
  onClose,
  orgName = 'Global Operations',
}) => {
  const [config, setConfig] = useState<ExportConfig>({
    format: 'pdf',
    scope: 'full',
    department: 'Engineering',
    includeProfilePhotos: true,
    showConnectorLabels: true,
    highContrastMode: false,
  });

  const [previewZoom, setPreviewZoom] = useState(1.0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Estimated size calculator
  const getEstimatedSize = () => {
    switch (config.format) {
      case 'pdf':
        return '1.2 MB';
      case 'png':
        return '2.8 MB';
      case 'svg':
        return '450 KB';
      case 'csv':
        return '18 KB';
      default:
        return '1.0 MB';
    }
  };

  const handleDownload = () => {
    if (config.format === 'csv') {
      // Generate actual CSV content
      const headers = ['ID', 'Name', 'Title', 'Department', 'Email', 'ParentID', 'Tags'];
      const rows = nodes.map((n) => [
        n.id,
        `"${n.name}"`,
        `"${n.title}"`,
        `"${n.department}"`,
        n.email,
        n.parentId || '',
        `"${n.tags.join(', ')}"`,
      ]);
      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${orgName.toLowerCase().replace(/\s+/g, '_')}_org_chart.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('CSV file downloaded successfully!');
    } else if (config.format === 'svg') {
      // Generate basic SVG document
      const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${config.highContrastMode ? '#ffffff' : '#f8f9ff'}"/>
  <text x="50" y="50" font-family="Inter, sans-serif" font-size="24" font-weight="bold" fill="#004ac6">${orgName} - Org Chart</text>
  <text x="50" y="80" font-family="Inter, sans-serif" font-size="14" fill="#434655">Total Nodes: ${nodes.length} | Exported via OrgGraph Pro</text>
  ${nodes
    .map(
      (n, i) => `
    <g transform="translate(${100 + (i % 3) * 320}, ${120 + Math.floor(i / 3) * 160})">
      <rect width="280" height="120" rx="8" fill="#ffffff" stroke="#c3c6d7" stroke-width="1.5"/>
      <text x="20" y="40" font-family="Inter, sans-serif" font-size="16" font-weight="600" fill="#0b1c30">${n.name}</text>
      <text x="20" y="65" font-family="Inter, sans-serif" font-size="13" fill="#434655">${n.title}</text>
      <text x="20" y="90" font-family="Inter, sans-serif" font-size="11" fill="#004ac6">${n.department}</text>
    </g>
  `
    )
    .join('')}
</svg>`;
      const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${orgName.toLowerCase().replace(/\s+/g, '_')}_org_chart.svg`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('SVG vector exported successfully!');
    } else {
      // PDF or PNG
      showToast(`Generating high-res ${config.format.toUpperCase()} export for ${orgName}...`);
      setTimeout(() => {
        // Trigger simulated file download
        const blob = new Blob([`OrgGraph Pro Export - ${orgName}\nNodes: ${nodes.length}`], {
          type: 'text/plain;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute(
          'download',
          `${orgName.toLowerCase().replace(/\s+/g, '_')}_export.${config.format}`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast(`${config.format.toUpperCase()} downloaded!`);
      }, 700);
    }
  };

  const handleShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Shareable link copied to clipboard!');
    } else {
      showToast('Share link: ' + window.location.href);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col h-screen overflow-hidden animate-in fade-in duration-150">
      {/* Top Header */}
      <header className="bg-white border-b border-[#c3c6d7]/40 shadow-xs flex justify-between items-center px-6 w-full h-16 shrink-0 z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            aria-label="Close Export"
            className="p-2 hover:bg-[#eff4ff] rounded-full transition-colors cursor-pointer text-[#434655] hover:text-[#004ac6]"
            title="Back to Editor"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
          <div className="h-6 w-[1px] bg-[#c3c6d7] mx-2"></div>
          <span className="text-xl font-bold text-[#004ac6] tracking-tight">OrgGraph Pro</span>
        </div>

        <div className="text-lg font-semibold text-[#0b1c30]">Export Configuration</div>

        <div className="w-10"></div>
      </header>

      {/* Main Split Layout */}
      <main className="flex-1 flex flex-col md:flex-row bg-[#f8f9ff] overflow-hidden">
        {/* Left: Preview Area */}
        <section className="flex-1 bg-[#eff4ff] border-r border-[#c3c6d7]/40 flex flex-col relative overflow-hidden p-6">
          {/* Preview Controls Overlay */}
          <div className="absolute top-6 right-6 z-10 flex items-center gap-1 bg-white p-1 rounded-lg shadow-sm border border-[#c3c6d7]/60">
            <button
              onClick={() => setPreviewZoom((z) => Math.min(1.8, z + 0.15))}
              className="p-1.5 hover:bg-[#eff4ff] rounded text-[#434655] hover:text-[#004ac6] transition-colors cursor-pointer"
              title="Zoom In"
            >
              <span className="material-symbols-outlined text-[20px]">zoom_in</span>
            </button>
            <button
              onClick={() => setPreviewZoom((z) => Math.max(0.6, z - 0.15))}
              className="p-1.5 hover:bg-[#eff4ff] rounded text-[#434655] hover:text-[#004ac6] transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <span className="material-symbols-outlined text-[20px]">zoom_out</span>
            </button>
            <div className="w-[1px] h-4 bg-[#c3c6d7] my-auto mx-1"></div>
            <button
              onClick={() => setPreviewZoom(1.0)}
              className="p-1.5 hover:bg-[#eff4ff] rounded text-[#434655] hover:text-[#004ac6] transition-colors cursor-pointer"
              title="Fit to Screen"
            >
              <span className="material-symbols-outlined text-[20px]">fit_screen</span>
            </button>
          </div>

          {/* Chart Preview Viewport */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-white/70 rounded-xl border border-[#c3c6d7]/40 shadow-inner p-8">
            <div
              className="transition-transform duration-150 ease-out flex items-center justify-center max-w-full max-h-full"
              style={{
                transform: `scale(${previewZoom})`,
                filter: config.highContrastMode ? 'grayscale(100%) contrast(150%)' : 'none',
              }}
            >
              <img
                src={ASSET_IMAGES.exportChartPreview}
                alt="Organizational Chart Preview"
                className="max-w-[85vw] md:max-w-[700px] max-h-[60vh] object-contain rounded-lg shadow-[0_10px_25px_rgba(15,23,42,0.1)] border border-[#c3c6d7]"
              />
            </div>
          </div>

          {/* Status info footer */}
          <div className="mt-4 flex justify-between items-center text-xs text-[#434655]">
            <span>
              Preview generating for: <strong>{orgName}</strong>
            </span>
            <span>Est. Size: {getEstimatedSize()}</span>
          </div>
        </section>

        {/* Right: Configuration Panel */}
        <aside className="w-full md:w-[420px] bg-white flex flex-col h-full overflow-y-auto border-l border-[#c3c6d7]/40">
          <div className="p-6 flex-1 flex flex-col gap-6">
            {/* Format Section */}
            <section>
              <h3 className="text-base font-semibold text-[#0b1c30] mb-3">Format</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'pdf', label: 'PDF', icon: 'picture_as_pdf' },
                  { id: 'png', label: 'PNG', icon: 'image' },
                  { id: 'svg', label: 'SVG', icon: 'polyline' },
                  { id: 'csv', label: 'CSV', icon: 'table_view' },
                ].map((fmt) => {
                  const isChecked = config.format === fmt.id;
                  return (
                    <label
                      key={fmt.id}
                      className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#004ac6] bg-[#645efb]/10 shadow-[0_0_0_1px_rgba(0,74,198,1)]'
                          : 'border-[#c3c6d7] hover:bg-[#eff4ff] hover:border-[#004ac6]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="format"
                        value={fmt.id}
                        checked={isChecked}
                        onChange={() =>
                          setConfig((prev) => ({
                            ...prev,
                            format: fmt.id as ExportConfig['format'],
                          }))
                        }
                        className="sr-only"
                      />
                      <span className="material-symbols-outlined text-[#004ac6] mr-2.5 text-[22px]">
                        {fmt.icon}
                      </span>
                      <span className="text-sm font-medium text-[#0b1c30] flex-1">{fmt.label}</span>
                      <div className="w-4 h-4 rounded-full border border-[#c3c6d7] flex items-center justify-center ml-auto">
                        {isChecked && <div className="w-2 h-2 rounded-full bg-[#004ac6]"></div>}
                      </div>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* Scope Section */}
            <section>
              <h3 className="text-base font-semibold text-[#0b1c30] mb-3">Scope</h3>
              <div className="flex flex-col gap-2.5">
                <label className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[#eff4ff] transition-colors cursor-pointer border border-transparent hover:border-[#c3c6d7]">
                  <input
                    type="radio"
                    name="scope"
                    value="full"
                    checked={config.scope === 'full'}
                    onChange={() => setConfig((prev) => ({ ...prev, scope: 'full' }))}
                    className="mt-1 text-[#004ac6] focus:ring-[#004ac6]"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#0b1c30]">Full Chart</span>
                    <span className="text-xs text-[#434655]">
                      Export the entire organizational structure.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[#eff4ff] transition-colors cursor-pointer border border-transparent hover:border-[#c3c6d7]">
                  <input
                    type="radio"
                    name="scope"
                    value="current"
                    checked={config.scope === 'current'}
                    onChange={() => setConfig((prev) => ({ ...prev, scope: 'current' }))}
                    className="mt-1 text-[#004ac6] focus:ring-[#004ac6]"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#0b1c30]">Current View</span>
                    <span className="text-xs text-[#434655]">
                      Export only nodes currently visible on screen.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[#eff4ff] transition-colors cursor-pointer border border-transparent hover:border-[#c3c6d7]">
                  <input
                    type="radio"
                    name="scope"
                    value="department"
                    checked={config.scope === 'department'}
                    onChange={() => setConfig((prev) => ({ ...prev, scope: 'department' }))}
                    className="mt-1 text-[#004ac6] focus:ring-[#004ac6]"
                  />
                  <div className="flex flex-col w-full">
                    <span className="text-sm font-medium text-[#0b1c30] mb-2">
                      Specific Department
                    </span>
                    <div className="relative">
                      <select
                        disabled={config.scope !== 'department'}
                        value={config.department}
                        onChange={(e) =>
                          setConfig((prev) => ({ ...prev, department: e.target.value }))
                        }
                        className={`w-full appearance-none bg-white border border-[#c3c6d7] text-[#0b1c30] text-sm rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-[#004ac6] focus:border-[#004ac6] transition-all ${
                          config.scope !== 'department' ? 'opacity-50 cursor-not-allowed bg-slate-100' : 'cursor-pointer'
                        }`}
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
                </label>
              </div>
            </section>

            {/* Options Section */}
            <section>
              <h3 className="text-base font-semibold text-[#0b1c30] mb-3">Options</h3>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 p-2 rounded hover:bg-[#eff4ff] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.includeProfilePhotos}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        includeProfilePhotos: e.target.checked,
                      }))
                    }
                    className="rounded text-[#004ac6] focus:ring-[#004ac6] w-4 h-4"
                  />
                  <span className="text-sm text-[#0b1c30]">Include Profile Photos</span>
                </label>

                <label className="flex items-center gap-3 p-2 rounded hover:bg-[#eff4ff] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.showConnectorLabels}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        showConnectorLabels: e.target.checked,
                      }))
                    }
                    className="rounded text-[#004ac6] focus:ring-[#004ac6] w-4 h-4"
                  />
                  <span className="text-sm text-[#0b1c30]">Show Connector Labels</span>
                </label>

                <label className="flex items-center gap-3 p-2 rounded hover:bg-[#eff4ff] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.highContrastMode}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        highContrastMode: e.target.checked,
                      }))
                    }
                    className="rounded text-[#004ac6] focus:ring-[#004ac6] w-4 h-4"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm text-[#0b1c30]">High-Contrast Mode</span>
                    <span className="text-xs text-[#434655]">
                      Optimized for black and white printing.
                    </span>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* Sticky Footer Actions */}
          <div className="p-6 bg-white border-t border-[#c3c6d7]/40 flex flex-col gap-3 sticky bottom-0">
            <button
              onClick={handleDownload}
              className="w-full bg-[#004ac6] hover:bg-[#003ea8] active:scale-[0.99] text-white text-base font-semibold py-3 px-6 rounded-lg shadow-sm transition-all flex justify-center items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">file_download</span>
              <span>Download File</span>
            </button>
            <button
              onClick={handleShareLink}
              className="w-full bg-white border border-[#c3c6d7] hover:bg-[#eff4ff] active:scale-[0.99] text-[#0b1c30] text-base font-medium py-3 px-6 rounded-lg transition-all flex justify-center items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">link</span>
              <span>Share Link</span>
            </button>
          </div>
        </aside>
      </main>

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#0b1c30] text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 z-50 text-sm animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="material-symbols-outlined text-[#b4c5ff] text-[20px]">info</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
