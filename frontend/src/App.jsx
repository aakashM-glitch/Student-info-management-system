import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import StudentsList from './pages/StudentsList';
import StudentForm from './components/StudentForm';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/students"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <StudentsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students/new"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <StudentForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students/:id"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <StudentForm viewMode />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <StudentForm editMode />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </Layout>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;