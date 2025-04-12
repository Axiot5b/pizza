import React from 'react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Bienvenido a Pizzería Orders</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        Tu solución completa para gestionar pedidos y mesas en tu pizzería.
      </p>
      <div className="flex space-x-4">
        <a href="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Iniciar Sesión
        </a>
        <a href="/register" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Registrarse
        </a>
      </div>
    </div>
  );
};

export default Home;
