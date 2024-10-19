'use client';

import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const Signup: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const [error, setError] = useState('');
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signup(email, password);
      onSuccess();
    } catch (err) {
      console.error('Signup error:', err);
      setError('Failed to sign up. Please try again.');
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
      <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Sign Up</button>
    </form>
  );
};

export default Signup;
