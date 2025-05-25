import { useState, useEffect } from 'react';
import { User, Address } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import {
  AlertCircle,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Trash2,
} from 'lucide-react';

interface UserDetails extends User {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  roles: string[];
  is_active: boolean;
  is_verified: boolean;
  verification_token?: string;
  token_version: number;
  created_at: string;
  updated_at: string;
  profile_pro?: {
    id: string;
    user_id: string;
    address?: Address;
    website?: string;
    business_name?: string;
    created_at: string;
    updated_at: string;
  };
  profile_client?: {
    id: string;
    user_id: string;
    address?: Address;
    created_at: string;
    updated_at: string;
  };
}

export function ManageUsers() {
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'client' | 'pro' | 'admin'>('all');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [expandedUsers, setExpandedUsers] = useState<string[]>([]);
  const [editingCell, setEditingCell] = useState<{
    userId: string;
    field: string;
    value: string;
    table?: 'user' | 'pro' | 'client';
  } | null>(null);
  const { token } = useAuth();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const url = activeTab !== 'all'
        ? `http://127.0.0.1:8000/api/v1/users?role=${activeTab}`
        : 'http://127.0.0.1:8000/api/v1/users';

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeTab, token]);

  const handleCellEdit = async (
    userId: string,
    field: string,
    value: string,
    table: 'user' | 'pro' | 'client' = 'user'
  ) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: value }),
      });

      if (!response.ok) throw new Error('Failed to update user');
      await fetchUsers();
      setEditingCell(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  const renderEditableCell = (
    user: UserDetails,
    field: string,
    value: any,
    table: 'user' | 'pro' | 'client' = 'user'
  ) => {
    const isEditing = editingCell?.userId === user.id &&
                     editingCell?.field === field &&
                     editingCell?.table === table;

    if (isEditing) {
      return (
        <input
          type="text"
          value={editingCell.value}
          onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
          onBlur={() => handleCellEdit(user.id, field, editingCell.value, table)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCellEdit(user.id, field, editingCell.value, table);
            } else if (e.key === 'Escape') {
              setEditingCell(null);
            }
          }}
          className="w-full px-2 py-1 border rounded"
          autoFocus
        />
      );
    }

    return (
      <div
        onDoubleClick={() => setEditingCell({
          userId: user.id,
          field,
          value: String(value ?? ''),
          table
        })}
        className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
      >
        {value ?? '-'}
      </div>
    );
  };

  const renderUserTable = (user: UserDetails) => (
    <table className="min-w-full divide-y divide-gray-200 mb-4">
      <thead className="bg-gray-50">
        <tr>
          {['ID', 'Full Name', 'Email', 'Phone', 'Roles', 'Active', 'Verified', 'Created', 'Updated'].map(header => (
            <th key={header} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="px-3 py-2">{renderEditableCell(user, 'id', user.id)}</td>
          <td className="px-3 py-2">{renderEditableCell(user, 'full_name', user.full_name)}</td>
          <td className="px-3 py-2">{renderEditableCell(user, 'email', user.email)}</td>
          <td className="px-3 py-2">{renderEditableCell(user, 'phone', user.phone)}</td>
          <td className="px-3 py-2">{user.roles.join(' / ')}</td>
          <td className="px-3 py-2">
            <input
              type="checkbox"
              checked={user.is_active}
              onChange={() => handleToggleActive(user.id, user.is_active)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </td>
          <td className="px-3 py-2">{user.is_verified ? 'Yes' : 'No'}</td>
          <td className="px-3 py-2">{new Date(user.created_at).toLocaleDateString()}</td>
          <td className="px-3 py-2">{new Date(user.updated_at).toLocaleDateString()}</td>
        </tr>
      </tbody>
    </table>
  );

  const renderProTable = (user: UserDetails) => {
    if (!user.profile_pro) return null;
    return (
      <div className="mt-4">
        <h4 className="font-medium mb-2">Professional Profile</h4>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['ID', 'Business Name', 'Website', 'Address', 'Created', 'Updated'].map(header => (
                <th key={header} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-3 py-2">{renderEditableCell(user, 'id', user.profile_pro.id, 'pro')}</td>
              <td className="px-3 py-2">{renderEditableCell(user, 'business_name', user.profile_pro.business_name, 'pro')}</td>
              <td className="px-3 py-2">{renderEditableCell(user, 'website', user.profile_pro.website, 'pro')}</td>
              <td className="px-3 py-2">
                {renderEditableCell(
                  user,
                  'address',
                  user.profile_pro.address ?
                    `${user.profile_pro.address.street}, ${user.profile_pro.address.city}, ${user.profile_pro.address.postal_code}, ${user.profile_pro.address.country}` :
                    '',
                  'pro'
                )}
              </td>
              <td className="px-3 py-2">{new Date(user.profile_pro.created_at).toLocaleDateString()}</td>
              <td className="px-3 py-2">{new Date(user.profile_pro.updated_at).toLocaleDateString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderClientTable = (user: UserDetails) => {
    if (!user.profile_client) return null;
    return (
      <div className="mt-4">
        <h4 className="font-medium mb-2">Client Profile</h4>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['ID', 'Address', 'Created', 'Updated'].map(header => (
                <th key={header} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-3 py-2">{renderEditableCell(user, 'id', user.profile_client.id, 'client')}</td>
              <td className="px-3 py-2">
                {renderEditableCell(
                  user,
                  'address',
                  user.profile_client.address ?
                    `${user.profile_client.address.street}, ${user.profile_client.address.city}, ${user.profile_client.address.postal_code}, ${user.profile_client.address.country}` :
                    '',
                  'client'
                )}
              </td>
              <td className="px-3 py-2">{new Date(user.profile_client.created_at).toLocaleDateString()}</td>
              <td className="px-3 py-2">{new Date(user.profile_client.updated_at).toLocaleDateString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/users/${userId}/deactivate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to update user status');
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      console.log('Delete user:', userId);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedUsers.map(userId => handleDeleteUser(userId)));
      setSelectedUsers([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete users');
    }
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  const toggleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleUserExpanded = (userId: string) => {
    setExpandedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const tabs = [
    { id: 'all', label: 'All Users' },
    { id: 'client', label: 'Clients' },
    { id: 'pro', label: 'Professionals' },
    { id: 'admin', label: 'Administrators' },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <p className="text-gray-600">View and manage user accounts</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b">
          <nav className="flex">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {selectedUsers.length > 0 && (
            <div className="mb-6 flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {selectedUsers.length} selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </button>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === users.length}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roles
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <>
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleSelectUser(user.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleUserExpanded(user.id)}
                            className="flex items-center gap-2 hover:text-blue-600"
                          >
                            {expandedUsers.includes(user.id) ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                            <div>
                              <div className="font-medium text-gray-900">{user.full_name}</div>
                            </div>
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">
                            {user.roles.join(' / ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={user.is_active}
                              onChange={() => handleToggleActive(user.id, user.is_active)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                      {expandedUsers.includes(user.id) && (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 bg-gray-50">
                            {renderUserTable(user)}
                            {renderProTable(user)}
                            {renderClientTable(user)}
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}