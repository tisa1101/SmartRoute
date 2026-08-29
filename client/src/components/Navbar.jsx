import { Menu, X } from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo5.png"; // Keeping original logo import

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Order", href: "/order" },
  { label: "Vehicles", href: "/vehicles" }
];

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const location = useLocation();

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <nav className="sticky top-0 z-50 py-3 bg-[#0b0f19]/80 backdrop-blur-xl border-b border-indigo-900/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 group">
            <Link to="/" className="flex items-center">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300">
                <img src={logo} alt="logo" className="h-8 w-8 object-contain" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight ml-3 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
                RouteX Core
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex ml-14 space-x-8">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={index}>
                  <Link 
                    to={item.href} 
                    className={`text-sm font-medium transition-all duration-300 relative py-2 ${
                      isActive ? "text-indigo-400" : "text-gray-400 hover:text-white"
                    } after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-500 after:transition-transform after:duration-300 ${
                      isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button onClick={toggleNavbar} className="text-gray-300 hover:text-white transition">
              {mobileDrawerOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileDrawerOpen && (
          <div className="absolute right-0 top-16 z-20 w-full bg-[#0b0f19]/95 backdrop-blur-xl border-b border-indigo-900/30 p-6 flex flex-col items-center lg:hidden shadow-2xl rounded-b-2xl">
            <ul className="w-full text-center space-y-4">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.href} 
                    onClick={toggleNavbar} 
                    className="block text-lg font-medium text-gray-300 hover:text-indigo-400 hover:bg-gray-800/50 py-3 rounded-lg transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
