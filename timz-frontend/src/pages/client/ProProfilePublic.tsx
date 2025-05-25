import { useState } from 'react';
import { Star, Clock, DollarSign, Calendar } from 'lucide-react';
import { Service } from '../../types';

export function ProProfilePublic() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const pro = {
    id: '1',
    name: 'John Doe',
    category: 'Hair Styling',
    rating: 4.8,
    reviews: 124,
    description: 'Professional hairstylist with over 10 years of experience specializing in modern cuts and colors.',
    image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  };

  const services: Service[] = [
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
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="relative h-64">
          <img
            src={pro.image}
            alt={pro.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <h1 className="text-3xl font-bold text-white">{pro.name}</h1>
            <p className="text-white/90">{pro.category}</p>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="ml-1">{pro.rating}</span>
              <span className="text-gray-500 ml-1">({pro.reviews} reviews)</span>
            </div>
          </div>
          <p className="text-gray-600">{pro.description}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Services</h2>
        <div className="space-y-4">
          {services.map(service => (
            <div
              key={service.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedService === service.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'
              }`}
              onClick={() => setSelectedService(service.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{service.title}</h3>
                <span className="flex items-center text-gray-900 font-medium">
                  <DollarSign className="w-4 h-4" />
                  {service.price}
                </span>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                <span>{service.duration} min</span>
              </div>
              {selectedService === service.id && service.options && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Additional Options:</p>
                  {service.options.map(option => (
                    <div key={option.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={option.id}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={option.id} className="ml-2 text-sm text-gray-600">
                        {option.title} (+${option.price})
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        {selectedService && (
          <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5" />
            Book Appointment
          </button>
        )}
      </div>
    </div>
  );
}