'use client';

import React, { useState } from 'react';
import { useAuth } from './AuthContext';

interface LoginProps {
  onSuccess: () => void;
  onError: (errorMessage: string) => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess, onError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      onSuccess();
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        setError(`Login failed: ${err.message}`);
        onError(`Login failed: ${err.message}`);
      } else {
        setError('Failed to log in. Please try again.');
        onError('Failed to log in. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block mb-2 text-white">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded bg-gray-700 text-white"
        />
      </div>
      <div>
        <label htmlFor="password" className="block mb-2 text-white">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded bg-gray-700 text-white"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Log In</button>
    </form>
  );
};

export default Login;
