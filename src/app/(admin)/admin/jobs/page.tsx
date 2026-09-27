'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function JobsAdminPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'LEHRER',
    description: '',
    requirements: '',
    location: '',
    isActive: true
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/jobs');
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingJob ? `/api/jobs/${editingJob.id}` : '/api/jobs';
      const method = editingJob ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setIsFormOpen(false);
        setEditingJob(null);
        resetForm();
        fetchJobs();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Wirklich löschen?')) return;
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchJobs();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (job: any) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      type: job.type,
      description: job.description,
      requirements: job.requirements || '',
      location: job.location || '',
      isActive: job.isActive
    });
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'LEHRER',
      description: '',
      requirements: '',
      location: '',
      isActive: true
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Stellenangebote (Karriere)</h1>
        <button 
          onClick={() => { resetForm(); setEditingJob(null); setIsFormOpen(true); }}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-light"
        >
          <Plus className="w-4 h-4 mr-2" /> Neue Stelle
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-bold mb-4">{editingJob ? 'Stelle bearbeiten' : 'Neue Stelle hinzufügen'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border p-2 rounded" placeholder="z.B. Lehrkraft für Deutsch" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Typ</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border p-2 rounded">
                  <option value="LEHRER">Lehrkraft</option>
                  <option value="PRAKTIKANT">Praktikant</option>
                  <option value="OTHER">Sonstiges</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Standort</label>
              <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full border p-2 rounded" placeholder="z.B. Ludwigshafen" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
              <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border p-2 rounded h-32" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Anforderungen</label>
              <textarea value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} className="w-full border p-2 rounded h-32" />
            </div>

            <div className="flex items-center">
              <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="mr-2" />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Aktiv (wird auf Webseite angezeigt)</label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200">Abbrechen</button>
              <button type="submit" className="px-4 py-2 text-white bg-primary rounded hover:bg-primary-light">Speichern</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Lade Stellenangebote...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Typ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aktionen</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map(job => (
                <tr key={job.id}>
                  <td className="px-6 py-4 font-medium">{job.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${job.type === 'LEHRER' ? 'bg-blue-100 text-blue-800' : job.type === 'PRAKTIKANT' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {job.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {job.isActive ? <CheckCircle className="text-green-500 w-5 h-5" /> : <XCircle className="text-gray-400 w-5 h-5" />}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(job)} className="text-blue-600 hover:text-blue-900 mr-3">
                      <Edit2 className="w-4 h-4 inline" />
                    </button>
                    <button onClick={() => handleDelete(job.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Keine Stellenangebote gefunden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
