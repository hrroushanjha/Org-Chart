import React from 'react';
import { ASSET_IMAGES } from '../data/initialData';

interface TopNavBarProps {
  onAddNode: () => void;
  onExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  zoomLevel: number;
  onZoomChange: (level: number) => void;
  onResetZoom: () => void;
  onOpenSettings?: () => void;
  onGoHome?: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  onAddNode,
  onExport,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  zoomLevel,
  onZoomChange,
  onResetZoom,
  onOpenSettings,
  onGoHome
}) => {
  const [showZoomMenu, setShowZoomMenu] = React.useState(false);
  const [hasNotification, setHasNotification] = React.useState(true);

  return (
    <header className="flex justify-between items-center px-4 md:px-6 h-16 w-full fixed top-0 z-50 bg-[#f8f9ff] border-b border-[#c3c6d7]/40 shadow-xs">
      {/* Brand & Left Actions */}
      <div className="flex items-center gap-4 md:gap-10">
        <button
          onClick={onGoHome}
          className="text-left group cursor-pointer focus:outline-none"
          title="OrgGraph Pro"
        >
          <h1 className="text-xl md:text-2xl font-bold text-[#004ac6] tracking-tight group-hover:opacity-90 transition-opacity">
            OrgGraph Pro
          </h1>
        </button>

        <nav className="flex items-center gap-2 md:gap-3">
          <button
            onClick={onAddNode}
            className="text-sm font-medium text-[#434655] hover:text-[#004ac6] hover:bg-[#e5eeff] px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add Node</span>
          </button>

          <button
            onClick={onExport}
            className="text-sm font-medium bg-[#2563eb] text-[#eeefff] px-3 py-1.5 rounded-md hover:bg-[#004ac6] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">ios_share</span>
            <span>Export Flow</span>
          </button>

          <div className="hidden sm:block w-px h-4 bg-[#c3c6d7] my-auto mx-1"></div>

          {/* Zoom controls with quick dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowZoomMenu(!showZoomMenu)}
              className="text-sm font-medium text-[#434655] hover:text-[#004ac6] hover:bg-[#e5eeff] px-2 py-1.5 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
              title="Change zoom level"
            >
              <span className="material-symbols-outlined text-[20px]">zoom_in</span>
              <span className="hidden sm:inline">Zoom</span>
              <span className="text-xs text-[#737686] font-mono ml-0.5">{Math.round(zoomLevel * 100)}%</span>
            </button>

            {showZoomMenu && (
              <div
                className="absolute left-0 mt-2 w-36 bg-white border border-[#c3c6d7] rounded-lg shadow-lg py-1 z-50 text-sm animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setShowZoomMenu(false)}
              >
                <button
                  onClick={() => { onZoomChange(0.75); setShowZoomMenu(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#e5eeff] text-[#0b1c30] flex justify-between"
                >
                  <span>75%</span>
                  {Math.round(zoomLevel * 100) === 75 && <span>✓</span>}
                </button>
                <button
                  onClick={() => { onResetZoom(); setShowZoomMenu(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#e5eeff] text-[#0b1c30] flex justify-between"
                >
                  <span>100% (Default)</span>
                  {Math.round(zoomLevel * 100) === 100 && <span>✓</span>}
                </button>
                <button
                  onClick={() => { onZoomChange(1.25); setShowZoomMenu(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#e5eeff] text-[#0b1c30] flex justify-between"
                >
                  <span>125%</span>
                  {Math.round(zoomLevel * 100) === 125 && <span>✓</span>}
                </button>
                <button
                  onClick={() => { onZoomChange(1.5); setShowZoomMenu(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#e5eeff] text-[#0b1c30] flex justify-between"
                >
                  <span>150%</span>
                  {Math.round(zoomLevel * 100) === 150 && <span>✓</span>}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`text-sm font-medium px-2 py-1.5 rounded-md transition-colors flex items-center gap-1 ${
              canUndo
                ? 'text-[#434655] hover:text-[#004ac6] hover:bg-[#e5eeff] cursor-pointer'
                : 'text-[#c3c6d7] cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <span className="material-symbols-outlined text-[20px]">undo</span>
            <span className="hidden sm:inline">Undo</span>
          </button>

          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`text-sm font-medium px-2 py-1.5 rounded-md transition-colors flex items-center gap-1 ${
              canRedo
                ? 'text-[#434655] hover:text-[#004ac6] hover:bg-[#e5eeff] cursor-pointer'
                : 'text-[#c3c6d7] cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <span className="material-symbols-outlined text-[20px]">redo</span>
            <span className="hidden sm:inline">Redo</span>
          </button>
        </nav>
      </div>

      {/* Right User Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={onOpenSettings}
          className="p-1.5 text-[#434655] hover:text-[#004ac6] hover:bg-[#e5eeff] rounded-full transition-colors cursor-pointer"
          title="Chart Settings"
        >
          <span className="material-symbols-outlined text-[22px]">settings</span>
        </button>

        <button
          onClick={() => setHasNotification(!hasNotification)}
          className="p-1.5 text-[#434655] hover:text-[#004ac6] hover:bg-[#e5eeff] rounded-full transition-colors relative cursor-pointer"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          {hasNotification && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#004ac6] rounded-full ring-2 ring-white"></span>
          )}
        </button>

        <div className="ml-1 pl-2 border-l border-[#c3c6d7]">
          <img
            alt="User profile"
            src={ASSET_IMAGES.userProfile}
            className="w-8 h-8 rounded-full object-cover border border-[#c3c6d7] shadow-xs"
            title="hrroushanjha@gmail.com"
          />
        </div>
      </div>
    </header>
  );
};
