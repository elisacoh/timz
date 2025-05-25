import { useAuth } from '../../contexts/AuthContext';
import { Home, Calendar, DollarSign, Users, User, Settings, BookOpen, LayoutGrid } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
  import { useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();


  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user]);
  const location = useLocation();

  const navigation = {
    client: [
      { name: 'Explore', href: '/', icon: Home },
      { name: 'My Bookings', href: '/bookings', icon: User },
    ],
    pro: [
      { name: 'Dashboard', href: '/pro', icon: Home },
      { name: 'Services', href: '/pro/services', icon: Settings },
      { name: 'Groups', href: '/pro/groups', icon: LayoutGrid },
      { name: 'Bookings', href: '/pro/bookings', icon: BookOpen },
      { name: 'Calendar', href: '/pro/calendar', icon: Calendar },
      { name: 'Finances', href: '/pro/finances', icon: DollarSign },
      { name: 'Clients', href: '/pro/clients', icon: Users },
    ],
    admin: [
      { name: 'Dashboard', href: '/admin', icon: Home },
      { name: 'Categories', href: '/admin/categories', icon: Settings },
      { name: 'Users', href: '/admin/users', icon: Users },
    ],
  };

  const currentNavigation =
    user && Array.isArray(user.roles) && user.roles.length > 0 && user.roles[0] in navigation
      ? navigation[user.roles[0] as keyof typeof navigation]
      : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {user && (
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-xl font-bold text-gray-900">
                    Service Platform
                  </span>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {currentNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`${
                          location.pathname === item.href
                            ? 'border-blue-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {user?.full_name || 'User'}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}