import { useState } from 'react';
import { Users, Plus, Search, Tag, Ban } from 'lucide-react';

interface ClientGroup {
  id: string;
  name: string;
  description: string;
  rules: {
    type: 'blacklist' | 'whitelist';
    services: string[];
  };
  clients: string[];
}

export function ClientManager() {
  const [groups, setGroups] = useState<ClientGroup[]>([
    {
      id: '1',
      name: 'VIP Clients',
      description: 'Premium clients with special privileges',
      rules: {
        type: 'whitelist',
        services: ['1', '2'],
      },
      clients: ['1', '2'],
    },
    {
      id: '2',
      name: 'Restricted',
      description: 'Clients with booking restrictions',
      rules: {
        type: 'blacklist',
        services: ['3'],
      },
      clients: ['3'],
    },
  ]);

  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateGroup = () => {
    const newGroup: ClientGroup = {
      id: Date.now().toString(),
      name: 'New Group',
      description: '',
      rules: {
        type: 'whitelist',
        services: [],
      },
      clients: [],
    };
    setGroups([...groups, newGroup]);
    setSelectedGroup(newGroup.id);
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">Client Manager</h1>
        <p className="text-gray-600">Organize and manage your client groups</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Client Groups</h2>
              <button
                onClick={handleCreateGroup}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {groups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroup(group.id)}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    selectedGroup === group.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{group.name}</span>
                  </div>
                  <p className="text-sm text-gray-500 ml-6">
                    {group.clients.length} clients
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-12 md:col-span-8 lg:col-span-9">
          {selectedGroup ? (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <input
                  type="text"
                  value={groups.find((g) => g.id === selectedGroup)?.name}
                  onChange={(e) => {
                    setGroups(
                      groups.map((g) =>
                        g.id === selectedGroup ? { ...g, name: e.target.value } : g
                      )
                    );
                  }}
                  className="text-xl font-bold bg-transparent border-0 focus:ring-0 p-0 w-full"
                />
                <textarea
                  value={groups.find((g) => g.id === selectedGroup)?.description}
                  onChange={(e) => {
                    setGroups(
                      groups.map((g) =>
                        g.id === selectedGroup ? { ...g, description: e.target.value } : g
                      )
                    );
                  }}
                  className="mt-2 w-full text-gray-600 bg-transparent border-0 focus:ring-0 p-0 resize-none"
                  rows={2}
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Access Rules</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rule Type
                    </label>
                    <select
                      value={groups.find((g) => g.id === selectedGroup)?.rules.type}
                      onChange={(e) => {
                        setGroups(
                          groups.map((g) =>
                            g.id === selectedGroup
                              ? {
                                  ...g,
                                  rules: { ...g.rules, type: e.target.value as 'blacklist' | 'whitelist' },
                                }
                              : g
                          )
                        );
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="whitelist">Whitelist (Allow only selected services)</option>
                      <option value="blacklist">Blacklist (Restrict selected services)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Services
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                        <Tag className="w-4 h-4 mr-1" />
                        Haircut & Styling
                      </button>
                      <button className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                        <Tag className="w-4 h-4 mr-1" />
                        Color Treatment
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t mt-6 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Clients in Group</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search clients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">John Doe</h4>
                      <p className="text-sm text-gray-500">john@example.com</p>
                    </div>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-md">
                      <Ban className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No Group Selected</h3>
              <p className="text-gray-500">Select a group from the sidebar or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}