import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const StationsAdmin = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [defaultShellLogoUrl, setDefaultShellLogoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const supaReady = Boolean(supabase);

  const fetchStations = async () => {
    if (!supaReady) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shell')
        .select('id, brand, name, logo_url')
        .order('name', { ascending: true });
      if (error) throw error;
      setStations(data || []);
    } catch (e) {
      console.error('Load stations failed', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStations(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return stations;
    return stations.filter(s => (s.name || '').toLowerCase().includes(q) || (s.brand || '').toLowerCase().includes(q));
  }, [stations, search]);

  const saveRow = async (id, logoUrl) => {
    if (!supaReady) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('shell').update({ logo_url: logoUrl }).eq('id', id);
      if (error) throw error;
      setStations(prev => prev.map(s => (s.id === id ? { ...s, logo_url: logoUrl } : s)));
    } catch (e) {
      console.error('Update logo failed', e);
    } finally {
      setSaving(false);
    }
  };

  const bulkApplyShell = async () => {
    if (!supaReady || !defaultShellLogoUrl) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('shell').update({ logo_url: defaultShellLogoUrl }).ilike('brand', 'shell');
      if (error) throw error;
      setStations(prev => prev.map(s => (/^shell$/i.test(s.brand || '') ? { ...s, logo_url: defaultShellLogoUrl } : s)));
    } catch (e) {
      console.error('Bulk apply failed', e);
    } finally {
      setSaving(false);
    }
  };

  const uploadShellLogo = async (file) => {
    if (!supaReady || !file) return;
    setUploading(true);
    try {
      // Prefer 'logos' bucket, fallback to 'public'
      const fileNameSafe = `shell-${Date.now()}.${(file.name.split('.').pop() || 'png').toLowerCase()}`;
      const path = `shell/${fileNameSafe}`;
      let bucket = 'logos';
      let up = await supabase.storage.from(bucket).upload(path, file, { upsert: true, cacheControl: '3600', contentType: file.type });
      if (up.error) {
        bucket = 'public';
        up = await supabase.storage.from(bucket).upload(path, file, { upsert: true, cacheControl: '3600', contentType: file.type });
        if (up.error) throw up.error;
      }
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      const url = data?.publicUrl;
      if (url) setDefaultShellLogoUrl(url);
    } catch (e) {
      console.error('Upload failed', e);
      alert('Upload failed. Ensure a Storage bucket named "logos" or "public" exists and is public.');
    } finally {
      setUploading(false);
    }
  };

  if (!supaReady) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-lg font-semibold mb-2">Stations Admin</h3>
        <p className="text-sm text-gray-600">Supabase not configured. Set env vars to manage logos here. UI will still show fallback logo from <code>/logos/shell.png</code>.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="text-lg font-semibold">Stations Admin</h3>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name/brand"
            className="input input-sm input-bordered w-48"
          />
          <button onClick={fetchStations} className="btn btn-sm" disabled={loading}>{loading ? 'Refreshing…' : 'Refresh'}</button>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg border border-emerald-200 bg-emerald-50/60">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-emerald-800">Default Shell logo URL:</span>
          <input
            value={defaultShellLogoUrl}
            onChange={e => setDefaultShellLogoUrl(e.target.value)}
            placeholder="https://.../shell.png"
            className="input input-sm input-bordered w-80"
          />
          <label className="btn btn-sm">
            {uploading ? 'Uploading…' : 'Upload file'}
            <input type="file" accept="image/*" className="hidden" onChange={(e)=> uploadShellLogo(e.target.files?.[0])} />
          </label>
          <button onClick={bulkApplyShell} className="btn btn-sm btn-success text-white" disabled={!defaultShellLogoUrl || saving}>
            {saving ? 'Applying…' : 'Apply to all Shell rows'}
          </button>
        </div>
        {defaultShellLogoUrl && (
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs text-gray-600">Preview:</span>
            <img src={defaultShellLogoUrl} alt="Shell logo preview" className="w-10 h-10 object-contain border rounded" />
          </div>
        )}
      </div>

      <div className="mt-4 overflow-auto">
        <table className="table table-sm">
          <thead>
            <tr>
              <th className="whitespace-nowrap">Brand</th>
              <th className="min-w-[200px]">Name</th>
              <th className="min-w-[360px]">Logo URL</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <Row key={s.id} s={s} onSave={saveRow} />
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-sm text-gray-500 p-3">No stations found.</div>
        )}
      </div>
    </div>
  );
};

const Row = ({ s, onSave }) => {
  const [val, setVal] = useState(s.logo_url || '');
  const dirty = val !== (s.logo_url || '');
  return (
    <tr>
      <td className="font-medium">{s.brand || '—'}</td>
      <td className="truncate max-w-[320px]" title={s.name}>{s.name}</td>
      <td>
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="https://.../logo.png"
          className="input input-xs input-bordered w-full"
        />
      </td>
      <td className="text-right">
        <button className="btn btn-xs" disabled={!dirty} onClick={() => onSave(s.id, val)}>Save</button>
      </td>
    </tr>
  );
};

export default StationsAdmin;
