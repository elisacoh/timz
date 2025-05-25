import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Category } from '../../types';

export function ExplorePros() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: Category[] = [
    { id: '1', name: 'Hair Styling', description: 'All hair related services' },
    { id: '2', name: 'Massage', description: 'Therapeutic massage services' },
  ];

  const pros = [
    {
      id: '1',
      name: 'John Doe',
      category: 'Hair Styling',
      rating: 4.8,
      reviews: 124,
      image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: '2',
      name: 'Jane Smith',
      category: 'Massage',
      rating: 4.9,
      reviews: 89,
      image: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
  ];

  const filteredPros = pros.filter(pro => 
    (selectedCategory === 'all' || pro.category === selectedCategory) &&
    pro.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">Find a Professional</h1>
        <p className="text-gray-600">Discover skilled professionals in your area</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search professionals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400 w-5 h-5" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPros.map(pro => (
          <div key={pro.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img
              src={pro.image}
              alt={pro.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg">{pro.name}</h3>
              <p className="text-gray-600">{pro.category}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-yellow-400">★</span>
                <span>{pro.rating}</span>
                <span className="text-gray-400">({pro.reviews} reviews)</span>
              </div>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}