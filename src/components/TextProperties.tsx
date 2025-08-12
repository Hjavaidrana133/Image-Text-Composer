import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import { TextPropertiesProps } from '../types';
import { GOOGLE_FONTS, FONT_WEIGHTS } from '../constants';

const TextProperties: React.FC<TextPropertiesProps> = ({
  selectedLayer,
  onUpdateLayer,
}) => {
  if (!selectedLayer) return null;

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          Text Properties
        </h3>
        <div className="flex items-center gap-1">
          {selectedLayer.locked ? (
            <Lock size={14} className="text-red-400" />
          ) : (
            <Unlock size={14} className="text-green-400" />
          )}
          <span className="text-xs text-gray-500">
            {selectedLayer.locked ? "Locked" : "Unlocked"}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Text Content
          </label>
          <textarea
            value={selectedLayer.text}
            onChange={(e) =>
              onUpdateLayer(selectedLayer.id, { text: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
            rows={3}
            disabled={selectedLayer.locked}
            placeholder="Enter your text..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Family
            </label>
            <select
              value={selectedLayer.fontFamily}
              onChange={(e) =>
                onUpdateLayer(selectedLayer.id, {
                  fontFamily: e.target.value,
                })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              disabled={selectedLayer.locked}
            >
              {GOOGLE_FONTS.map((font) => (
                <option
                  key={font}
                  value={font}
                  style={{ fontFamily: font }}
                >
                  {font}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Weight
            </label>
            <select
              value={selectedLayer.fontWeight}
              onChange={(e) =>
                onUpdateLayer(selectedLayer.id, {
                  fontWeight: e.target.value,
                })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              disabled={selectedLayer.locked}
            >
              {FONT_WEIGHTS.map((weight) => (
                <option key={weight} value={weight}>
                  {weight === "400"
                    ? "Normal"
                    : weight === "700"
                    ? "Bold"
                    : weight}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Size
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {selectedLayer.fontSize}px
              </span>
            </label>
            <div className="px-2">
              <input
                type="range"
                min="8"
                max="200"
                value={selectedLayer.fontSize}
                onChange={(e) =>
                  onUpdateLayer(selectedLayer.id, {
                    fontSize: parseInt(e.target.value),
                  })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                disabled={selectedLayer.locked}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opacity
              <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                {selectedLayer.opacity}%
              </span>
            </label>
            <div className="px-2">
              <input
                type="range"
                min="0"
                max="100"
                value={selectedLayer.opacity}
                onChange={(e) =>
                  onUpdateLayer(selectedLayer.id, {
                    opacity: parseInt(e.target.value),
                  })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                disabled={selectedLayer.locked}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={selectedLayer.color}
                onChange={(e) =>
                  onUpdateLayer(selectedLayer.id, {
                    color: e.target.value,
                  })
                }
                className="w-12 h-12 border-2 border-gray-200 rounded-xl cursor-pointer"
                disabled={selectedLayer.locked}
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={selectedLayer.color}
                  onChange={(e) =>
                    onUpdateLayer(selectedLayer.id, {
                      color: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white"
                  disabled={selectedLayer.locked}
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Alignment
            </label>
            <div className="flex rounded-xl border border-gray-200 p-1 bg-gray-50">
              {(["left", "center", "right"] as const).map((align) => (
                <button
                  key={align}
                  onClick={() =>
                    onUpdateLayer(selectedLayer.id, {
                      alignment: align,
                    })
                  }
                  disabled={selectedLayer.locked}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg transition-all duration-200 font-medium ${
                    selectedLayer.alignment === align
                      ? "bg-blue-500 text-white shadow-md"
                      : "text-gray-600 hover:bg-white hover:shadow-sm"
                  } disabled:opacity-50`}
                >
                  {align.charAt(0).toUpperCase() + align.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextProperties;