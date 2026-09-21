import React, { useState, useEffect, useCallback } from 'react';
import { OrgNode, Template, ActiveScreen, NavTab } from './types';
import { INITIAL_NODES } from './data/initialData';
import { TopNavBar } from './components/TopNavBar';
import { SideNavBar } from './components/SideNavBar';
import { OrgCanvas } from './components/OrgCanvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { ExportModal } from './components/ExportModal';
import { TemplatesScreen } from './components/TemplatesScreen';
import { AddNodeModal } from './components/AddNodeModal';
import { DirectoryModal } from './components/DirectoryModal';
import { ImportModal } from './components/ImportModal';
import { HistoryModal } from './components/HistoryModal';
import { HelpModal } from './components/HelpModal';
import { SettingsModal } from './components/SettingsModal';

interface HistorySnapshot {
  timestamp: string;
  description: string;
  nodes: OrgNode[];
}

export default function App() {
  // Navigation & View State
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('editor');
  const [activeTab, setActiveTab] = useState<NavTab>('properties');

  // Chart Data State
  const [chartTitle, setChartTitle] = useState('Corporate Map');
  const [chartSubtitle, setChartSubtitle] = useState('Global Operations');
  const [nodes, setNodes] = useState<OrgNode[]>(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-ceo');

  // Zoom State
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  // Undo / Redo History State
  const [history, setHistory] = useState<HistorySnapshot[]>([
    {
      timestamp: new Date().toLocaleTimeString(),
      description: 'Initial Corporate Map',
      nodes: INITIAL_NODES,
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Modals
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);
  const [targetParentId, setTargetParentId] = useState<string | null>(null);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(true);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Push to history
  const recordHistory = useCallback(
    (newNodes: OrgNode[], description: string) => {
      setHistory((prev) => {
        const sliced = prev.slice(0, historyIndex + 1);
        return [
          ...sliced,
          {
            timestamp: new Date().toLocaleTimeString(),
            description,
            nodes: newNodes,
          },
        ];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  // Undo / Redo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      setNodes(history[nextIndex].nodes);
      showToast(`Undo: ${history[nextIndex].description}`);
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setNodes(history[nextIndex].nodes);
      showToast(`Redo: ${history[nextIndex].description}`);
    }
  }, [historyIndex, history]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        setActiveScreen('export');
      } else if (e.key === 'Escape') {
        setIsAddNodeOpen(false);
        setIsDirectoryOpen(false);
        setIsImportOpen(false);
        setIsHistoryOpen(false);
        setIsHelpOpen(false);
        setIsSettingsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Selected Node Object
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  // Handlers
  const handleSelectNode = (node: OrgNode) => {
    setSelectedNodeId(node.id);
    setIsPropertiesOpen(true);
    setActiveTab('properties');
  };

  const handleUpdateNode = (updated: OrgNode) => {
    const newNodes = nodes.map((n) => (n.id === updated.id ? updated : n));
    setNodes(newNodes);
    recordHistory(newNodes, `Updated ${updated.name}`);
    showToast(`Saved changes to ${updated.name}`);
  };

  const handleDeleteNode = (nodeId: string) => {
    // Delete node and re-parent or delete children
    const target = nodes.find((n) => n.id === nodeId);
    if (!target) return;
    const newNodes = nodes.filter((n) => n.id !== nodeId);
    setNodes(newNodes);
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(newNodes[0]?.id || null);
    }
    recordHistory(newNodes, `Removed ${target.name}`);
    showToast(`Removed ${target.name} from organization`);
  };

  const handleOpenAddNode = (parentId?: string | null) => {
    setTargetParentId(parentId || selectedNodeId || nodes[0]?.id || null);
    setIsAddNodeOpen(true);
  };

  const handleAddNode = (newNode: OrgNode) => {
    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    setSelectedNodeId(newNode.id);
    recordHistory(newNodes, `Added ${newNode.name}`);
    showToast(`Added ${newNode.name} to hierarchy`);
  };

  const handleToggleExpand = (nodeId: string) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, isExpanded: !n.isExpanded } : n))
    );
  };

  const handleSelectTemplate = (template: Template | null) => {
    if (!template) {
      // Start from scratch
      const scratchRoot: OrgNode = {
        id: 'node-root',
        name: 'New Leader',
        title: 'Executive Leader',
        department: 'Executive',
        email: 'leader@company.org',
        initials: 'NL',
        tags: ['Leadership', 'Full-Time'],
        parentId: null,
      };
      setNodes([scratchRoot]);
      setSelectedNodeId('node-root');
      setChartTitle('New Blank Canvas');
      recordHistory([scratchRoot], 'Started from blank canvas');
    } else {
      setNodes(template.nodes);
      setSelectedNodeId(template.nodes[0]?.id || null);
      setChartTitle(template.title);
      recordHistory(template.nodes, `Loaded template: ${template.title}`);
    }
    setActiveScreen('editor');
    showToast('Loaded template onto canvas!');
  };

  const handleImportNodes = (importedNodes: OrgNode[]) => {
    setNodes(importedNodes);
    setSelectedNodeId(importedNodes[0]?.id || null);
    recordHistory(importedNodes, `Imported ${importedNodes.length} members`);
    showToast(`Imported ${importedNodes.length} members successfully!`);
  };

  const handleSideTabClick = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'properties') {
      setIsPropertiesOpen(!isPropertiesOpen);
    } else if (tab === 'directory') {
      setIsDirectoryOpen(true);
    } else if (tab === 'templates') {
      setActiveScreen('templates');
    } else if (tab === 'import') {
      setIsImportOpen(true);
    } else if (tab === 'history') {
      setIsHistoryOpen(true);
    }
  };

  // Render Screen 2: Export Configuration View
  if (activeScreen === 'export') {
    return (
      <ExportModal
        nodes={nodes}
        onClose={() => setActiveScreen('editor')}
        orgName={chartSubtitle || chartTitle}
      />
    );
  }

  // Render Screen 3: Templates / Create New Chart Screen
  if (activeScreen === 'templates') {
    return (
      <TemplatesScreen
        onSelectTemplate={handleSelectTemplate}
        onBackToEditor={() => setActiveScreen('editor')}
        onOpenDirectory={() => setIsDirectoryOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onSignOut={() => showToast('Session signed out.')}
      />
    );
  }

  // Render Screen 1: Primary Org Editor Canvas
  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] h-screen overflow-hidden flex flex-col antialiased">
      {/* Top Navigation Bar */}
      <TopNavBar
        onAddNode={() => handleOpenAddNode()}
        onExport={() => setActiveScreen('export')}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        zoomLevel={zoomLevel}
        onZoomChange={(lvl) => setZoomLevel(lvl)}
        onResetZoom={() => setZoomLevel(1.0)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onGoHome={() => setActiveScreen('editor')}
      />

      {/* Main Workspace Frame */}
      <div className="flex flex-1 mt-16 h-[calc(100vh-64px)] overflow-hidden relative">
        {/* Left Side Navigation Bar */}
        <SideNavBar
          activeTab={activeTab}
          onTabChange={handleSideTabClick}
          onCreateFromTemplate={() => setActiveScreen('templates')}
          onOpenHelp={() => setIsHelpOpen(true)}
          onSignOut={() => showToast('Session signed out.')}
          chartTitle={chartTitle}
          chartSubtitle={chartSubtitle}
        />

        {/* Central Interactive Canvas */}
        <OrgCanvas
          nodes={nodes}
          selectedNodeId={selectedNodeId}
          onSelectNode={handleSelectNode}
          onAddChildNode={(parentId) => handleOpenAddNode(parentId)}
          zoomLevel={zoomLevel}
          onZoomChange={(lvl) => setZoomLevel(lvl)}
          onToggleExpand={handleToggleExpand}
        />

        {/* Right Properties Panel */}
        {isPropertiesOpen && (
          <PropertiesPanel
            selectedNode={selectedNode}
            onClose={() => setIsPropertiesOpen(false)}
            onUpdateNode={handleUpdateNode}
            onDeleteNode={handleDeleteNode}
          />
        )}
      </div>

      {/* Auxiliary Modals */}
      {isAddNodeOpen && (
        <AddNodeModal
          nodes={nodes}
          defaultParentId={targetParentId}
          onClose={() => setIsAddNodeOpen(false)}
          onAddNode={handleAddNode}
        />
      )}

      {isDirectoryOpen && (
        <DirectoryModal
          nodes={nodes}
          onClose={() => setIsDirectoryOpen(false)}
          onSelectNode={handleSelectNode}
          onAddNode={() => {
            setIsDirectoryOpen(false);
            handleOpenAddNode();
          }}
        />
      )}

      {isImportOpen && (
        <ImportModal
          onClose={() => setIsImportOpen(false)}
          onImportNodes={handleImportNodes}
        />
      )}

      {isHistoryOpen && (
        <HistoryModal
          history={history}
          currentIndex={historyIndex}
          onRestore={(index) => {
            setHistoryIndex(index);
            setNodes(history[index].nodes);
            showToast(`Reverted to: ${history[index].description}`);
          }}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}

      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}

      {isSettingsOpen && (
        <SettingsModal
          chartTitle={chartTitle}
          chartSubtitle={chartSubtitle}
          onUpdateTitle={(title, subtitle) => {
            setChartTitle(title);
            setChartSubtitle(subtitle);
            showToast('Updated organization title');
          }}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0b1c30] text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 z-50 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-150">
          <span className="material-symbols-outlined text-[#b4c5ff] text-[18px]">info</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
