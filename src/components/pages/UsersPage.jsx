import React, { useEffect, useState } from 'react';
import InviteUser from '../auth/InviteUser';
import { useStore } from '../../store';

const UsersPage = () => {
  const { profiles, loadProfiles, upsertProfile, deleteProfile } = useStore();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ full_name: '', email: '', role: 'member' });

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const startEdit = (p) => {
    setEditing(p.id);
    setForm({ full_name: p.full_name || '', email: p.email || '', role: p.role || 'member' });
  };
  const cancel = () => { setEditing(null); setForm({ full_name: '', email: '', role: 'member' }); };
  const save = async () => {
    await upsertProfile({ id: editing, ...form });
    cancel();
  };
  const create = async () => {
    await upsertProfile({ ...form, id: undefined });
    setForm({ full_name: '', email: '', role: 'member' });
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Invite user</h2>
        <p className="text-sm text-gray-600 mb-4">Send a magic link to onboard a user.</p>
        <InviteUser />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Profiles</h2>

        {/* Create new */}
        <div className="flex flex-wrap items-end gap-3 mb-4">
          <input value={form.full_name} onChange={(e)=>setForm(f=>({...f, full_name:e.target.value}))} placeholder="Full name" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          <input value={form.email} onChange={(e)=>setForm(f=>({...f, email:e.target.value}))} placeholder="Email" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          <select value={form.role} onChange={(e)=>setForm(f=>({...f, role:e.target.value}))} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
          </select>
          {editing ? (
            <>
              <button onClick={save} className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm">Save</button>
              <button onClick={cancel} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
            </>
          ) : (
            <button onClick={create} className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm">Create</button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(profiles || []).map((p) => (
                <tr key={p.id} className="border-b last:border-b-0">
                  <td className="py-2 pr-4">{p.full_name || '—'}</td>
                  <td className="py-2 pr-4">{p.email || '—'}</td>
                  <td className="py-2 pr-4 capitalize">{p.role || 'member'}</td>
                  <td className="py-2 pr-4">
                    <div className="flex gap-2">
                      <button onClick={()=>startEdit(p)} className="px-2 py-1 border border-gray-300 rounded-lg text-xs">Edit</button>
                      <button onClick={()=>deleteProfile(p.id)} className="px-2 py-1 border border-red-300 text-red-700 rounded-lg text-xs">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
