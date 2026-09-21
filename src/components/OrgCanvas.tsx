import React, { useRef, useState, useEffect } from 'react';
import { OrgNode } from '../types';

interface OrgCanvasProps {
  nodes: OrgNode[];
  selectedNodeId: string | null;
  onSelectNode: (node: OrgNode) => void;
  onAddChildNode: (parentNodeId: string) => void;
  zoomLevel: number;
  onZoomChange: (level: number) => void;
  onToggleExpand?: (nodeId: string) => void;
}

export const OrgCanvas: React.FC<OrgCanvasProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  onAddChildNode,
  zoomLevel,
  onZoomChange,
  onToggleExpand,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag if clicking on the canvas background, not on a node or button
    const target = e.target as HTMLElement;
    if (target.closest('.org-card') || target.closest('button')) {
      return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey || e.altKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      const newZoom = Math.min(Math.max(zoomLevel + delta, 0.5), 2.0);
      onZoomChange(newZoom);
    }
  };

  // Root node is the one without parentId (or first)
  const rootNode = nodes.find((n) => !n.parentId) || nodes[0];
  const level1Nodes = rootNode ? nodes.filter((n) => n.parentId === rootNode.id) : [];

  // Get children of any node
  const getChildren = (parentId: string) => nodes.filter((n) => n.parentId === parentId);

  return (
    <main
      ref={containerRef}
      id="canvas-area"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className={`flex-1 bg-slate-50 relative overflow-hidden grid-bg flex flex-col items-center justify-center min-w-0 select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Transformable Canvas Workspace */}
      <div
        className="transition-transform duration-75 ease-out origin-center p-12 flex flex-col items-center"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
        }}
      >
        {rootNode && (
          <div className="flex flex-col items-center relative">
            {/* Root Node (CEO) */}
            <div
              id={`node-${rootNode.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectNode(rootNode);
              }}
              className={`org-card bg-[#f8f9ff] border rounded-xl p-4 flex flex-col items-center w-64 relative z-10 cursor-pointer ${
                selectedNodeId === rootNode.id
                  ? 'border-[#004ac6] ring-2 ring-[#004ac6] shadow-[0_4px_16px_rgba(0,74,198,0.18)] bg-white'
                  : 'border-[#c3c6d7] hover:border-[#004ac6] bg-white'
              }`}
            >
              {rootNode.avatarUrl ? (
                <img
                  alt={rootNode.name}
                  src={rootNode.avatarUrl}
                  className="w-16 h-16 rounded-full object-cover mb-2 border-2 border-white shadow-xs"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#645efb] text-white flex items-center justify-center text-xl font-bold mb-2 border-2 border-white shadow-xs">
                  {rootNode.initials || rootNode.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <h3 className="text-lg font-semibold text-[#0b1c30] text-center">{rootNode.name}</h3>
              <p className="text-sm text-[#434655] text-center mb-2">{rootNode.title}</p>
              <div className="bg-[#e5eeff] px-2.5 py-0.5 rounded text-[#004ac6] text-xs font-semibold mb-2">
                {rootNode.department}
              </div>

              {/* Add Child Node Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddChildNode(rootNode.id);
                }}
                className="absolute -bottom-3 bg-white border border-[#c3c6d7] rounded-full w-6 h-6 flex items-center justify-center text-[#434655] hover:text-[#004ac6] hover:border-[#004ac6] hover:scale-110 active:scale-95 transition-all shadow-xs cursor-pointer z-20"
                title={`Add report to ${rootNode.name}`}
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
              </button>
            </div>

            {/* If Level 1 children exist, render connector lines and children */}
            {level1Nodes.length > 0 && (
              <div className="flex flex-col items-center relative w-full">
                {/* Connector Line Vertical from CEO */}
                <div className="w-[2px] h-10 bg-[#c3c6d7]"></div>

                {/* Level 1 Container with Horizontal Connector */}
                <div className="relative pt-10">
                  {/* Connector Line Horizontal for Departments */}
                  {level1Nodes.length > 1 && (
                    <div
                      className="h-[2px] bg-[#c3c6d7] absolute top-0"
                      style={{
                        left: 'calc(16rem / 2)',
                        right: 'calc(16rem / 2)',
                      }}
                    ></div>
                  )}

                  {/* Department Heads Row */}
                  <div className="flex gap-8 items-start relative">
                    {level1Nodes.map((node) => {
                      const isSelected = selectedNodeId === node.id;
                      const subChildren = getChildren(node.id);
                      const isExpanded = node.isExpanded ?? false;

                      return (
                        <div key={node.id} className="flex flex-col items-center relative">
                          {/* Vertical connector down from horizontal line */}
                          <div className="w-[2px] h-10 bg-[#c3c6d7] absolute -top-10"></div>

                          {/* Node Card */}
                          <div
                            id={`node-${node.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectNode(node);
                            }}
                            className={`org-card bg-[#f8f9ff] border rounded-xl p-4 flex flex-col items-center w-64 relative z-10 cursor-pointer ${
                              isSelected
                                ? 'border-[#004ac6] ring-2 ring-[#004ac6] shadow-[0_4px_16px_rgba(0,74,198,0.18)] bg-white'
                                : 'border-[#c3c6d7] hover:border-[#004ac6] bg-white'
                            }`}
                          >
                            {node.avatarUrl ? (
                              <img
                                alt={node.name}
                                src={node.avatarUrl}
                                className="w-16 h-16 rounded-full object-cover mb-2 border-2 border-white shadow-xs"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-[#645efb] text-white flex items-center justify-center text-xl font-bold mb-2 border-2 border-white shadow-xs">
                                {node.initials || node.name.slice(0, 2).toUpperCase()}
                              </div>
                            )}

                            <h3 className="text-lg font-semibold text-[#0b1c30] text-center truncate max-w-full">
                              {node.name}
                            </h3>
                            <p className="text-sm text-[#434655] text-center mb-2 truncate max-w-full">
                              {node.title}
                            </p>
                            <div className="bg-[#e5eeff] px-2.5 py-0.5 rounded text-[#004ac6] text-xs font-semibold mb-2">
                              {node.department}
                            </div>

                            {/* Expand/Collapse badge if sub-children exist */}
                            {subChildren.length > 0 && onToggleExpand && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleExpand(node.id);
                                }}
                                className="mb-1 text-[11px] font-medium text-[#434655] hover:text-[#004ac6] flex items-center gap-0.5 bg-[#eff4ff] px-2 py-0.5 rounded-full"
                              >
                                <span>{subChildren.length} reports</span>
                                <span className="material-symbols-outlined text-[14px]">
                                  {isExpanded ? 'expand_less' : 'expand_more'}
                                </span>
                              </button>
                            )}

                            {/* Add Child Node Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddChildNode(node.id);
                              }}
                              className="absolute -bottom-3 bg-white border border-[#c3c6d7] rounded-full w-6 h-6 flex items-center justify-center text-[#434655] hover:text-[#004ac6] hover:border-[#004ac6] hover:scale-110 active:scale-95 transition-all shadow-xs cursor-pointer z-20"
                              title={`Add report to ${node.name}`}
                            >
                              <span className="material-symbols-outlined text-[16px]">add</span>
                            </button>
                          </div>

                          {/* Level 2 Sub-children when expanded */}
                          {isExpanded && subChildren.length > 0 && (
                            <div className="flex flex-col items-center relative w-full pt-8">
                              <div className="w-[2px] h-8 bg-[#c3c6d7] absolute top-0"></div>
                              <div className="flex gap-4 items-start relative pt-6">
                                {subChildren.length > 1 && (
                                  <div
                                    className="h-[2px] bg-[#c3c6d7] absolute top-6"
                                    style={{
                                      left: 'calc(13rem / 2)',
                                      right: 'calc(13rem / 2)',
                                    }}
                                  ></div>
                                )}
                                {subChildren.map((child) => (
                                  <div key={child.id} className="flex flex-col items-center relative">
                                    <div className="w-[2px] h-6 bg-[#c3c6d7] absolute -top-6"></div>
                                    <div
                                      id={`node-${child.id}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectNode(child);
                                      }}
                                      className={`org-card bg-white border rounded-lg p-3 flex flex-col items-center w-52 relative z-10 cursor-pointer ${
                                        selectedNodeId === child.id
                                          ? 'border-[#004ac6] ring-2 ring-[#004ac6] shadow-sm'
                                          : 'border-[#c3c6d7] hover:border-[#004ac6]'
                                      }`}
                                    >
                                      {child.avatarUrl ? (
                                        <img
                                          alt={child.name}
                                          src={child.avatarUrl}
                                          className="w-10 h-10 rounded-full object-cover mb-1 border"
                                        />
                                      ) : (
                                        <div className="w-10 h-10 rounded-full bg-[#dce9ff] text-[#004ac6] flex items-center justify-center text-sm font-bold mb-1">
                                          {child.initials || child.name.slice(0, 2).toUpperCase()}
                                        </div>
                                      )}
                                      <h4 className="text-sm font-semibold text-[#0b1c30] text-center truncate max-w-full">
                                        {child.name}
                                      </h4>
                                      <p className="text-xs text-[#434655] text-center truncate max-w-full">
                                        {child.title}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Pill: Drag to pan • Scroll to zoom */}
      <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-xs border border-[#c3c6d7] rounded-lg px-3 py-2 flex items-center gap-2 text-[#434655] text-xs font-medium shadow-sm pointer-events-none select-none">
        <span className="material-symbols-outlined text-[16px]">pan_tool</span>
        <span>Drag to pan • Scroll to zoom</span>
      </div>

      {/* Quick View Controls Float on Bottom Left */}
      <div className="absolute bottom-6 left-6 bg-white border border-[#c3c6d7] rounded-lg shadow-sm p-1 flex items-center gap-1 z-30">
        <button
          onClick={() => onZoomChange(Math.max(0.5, zoomLevel - 0.1))}
          className="p-1.5 hover:bg-[#e5eeff] rounded text-[#434655] hover:text-[#004ac6] cursor-pointer"
          title="Zoom out"
        >
          <span className="material-symbols-outlined text-[18px]">remove</span>
        </button>
        <span className="text-xs font-mono text-[#0b1c30] px-1">{Math.round(zoomLevel * 100)}%</span>
        <button
          onClick={() => onZoomChange(Math.min(2.0, zoomLevel + 0.1))}
          className="p-1.5 hover:bg-[#e5eeff] rounded text-[#434655] hover:text-[#004ac6] cursor-pointer"
          title="Zoom in"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
        </button>
        <div className="w-px h-3.5 bg-[#c3c6d7] mx-0.5"></div>
        <button
          onClick={() => {
            setPan({ x: 0, y: 0 });
            onZoomChange(1.0);
          }}
          className="p-1.5 hover:bg-[#e5eeff] rounded text-[#434655] hover:text-[#004ac6] cursor-pointer"
          title="Reset position & zoom"
        >
          <span className="material-symbols-outlined text-[18px]">center_focus_strong</span>
        </button>
      </div>
    </main>
  );
};
