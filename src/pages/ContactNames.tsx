import { motion } from 'framer-motion';
import { FileSpreadsheet } from 'lucide-react';

export function ContactNames() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Contact Names
        </h1>
        <p className="text-xl text-gray-600">
          Normalize and standardize contact names using advanced AI
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-lg border border-gray-200/50 p-12 text-center"
      >
        <FileSpreadsheet className="h-16 w-16 text-purple-600 mx-auto mb-6" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Coming Soon
        </h2>
        <p className="text-gray-600">
          We're working hard to bring you intelligent contact name normalization.
          Stay tuned!
        </p>
      </motion.div>
    </div>
  );
}