import { motion } from 'framer-motion';
//import { ArrowRight, FileSpreadsheet, Users, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedIcon } from '@/components/ui/animated-icon';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: <AnimatedIcon />,
    title: 'CSV Reducer',
    description:
      'Optimize your CSV files by removing and rearranging columns, plus limit the number of rows',
    link: '/csv-reducer'
  },
  {
    icon: <></>,
    title: 'AI Contact Names',
    description:
      'Normalize and standardize contact names using advanced AI algorithms.',
      link: '/contact-names'
  },
  {
    icon: <></>,
    title: 'AI Smart Merge',
    description:
      'Intelligently merge CSV files with automatic duplicate detection.',
      link: '/smart-merge'
  },
];

export function Home() {
  return (
    <div className="relative z-0">
      {/* Hero Section */}
      <div className="relative z-10">
        <div className="mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6"
            >
              Transform Your CSV Data with{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI-Powered Tools
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Powerful CSV processing tools that help you reduce, normalize, and
              merge your data with unprecedented accuracy.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center gap-4"
            >
              <Button
                asChild
                size="lg"
                className="ml-4 bg-primary-bright text-primary-dark hover:bg-primary-bright/80"
              >
                <Link to="/csv-reducer">
                  Get Started for Free
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>

      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <Link to={feature.link} className="block h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl transform group-hover:scale-105 transition-transform duration-300 -z-10" />
                <div className="relative p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 h-full">
                  <div className="flex justify-center mt-4 mb-8">
                    { feature.icon }
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}