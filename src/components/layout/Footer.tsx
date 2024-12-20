import { Link } from 'react-router-dom';
import { features } from '@/config/features';

export function Footer() {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-bright to-primary-dark bg-clip-text text-transparent">
              <img src="/assets/SwagSheet200.jpg" alt="SwagSheet Logo" className="h-12 w-auto" />
            </h3>
            <p className="text-gray-500 text-sm">
              Modern CSV processing tools for an AI world
            </p>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Tools
            </h4>
            <ul className="mt-4 space-y-2">
            {features.map((feature, index) => (  
              <li key={index}>
                <Link
                  to={feature.href}
                  className="text-gray-500 hover:text-primary-bright"
                >
                  {feature.title}
                </Link>
              </li>
            ))}
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Company
            </h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about" className="text-gray-500 hover:text-primary-bright">
                  About
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-500 hover:text-primary-bright">
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-500 hover:text-primary-bright"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-400 text-sm text-center">
            © {new Date().getFullYear()} SwagSheet. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}