export interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  color: string;
  opacity: number;
  alignment: 'left' | 'center' | 'right';
  rotation: number;
  visible: boolean;
  locked: boolean;
}

export interface AppState {
  backgroundImage: string | null;
  imageWidth: number;
  imageHeight: number;
  textLayers: TextLayer[];
  selectedLayerId: string | null;
  selectedLayerIds: string[];
}

export interface HistoryState {
  state: AppState;
  timestamp: number;
}

// Component props interfaces
export interface BaseComponentProps {
  appState: AppState;
  setAppState: (state: AppState | ((prev: AppState) => AppState)) => void;
}

export interface UploadSectionProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export interface QuickActionsProps extends BaseComponentProps {
  onAddTextLayer: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
  onReset: () => void;
  history: HistoryState[];
  historyIndex: number;
}

export interface TextPropertiesProps extends BaseComponentProps {
  selectedLayer: TextLayer | undefined;
  onUpdateLayer: (id: string, updates: Partial<TextLayer>) => void;
}

export interface LayersPanelProps extends BaseComponentProps {
  onUpdateLayer: (id: string, updates: Partial<TextLayer>) => void;
  onDeleteLayer: (id: string) => void;
  onDuplicateLayer: (id: string) => void;
  onMoveLayer: (id: string, direction: 'up' | 'down') => void;
}

export interface CanvasAreaProps extends BaseComponentProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  selectedLayer: TextLayer | undefined;
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export interface SidebarProps extends BaseComponentProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  selectedLayer: TextLayer | undefined;
  history: HistoryState[];
  historyIndex: number;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddTextLayer: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
  onReset: () => void;
  onUpdateLayer: (id: string, updates: Partial<TextLayer>) => void;
  onDeleteLayer: (id: string) => void;
  onDuplicateLayer: (id: string) => void;
  onMoveLayer: (id: string, direction: 'up' | 'down') => void;
}