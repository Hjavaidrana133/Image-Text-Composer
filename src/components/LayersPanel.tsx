import React from 'react';
import { Type, Eye, EyeOff, Lock, Unlock, Copy } from 'lucide-react';
import { LayersPanelProps } from '../types';

const LayersPanel: React.FC<LayersPanelProps> = ({
  appState,
  setAppState,
  onUpdateLayer,
  onDeleteLayer,
  onDuplicateLayer,
  onMoveLayer,
}) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          Layers
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {appState.textLayers.length} layers
          </span>
        </div>
      </div>

      {appState.textLayers.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Type className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm mb-2">
            No text layers yet
          </p>
          <p className="text-gray-400 text-xs">
            Click "Add Text" to create your first layer
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96">
          {appState.textLayers
            .slice()
            .reverse()
            .map((layer, index) => (
              <div
                key={layer.id}
                className={`group p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                  appState.selectedLayerId === layer.id
                    ? "border-blue-300 bg-blue-50 shadow-md transform scale-[1.02]"
                    : "border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:bg-white"
                }`}
                onClick={() =>
                  setAppState((prev) => ({
                    ...prev,
                    selectedLayerId: layer.id,
                    selectedLayerIds: [layer.id],
                  }))
                }
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="flex flex-col gap-2 mt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateLayer(layer.id, {
                            visible: !layer.visible,
                          });
                        }}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          layer.visible
                            ? "bg-green-100 text-green-600 hover:bg-green-200"
                            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        }`}
                        title={
                          layer.visible ? "Hide layer" : "Show layer"
                        }
                      >
                        {layer.visible ? (
                          <Eye size={14} />
                        ) : (
                          <EyeOff size={14} />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateLayer(layer.id, {
                            locked: !layer.locked,
                          });
                        }}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          layer.locked
                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        }`}
                        title={
                          layer.locked ? "Unlock layer" : "Lock layer"
                        }
                      >
                        {layer.locked ? (
                          <Lock size={14} />
                        ) : (
                          <Unlock size={14} />
                        )}
                      </button>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-gray-400 bg-gray-200 px-2 py-1 rounded-full">
                          #{appState.textLayers.length - index}
                        </span>
                        <span className="text-sm font-semibold text-gray-900 truncate">
                          {layer.text.split("\n")[0] || "Empty Text"}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500 space-y-1">
                        <div className="flex items-center gap-4">
                          <span
                            style={{ fontFamily: layer.fontFamily }}
                            className="truncate"
                          >
                            {layer.fontFamily}
                          </span>
                          <span className="text-blue-600 font-medium">
                            {layer.fontSize}px
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded border-2 border-white shadow-sm"
                            style={{ backgroundColor: layer.color }}
                          ></div>
                          <span>{layer.opacity}% opacity</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateLayer(layer.id);
                      }}
                      className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-all duration-200"
                      title="Duplicate layer"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveLayer(layer.id, "up");
                      }}
                      disabled={index === 0}
                      className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                      title="Move layer up"
                    >
                      <div className="text-sm font-bold">↑</div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveLayer(layer.id, "down");
                      }}
                      disabled={
                        index === appState.textLayers.length - 1
                      }
                      className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                      title="Move layer down"
                    >
                      <div className="text-sm font-bold">↓</div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Delete this layer?")) {
                          onDeleteLayer(layer.id);
                        }
                      }}
                      className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all duration-200"
                      title="Delete layer"
                    >
                      <div className="text-sm font-bold">×</div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default LayersPanel;