import React from 'react';
import Editor, { createButton, DefaultEditor } from 'react-simple-wysiwyg';

export default function RichTextEditor({ 
  label, 
  value, 
  onChange,
  rows = 5
}: { 
  label: string, 
  value?: string, 
  onChange: (v: string) => void,
  rows?: number
}) {
  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
      <div className="rounded-md border border-gray-300 shadow-sm overflow-hidden bg-white">
        <DefaultEditor 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)} 
          style={{ 
            minHeight: `${rows * 24}px`, 
            padding: '12px',
            border: 'none',
            outline: 'none'
          }}
        />
      </div>
    </div>
  );
}
