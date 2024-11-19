import { motion } from 'framer-motion';
import { GitBranch } from 'lucide-react';

export function SmartMerge() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Smart Merge</h1>
        <p className="text-xl text-gray-600">
          Intelligently merge CSV files with automatic duplicate detection
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-lg border border-gray-200/50 p-12 text-center"
      >
        <GitBranch className="h-16 w-16 text-purple-600 mx-auto mb-6" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Coming Soon
        </h2>
        <p className="text-gray-600">
          We're building a powerful CSV merging tool with AI-powered duplicate
          detection. Stay tuned!
        </p>
      </motion.div>
    </div>
  );
}