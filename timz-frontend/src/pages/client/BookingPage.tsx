import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, DollarSign } from 'lucide-react';
import { Service, ServiceOption } from '../../types';

export function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // TODO: Fetch service details from your API
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement booking creation with your API
    console.log({
      serviceId: id,
      date: selectedDate,
      time: selectedTime,
      options: selectedOptions,
      total: calculateTotal(),
    });
  };

  // Generate available time slots
  const timeSlots = Array.from({ length: 8 }, (_, i) => {
    const hour = 9 + i;
    return `${hour}:00`;
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">Book Appointment</h1>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">{service.title}</h2>
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-1" />
              <span>{service.duration} min</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-5 h-5" />
              <span>{service.price}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Time
            </label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`py-2 px-4 rounded-md text-sm font-medium ${
                    selectedTime === time
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {service.options && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Additional Options</h3>
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

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}