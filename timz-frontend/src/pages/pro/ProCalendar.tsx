import { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';

export function ProCalendar() {
  const [availabilities, setAvailabilities] = useState([
    { day: 'monday', start: '09:00', end: '17:00', enabled: true },
    { day: 'tuesday', start: '09:00', end: '17:00', enabled: true },
    { day: 'wednesday', start: '09:00', end: '17:00', enabled: true },
    { day: 'thursday', start: '09:00', end: '17:00', enabled: true },
    { day: 'friday', start: '09:00', end: '17:00', enabled: true },
    { day: 'saturday', start: '10:00', end: '15:00', enabled: false },
    { day: 'sunday', start: '10:00', end: '15:00', enabled: false },
  ]);

  const handleAvailabilityChange = (index: number, field: string, value: string | boolean) => {
    const newAvailabilities = [...availabilities];
    newAvailabilities[index] = { ...newAvailabilities[index], [field]: value };
    setAvailabilities(newAvailabilities);
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">Calendar & Availability</h1>
        <p className="text-gray-600">Manage your working hours and availability</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Weekly Schedule</h2>
        <div className="space-y-4">
          {availabilities.map((availability, index) => (
            <div key={availability.day} className="flex items-center gap-4">
              <div className="w-32">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={availability.enabled}
                    onChange={(e) => handleAvailabilityChange(index, 'enabled', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 capitalize">{availability.day}</span>
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <input
                  type="time"
                  value={availability.start}
                  onChange={(e) => handleAvailabilityChange(index, 'start', e.target.value)}
                  disabled={!availability.enabled}
                  className="border rounded-md px-3 py-1 disabled:bg-gray-100"
                />
                <span>to</span>
                <input
                  type="time"
                  value={availability.end}
                  onChange={(e) => handleAvailabilityChange(index, 'end', e.target.value)}
                  disabled={!availability.enabled}
                  className="border rounded-md px-3 py-1 disabled:bg-gray-100"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Special Dates</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Holiday or Time Off
              </label>
              <input
                type="date"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 self-end">
              <Calendar className="w-4 h-4" />
              Add Date
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}