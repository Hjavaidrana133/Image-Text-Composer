import React from 'react';
import { Upload } from 'lucide-react';
import { UploadSectionProps } from '../types';

const UploadSection: React.FC<UploadSectionProps> = ({ 
  onFileUpload, 
  fileInputRef 
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100">
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-medium"
      >
        <Upload size={20} />
        <span>Upload PNG Image</span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".png"
        onChange={onFileUpload}
        className="hidden"
      />
      <p className="text-xs text-gray-500 text-center mt-2">
        Drag & drop or click to upload your PNG image
      </p>
    </div>
  );
};

export default UploadSection;