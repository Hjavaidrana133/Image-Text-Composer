import React from 'react';
import { Type, Undo2, Redo2, Download, RefreshCw } from 'lucide-react';
import { QuickActionsProps } from '../types';

const QuickActions: React.FC<QuickActionsProps> = ({
  appState,
  onAddTextLayer,
  onUndo,
  onRedo,
  onExport,
  onReset,
  history,
  historyIndex,
}) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
      <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        Quick Actions
      </h3>

      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={onAddTextLayer}
          className="col-span-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-3 rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-[1.02] font-medium"
        >
          <Type size={16} />
          <span>Add Text</span>
        </button>
        <button
          onClick={onUndo}
          disabled={historyIndex <= 0}
          className="px-3 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-sm hover:shadow-md"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={16} className="text-gray-700" />
        </button>
        <button
          onClick={onRedo}
          disabled={historyIndex >= history.length - 1}
          className="px-3 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-sm hover:shadow-md"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={16} className="text-gray-700" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={onExport}
          disabled={!appState.backgroundImage}
          className="col-span-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-3 rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg font-medium"
        >
          <Download size={16} />
          <span>Export PNG</span>
        </button>
        <button
          onClick={onReset}
          className="px-3 py-3 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-xl hover:from-red-500 hover:to-pink-500 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
          title="Reset Canvas"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
        <span>
          History: {historyIndex + 1}/{history.length}
        </span>
        <span>{appState.textLayers.length} layers</span>
      </div>
    </div>
  );
};

export default QuickActions;