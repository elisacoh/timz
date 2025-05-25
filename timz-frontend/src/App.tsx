import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageCategories } from './pages/admin/ManageCategories';
import { ManageUsers } from './pages/admin/ManageUsers';


// Pro Pages
import { ProDashboard } from './pages/pro/ProDashboard';
import { CreateService } from './pages/pro/CreateService';
import { EditService } from './pages/pro/EditService';
import { ServiceGroupsManager } from './pages/pro/ServiceGroupsManager';
import { ProBookings } from './pages/pro/ProBookings';
import { ProCalendar } from './pages/pro/ProCalendar';
import { ProFinances } from './pages/pro/ProFinances';
import { ClientManager } from './pages/pro/ClientManager';

// Client Pages
import { ExplorePros } from './pages/client/ExplorePros';
import { ProProfilePublic } from './pages/client/ProProfilePublic';
import { ServiceDetails } from './pages/client/ServiceDetails';
import { BookingPage } from './pages/client/BookingPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageCategories />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />

            {/* Pro Routes */}
            <Route
              path="/pro"
              element={
                <ProtectedRoute allowedRoles={['pro']}>
                  <ProDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pro/services/create"
              element={
                <ProtectedRoute allowedRoles={['pro']}>
                  <CreateService />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pro/services/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['pro']}>
                  <EditService />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pro/groups"
              element={
                <ProtectedRoute allowedRoles={['pro']}>
                  <ServiceGroupsManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pro/bookings"
              element={
                <ProtectedRoute allowedRoles={['pro']}>
                  <ProBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pro/calendar"
              element={
                <ProtectedRoute allowedRoles={['pro']}>
                  <ProCalendar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pro/finances"
              element={
                <ProtectedRoute allowedRoles={['pro']}>
                  <ProFinances />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pro/clients"
              element={
                <ProtectedRoute allowedRoles={['pro']}>
                  <ClientManager />
                </ProtectedRoute>
              }
            />


            {/* Client Routes */}
            <Route path="/" element={<ExplorePros />} />
            <Route path="/pros/:id" element={<ProProfilePublic />} />
            <Route path="/services/:id" element={<ServiceDetails />} />
            <Route path="/services/:id/book" element={<BookingPage />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;