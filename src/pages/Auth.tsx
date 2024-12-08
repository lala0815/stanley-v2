import React, { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';
import { Video } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Video className="h-12 w-12 text-purple-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to LiveStream</h1>
        <p className="text-gray-400">Your gateway to live streaming</p>
      </div>

      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isLogin
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                !isLogin
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {isLogin ? (
          <LoginForm onSuccess={() => navigate('/')} />
        ) : (
          <SignupForm onSuccess={() => navigate('/')} />
        )}
      </div>
    </div>
  );
};