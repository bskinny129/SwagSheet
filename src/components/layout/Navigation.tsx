import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/csv-reducer', label: 'CSV Reducer' },
  { path: '/contact-names', label: 'AI Contact Names' },
  { path: '/smart-merge', label: 'AI Smart Merge' },
  { path: '/pricing', label: 'Pricing' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="z-50 bg-white backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-[#0AEF8D]">
                SwagSheet
              </span>
            </Link>
          </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-md text-center text-md font-light transition-colors relative ${
                location.pathname === item.path
                  ? 'font-medium'
                  : 'text-black/80 hover:text-primary-dark'
              }`}
              style={{ width: item.label === 'AI Contact Names' ? '160px' : 
                        item.label === 'Pricing' ? '100px' :
                        '140px' }} 
              >
              {item.label}
              {location.pathname === item.path && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0AEF8D]"
                  layoutId="navbar-indicator"
                />
              )}
            </Link>
          ))}
          <Button
            variant="default"
            className="ml-4 bg-primary-bright text-primary-dark  hover:bg-primary-bright/70"
          >
            <Link to="/csv-reducer">
            Get Started</Link>
          </Button>
        </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white/80 hover:text-[#0AEF8D] focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-[#004751] border-b border-[#0AEF8D]/20">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? 'text-[#0AEF8D] bg-[#0AEF8D]/10'
                    : 'text-white/80 hover:text-[#0AEF8D] hover:bg-[#0AEF8D]/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Button
              variant="default"
              className="w-full mt-4 bg-[#0AEF8D] text-[#004751] hover:bg-[#0AEF8D]/90"
            >
              Get Started
            </Button>
          </div>
        </motion.div>
      )}
    </nav>
  );
}