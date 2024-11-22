import { motion } from 'framer-motion';
import { AnimatedIcon } from '@/components/animated-icons/AnimatedIcon';

export function SmartMerge() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Smart Merge</h1>
        <div className="flex justify-center mt-4 mb-8">
          <AnimatedIcon iconType="arrows" />
        </div>
        <p className="text-xl text-gray-600 font-light">
          Intelligently merge CSV files with automatic duplicate detection.
        </p>
        <p className="text-xl text-gray-600 font-light mt-8">
          Why? Too many separate emails lists to manage? Merge them all into one with tags.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary-very-light-purple/10 rounded-xl shadow-lg border border-gray-200/50 p-12 text-center"
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Coming Soon
        </h2>
        <p className="text-gray-600">
          We're working hard to bring you this feature. Stay tuned!
        </p>
      </motion.div>
    </div>
  );
}