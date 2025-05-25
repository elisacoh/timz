import { useState } from 'react';
import { Plus, Minus, Clock, DollarSign } from 'lucide-react';
import { ServiceOption } from '../../types';

export function CreateService() {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('60');
  const [price, setPrice] = useState('');
  const [options, setOptions] = useState<ServiceOption[]>([]);
  const [newOption, setNewOption] = useState({ title: '', price: '' });

  const handleAddOption = () => {
    if (newOption.title && newOption.price) {
      setOptions([
        ...options,
        {
          id: Date.now().toString(),
          title: newOption.title,
          price: Number(newOption.price),
        },
      ]);
      setNewOption({ title: '', price: '' });
    }
  };

  const handleRemoveOption = (id: string) => {
    setOptions(options.filter(option => option.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle service creation
    console.log({
      title,
      duration: Number(duration),
      price: Number(price),
      options,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Service</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Service Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Duration (minutes)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Additional Options</h2>
            <div className="space-y-4">
              {options.map(option => (
                <div key={option.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{option.title}</p>
                    <p className="text-sm text-gray-500">+${option.price}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(option.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Option Title"
                  value={newOption.title}
                  onChange={(e) => setNewOption({ ...newOption, title: e.target.value })}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newOption.price}
                  onChange={(e) => setNewOption({ ...newOption, price: e.target.value })}
                  className="w-24 rounded-md border border-gray-300 px-3 py-2"
                />
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="px-3 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
          >
            Create Service
          </button>
        </form>
      </div>
    </div>
  );
}