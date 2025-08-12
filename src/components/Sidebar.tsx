import React from 'react';
import { Type } from 'lucide-react';
import { SidebarProps } from '../types';
import UploadSection from './UploadSection';
import QuickActions from './QuickActions';
import TextProperties from './TextProperties';
import LayersPanel from './LayersPanel';

const Sidebar: React.FC<SidebarProps> = ({
  appState,
  setAppState,
  fileInputRef,
  selectedLayer,
  history,
  historyIndex,
  onFileUpload,
  onAddTextLayer,
  onUndo,
  onRedo,
  onExport,
  onReset,
  onUpdateLayer,
  onDeleteLayer,
  onDuplicateLayer,
  onMoveLayer,
}) => {
  return (
    <div className="w-96 bg-white/95 backdrop-blur-sm shadow-2xl border-r border-gray-200/50 flex flex-col max-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 p-6 z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Type className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">TextCanvas</h1>
            <p className="text-sm text-gray-500">Image Text Composer</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <UploadSection 
            onFileUpload={onFileUpload} 
            fileInputRef={fileInputRef} 
          />
          
          <QuickActions
            appState={appState}
            setAppState={setAppState}
            onAddTextLayer={onAddTextLayer}
            onUndo={onUndo}
            onRedo={onRedo}
            onExport={onExport}
            onReset={onReset}
            history={history}
            historyIndex={historyIndex}
          />

          <TextProperties
            appState={appState}
            setAppState={setAppState}
            selectedLayer={selectedLayer}
            onUpdateLayer={onUpdateLayer}
          />

          <LayersPanel
            appState={appState}
            setAppState={setAppState}
            onUpdateLayer={onUpdateLayer}
            onDeleteLayer={onDeleteLayer}
            onDuplicateLayer={onDuplicateLayer}
            onMoveLayer={onMoveLayer}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;