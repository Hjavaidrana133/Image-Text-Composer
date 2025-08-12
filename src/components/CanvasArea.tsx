import React from 'react';
import { Upload } from 'lucide-react';
import { CanvasAreaProps } from '../types';

const CanvasArea: React.FC<CanvasAreaProps> = ({
  appState,
  canvasRef,
  selectedLayer,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  fileInputRef,
}) => {
  return (
    <div className="flex-1 p-8 overflow-auto bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Canvas Header */}
        <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  Canvas
                </h2>
                {appState.backgroundImage && (
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {appState.imageWidth} × {appState.imageHeight}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {selectedLayer && (
                <div className="text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-full border border-blue-200">
                  <span className="font-medium">Selected:</span>{" "}
                  <span className="text-blue-700 font-semibold">
                    {selectedLayer.text.split("\n")[0] || "Empty Text"}
                  </span>
                </div>
              )}

              <div className="text-xs text-gray-500 space-y-1">
                <div>Use arrow keys to nudge</div>
                <div>Ctrl+Z/Y for undo/redo</div>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas Content */}
        <div className="p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-[600px] flex items-center justify-center">
          {appState.backgroundImage ? (
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="border-2 border-gray-200 rounded-2xl shadow-xl max-w-full max-h-full cursor-default hover:shadow-2xl transition-shadow duration-300"
                style={{
                  maxWidth: "calc(100vw - 500px)",
                  maxHeight: "calc(100vh - 300px)",
                  filter: "drop-shadow(0 20px 25px rgb(0 0 0 / 0.15))",
                }}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
              />

              {/* Canvas tools overlay */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>Snap guides</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Selection</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Upload className="w-16 h-16 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Ready to Create
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                Upload a PNG image to start creating beautiful text
                compositions. Your canvas will automatically match the image
                dimensions.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3 mx-auto"
              >
                <Upload size={20} />
                <span>Choose Your Image</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CanvasArea;