import { useState } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { Category } from '../../types';

export function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Hair Styling', description: 'All hair related services' },
    { id: '2', name: 'Massage', description: 'Therapeutic massage services' },
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
  };

  const handleSave = (id: string) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, ...newCategory } : cat
    ));
    setEditingId(null);
    setNewCategory({ name: '', description: '' });
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const handleAdd = () => {
    if (newCategory.name) {
      setCategories([...categories, {
        id: Date.now().toString(),
        ...newCategory
      }]);
      setNewCategory({ name: '', description: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">Manage Categories</h1>
        <p className="text-gray-600">Create and manage service categories</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Category Name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2"
            />
            <input
              type="text"
              placeholder="Description"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2"
            />
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {categories.map(category => (
            <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              {editingId === category.id ? (
                <>
                  <div className="flex-1 flex gap-4">
                    <input
                      type="text"
                      value={newCategory.name || category.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                    />
                    <input
                      type="text"
                      value={newCategory.description || category.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleSave(category.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-md"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}