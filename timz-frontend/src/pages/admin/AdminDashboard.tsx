import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Users, FolderTree } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const { user } = useAuth();

  const cards = [
    {
      title: 'Manage Categories',
      description: 'Create and manage service categories',
      icon: FolderTree,
      link: '/admin/categories',
    },
    {
      title: 'Manage Users',
      description: 'View and manage user accounts',
      icon: Users,
      link: '/admin/users',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.link}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Icon className="w-8 h-8 text-blue-600 mb-4" />
              <h2 className="text-lg font-semibold mb-2">{card.title}</h2>
              <p className="text-gray-600">{card.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}