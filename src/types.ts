export interface OrgNode {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  avatarUrl?: string;
  initials?: string;
  tags: string[];
  parentId?: string | null;
  isExpanded?: boolean;
}

export interface ExportConfig {
  format: 'pdf' | 'png' | 'svg' | 'csv';
  scope: 'full' | 'current' | 'department';
  department: string;
  includeProfilePhotos: boolean;
  showConnectorLabels: boolean;
  highContrastMode: boolean;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  category: 'Enterprise' | 'Startup' | 'Education' | 'Healthcare' | 'Agile';
  icon: string;
  tag: string;
  nodes: OrgNode[];
}

export type ActiveScreen = 'editor' | 'export' | 'templates';

export type NavTab = 'directory' | 'properties' | 'import' | 'history' | 'templates' | 'hierarchy';
