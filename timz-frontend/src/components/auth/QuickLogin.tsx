import { Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';

export function QuickLogin() {
  const { quickLogin, user, logout } = useAuth();

  const roles: Role[] = ['admin', 'pro', 'client'];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Menu className="w-5 h-5" />
          <span className="font-medium">Quick Login</span>
        </div>
        <div className="flex flex-col gap-2">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => quickLogin(role)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${user?.role === role
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              Login as {role}
            </button>
          ))}
          {user && (
            <button
              onClick={logout}
              className="px-4 py-2 rounded-md text-sm font-medium bg-red-100 hover:bg-red-200 text-red-900"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}