import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-lg font-bold">
          Pizzería Orders
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-4">
          <Link to="/" className="text-gray-300 hover:text-white">Inicio</Link>
          <Link to="/mesas" className="text-gray-300 hover:text-white">Mesas</Link>
          <Link to="/admin" className="text-gray-300 hover:text-white">Admin</Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button className="text-gray-300 hover:text-white focus:outline-none">
            {/* Aquí puedes agregar un ícono de menú hamburguesa */}
            ☰
          </button>
        </div>

        {/* Authentication Links */}
        <div className="hidden md:flex space-x-4">
          <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
          <Link to="/register" className="text-gray-300 hover:text-white">Registrarse</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
