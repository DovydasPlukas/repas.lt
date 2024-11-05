'use client'
import React, { useState } from 'react';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleToggle = () => setIsLogin(!isLogin);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      console.log('Logging in:', { email, password });
    } else {
      console.log('Registering:', { name, email, password });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[--background]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-semibold text-center">
          {isLogin ? 'Prisijungti' : 'Registruotis'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Vardas
              </label>
              <input
                type="text"
                id="Vardas"
                className="w-full px-4 py-2 mt-1 text-gray-800 bg-gray-100 border rounded focus:ring-2 focus:ring-[--RepasRed]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              El. paštas
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 mt-1 text-gray-800 bg-gray-100 border rounded focus:ring-2 focus:ring-[--RepasRed]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Slaptažodis
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 mt-1 text-gray-800 bg-gray-100 border rounded focus:ring-2 focus:ring-[--RepasRed]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-[--RepasRed] rounded hover:bg-[#ff6354]"
          >
            {isLogin ? 'Prisijungti' : 'Registurotis'}
          </button>
        </form>
        <p className="text-center">
          {isLogin ? "Neturite paskyros?" : 'Turite paskyrą?'}{' '}
          <button
            onClick={handleToggle}
            className="font-medium text-[--RepasRed] hover:underline"
          >
            {isLogin ? 'Registruotis' : 'Prisijungti'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;