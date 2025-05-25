import { useState } from 'react';
import { Plus, Pencil, Trash2, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Service } from '../../types';

export function ProDashboard() {
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      title: 'Haircut & Styling',
      duration: 60,
      price: 50,
      proId: '1',
      options: [
        { id: '1', title: 'Add Hair Wash', price: 15 },
        { id: '2', title: 'Add Hair Treatment', price: 25 },
      ],
    },
    {
      id: '2',
      title: 'Color Treatment',
      duration: 120,
      price: 100,
      proId: '1',
      options: [
        { id: '3', title: 'Add Highlights', price: 50 },
        { id: '4', title: 'Add Toner', price: 30 },
      ],
    },
  ]);

  const handleDeleteService = (id: string) => {
    setServices(services.filter(service => service.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Professional Dashboard</h1>
          <p className="text-gray-600">Manage your services and appointments</p>
        </div>
        <Link
          to="/pro/services/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Service
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/pro/groups"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <LayoutGrid className="w-8 h-8 text-blue-600 mb-4" />
          <h2 className="text-lg font-semibold mb-2">Service Groups</h2>
          <p className="text-gray-600">Organize your services into groups</p>
        </Link>

        {services.map(service => (
          <div key={service.id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold">{service.title}</h2>
              <div className="flex gap-2">
                <Link
                  to={`/pro/services/${service.id}/edit`}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDeleteService(service.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">Duration: {service.duration} minutes</p>
              <p className="text-gray-900 font-medium">Price: ${service.price}</p>
              {service.options && service.options.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mt-2">Additional Options:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {service.options.map(option => (
                      <li key={option.id}>
                        {option.title} (+${option.price})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}