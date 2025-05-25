import { useState } from 'react';
import { Clock, DollarSign, Calendar } from 'lucide-react';
import { Service, ServiceOption } from '../../types';

export function ServiceDetails() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const service: Service = {
    id: '1',
    title: 'Haircut & Styling',
    duration: 60,
    price: 50,
    proId: '1',
    options: [
      { id: '1', title: 'Add Hair Wash', price: 15 },
      { id: '2', title: 'Add Hair Treatment', price: 25 },
    ],
  };

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev =>
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const calculateTotal = () => {
    const basePrice = service.price;
    const optionsPrice = selectedOptions.reduce((total, optionId) => {
      const option = service.options?.find(opt => opt.id === optionId);
      return total + (option?.price || 0);
    }, 0);
    return basePrice + optionsPrice;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">{service.title}</h1>

        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center text-gray-600">
            <Clock className="w-5 h-5 mr-2" />
            <span>{service.duration} minutes</span>
          </div>
          <div className="flex items-center text-gray-900 font-medium">
            <DollarSign className="w-5 h-5" />
            <span>{service.price}</span>
          </div>
        </div>

        {service.options && service.options.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Additional Options</h2>
            <div className="space-y-3">
              {service.options.map((option: ServiceOption) => (
                <div
                  key={option.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:border-blue-500 cursor-pointer"
                  onClick={() => handleOptionToggle(option.id)}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedOptions.includes(option.id)}
                      onChange={() => handleOptionToggle(option.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-3 text-gray-700">{option.title}</label>
                  </div>
                  <span className="text-gray-900">+${option.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold">${calculateTotal()}</span>
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5" />
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}