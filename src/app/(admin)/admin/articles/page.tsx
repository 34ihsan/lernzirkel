'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, ExternalLink, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<any>(null);
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('ALLGEMEIN');
  const [coverImage, setCoverImage] = useState('');
  const [author, setAuthor] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      setArticles(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setCoverImage(data.url);
      } else {
        alert(data.error || 'Fehler beim Hochladen');
      }
    } catch (error) {
      console.error(error);
      alert('Netzwerkfehler beim Hochladen');
    } finally {
      setIsUploading(false);
    }
  };

  const openNewForm = () => {
    setCurrentArticle(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setCategory('ALLGEMEIN');
    setCoverImage('');
    setAuthor('');
    setIsPublished(true);
    setIsFormOpen(true);
  };

  const openEditForm = (article: any) => {
    setCurrentArticle(article);
    setTitle(article.title || '');
    setSlug(article.slug || '');
    setExcerpt(article.excerpt || '');
    setContent(article.content || '');
    setCategory(article.category || 'ALLGEMEIN');
    setCoverImage(article.coverImage || '');
    setAuthor(article.author || '');
    setIsPublished(article.isPublished);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Soll dieser Artikel wirklich gelöscht werden?')) return;
    
    try {
      await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      fetchArticles();
    } catch (err) {
      alert('Fehler beim Löschen');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      title, slug, excerpt, content, category, coverImage, author, isPublished
    };

    try {
      const url = currentArticle ? `/api/articles/${currentArticle.id}` : '/api/articles';
      const method = currentArticle ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await res.json();
      if (res.ok) {
        setIsFormOpen(false);
        fetchArticles();
      } else {
        alert(result.error || 'Fehler beim Speichern');
      }
    } catch (err) {
      alert('Netzwerkfehler');
    }
  };

  const filteredArticles = articles.filter((a: any) => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog & Artikel</h1>
          <p className="text-gray-500 text-sm">Verwalten Sie hier alle Makaleler (Artikel) für die /blog Seite.</p>
        </div>
        <Button onClick={openNewForm} className="bg-primary hover:bg-primary-light">
          <Plus className="w-4 h-4 mr-2" /> Neuer Artikel
        </Button>
      </div>

      {!isFormOpen ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Suchen..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Titel</th>
                  <th className="px-6 py-4">Kategorie</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Datum</th>
                  <th className="px-6 py-4 text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr><td colSpan={5} className="text-center py-8 text-gray-500">Lädt...</td></tr>
                ) : filteredArticles.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-gray-500">Keine Artikel gefunden.</td></tr>
                ) : (
                  filteredArticles.map((article: any) => (
                    <tr key={article.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-medium text-gray-900">{article.title}</td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                          {article.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {article.isPublished ? (
                          <span className="text-emerald-600 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Veröffentlicht</span>
                        ) : (
                          <span className="text-amber-600 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Entwurf</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(article.publishedAt).toLocaleDateString('de-DE')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/blog/${article.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Ansehen">
                            <ExternalLink size={16} />
                          </Link>
                          <button onClick={() => openEditForm(article)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Bearbeiten">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(article.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Löschen">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-gray-900">{currentArticle ? 'Artikel bearbeiten' : 'Neuen Artikel erstellen'}</h2>
            <button type="button" onClick={() => setIsFormOpen(false)} className="text-gray-500 hover:text-gray-700">Abbrechen</button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
                  <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Inhalt (HTML / Rich Text)</label>
                  <p className="text-xs text-gray-500 mb-2">Hier können Sie den kompletten Text Ihres Artikels eintragen. HTML-Tags wie &lt;b&gt; oder &lt;br/&gt; können verwendet werden.</p>
                  <textarea required value={content} onChange={(e) => setContent(e.target.value)} rows={15} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono text-sm" />
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 mb-4 focus:outline-none">
                    <option value="ALLGEMEIN">Allgemein (Allgemein)</option>
                    <option value="MFD">MFD (Migrationsfachdienst)</option>
                    <option value="INTEGRATION">Integration (Integrationskurse)</option>
                    <option value="NACHHILFE">Nachhilfe (Nachhilfe)</option>
                  </select>

                  <label className="block text-sm font-medium text-gray-700 mb-1">URL (Slug)</label>
                  <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Wird automatisch generiert" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 mb-4 text-sm" />
                  
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kurzzusammenfassung (Excerpt)</label>
                  <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 mb-4 text-sm" />
                  
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yazar İsmi (Opsiyonel)</label>
                  <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Yazar adını girin..." className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 mb-4 text-sm" />

                  <label className="block text-sm font-medium text-gray-700 mb-1">Kapak Fotoğrafı (Cover Image)</label>
                  <div className="mb-4">
                    <div className="flex gap-2 mb-2">
                      <input 
                        type="text" 
                        value={coverImage} 
                        onChange={(e) => setCoverImage(e.target.value)} 
                        placeholder="https://... veya dosya yükle" 
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm" 
                      />
                      <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center justify-center">
                        {isUploading ? 'Yükleniyor...' : <><Upload size={14} className="mr-1" /> Yükle</>}
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                      </label>
                    </div>
                    {coverImage && (
                      <div className="mt-2 relative rounded-lg overflow-hidden h-32 border border-gray-200 bg-gray-100">
                        <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer mt-4">
                    <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="w-4 h-4 text-primary rounded" />
                    <span className="text-sm font-medium text-gray-900">Veröffentlicht (Online)</span>
                  </label>
                </div>
                
                <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary-light">
                  {currentArticle ? 'Änderungen speichern' : 'Artikel veröffentlichen'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
