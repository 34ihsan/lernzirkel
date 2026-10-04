"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Heading2, Heading3, Undo, Redo, Quote, Code } from 'lucide-react';
import { useEffect } from 'react';

interface RichTextEditorProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  rows?: number;
}

export default function RichTextEditor({ label, value, onChange, rows = 5 }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none px-4 py-3 min-h-[${rows * 24}px]`,
      },
    },
  });

  // Update editor content when value changes from outside (e.g. initial load)
  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="w-full">
        <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
        <div className={`min-h-[${rows * 24}px] border border-gray-300 rounded-md bg-gray-50 flex items-center justify-center text-sm text-gray-500`}>Yükleniyor...</div>
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL:', previousUrl);
    
    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
      <div className="border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm flex flex-col">
        {/* Toolbar */}
        <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1 items-center sticky top-0 z-10">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`p-1.5 rounded text-gray-600 hover:bg-gray-200 transition-colors ${editor.isActive('bold') ? 'bg-gray-200 text-gray-900 font-semibold' : ''}`}
            title="Kalın"
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded text-gray-600 hover:bg-gray-200 transition-colors ${editor.isActive('italic') ? 'bg-gray-200 text-gray-900' : ''}`}
            title="İtalik"
          >
            <Italic size={16} />
          </button>
          
          <div className="w-px h-5 bg-gray-300 mx-1" />
          
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1.5 rounded text-gray-600 hover:bg-gray-200 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-gray-900' : ''}`}
            title="Başlık 2"
          >
            <Heading2 size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-1.5 rounded text-gray-600 hover:bg-gray-200 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-gray-900' : ''}`}
            title="Başlık 3"
          >
            <Heading3 size={16} />
          </button>

          <div className="w-px h-5 bg-gray-300 mx-1" />

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded text-gray-600 hover:bg-gray-200 transition-colors ${editor.isActive('bulletList') ? 'bg-gray-200 text-gray-900' : ''}`}
            title="Maddeli Liste"
          >
            <List size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded text-gray-600 hover:bg-gray-200 transition-colors ${editor.isActive('orderedList') ? 'bg-gray-200 text-gray-900' : ''}`}
            title="Numaralı Liste"
          >
            <ListOrdered size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded text-gray-600 hover:bg-gray-200 transition-colors ${editor.isActive('blockquote') ? 'bg-gray-200 text-gray-900' : ''}`}
            title="Alıntı"
          >
            <Quote size={16} />
          </button>

          <div className="w-px h-5 bg-gray-300 mx-1" />

          <button
            type="button"
            onClick={setLink}
            className={`p-1.5 rounded text-gray-600 hover:bg-gray-200 transition-colors ${editor.isActive('link') ? 'bg-gray-200 text-blue-600' : ''}`}
            title="Bağlantı Ekle/Düzenle"
          >
            <LinkIcon size={16} />
          </button>
          
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-1.5 rounded text-gray-600 hover:bg-gray-200 transition-colors ${editor.isActive('codeBlock') ? 'bg-gray-200 text-gray-900' : ''}`}
            title="Kod Bloğu"
          >
            <Code size={16} />
          </button>

          <div className="flex-1" />
          
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="p-1.5 rounded text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-30"
            title="Geri Al"
          >
            <Undo size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="p-1.5 rounded text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-30"
            title="İleri Al"
          >
            <Redo size={16} />
          </button>
        </div>

        {/* Editor Content */}
        <div className="flex-1 cursor-text bg-white" onClick={() => editor.commands.focus()}>
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
