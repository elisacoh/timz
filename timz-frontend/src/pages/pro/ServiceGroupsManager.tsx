import { useState } from 'react';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { ServiceGroup } from '../../types';

export function ServiceGroupsManager() {
  const [groups, setGroups] = useState<ServiceGroup[]>([
    {
      id: '1',
      name: 'Hair Services',
      services: ['1', '2'],
      proId: '1',
    },
    {
      id: '2',
      name: 'Color Services',
      services: ['3', '4'],
      proId: '1',
    },
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState('');

  const handleAddGroup = () => {
    if (newGroupName) {
      setGroups([
        ...groups,
        {
          id: Date.now().toString(),
          name: newGroupName,
          services: [],
          proId: '1',
        },
      ]);
      setNewGroupName('');
    }
  };

  const handleDeleteGroup = (id: string) => {
    setGroups(groups.filter(group => group.id !== id));
  };

  const handleUpdateGroup = (id: string, newName: string) => {
    setGroups(groups.map(group =>
      group.id === id ? { ...group, name: newName } : group
    ));
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">Service Groups</h1>
        <p className="text-gray-600">Organize your services into groups</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="New Group Name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2"
            />
            <button
              onClick={handleAddGroup}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Group
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {groups.map(group => (
            <div
              key={group.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                {editingId === group.id ? (
                  <input
                    type="text"
                    value={group.name}
                    onChange={(e) => handleUpdateGroup(group.id, e.target.value)}
                    onBlur={() => setEditingId(null)}
                    className="rounded-md border border-gray-300 px-3 py-1"
                    autoFocus
                  />
                ) : (
                  <span className="font-medium">{group.name}</span>
                )}
                <span className="text-sm text-gray-500">
                  {group.services.length} services
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingId(group.id)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteGroup(group.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}