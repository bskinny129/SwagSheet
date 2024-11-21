import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-[#004751] mb-4"
        >
          About SwagSheet
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600"
        >
          Transforming how teams work with data
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="aspect-video mb-12 rounded-xl overflow-hidden"
      >
        <img
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200&h=675"
          alt="Team collaboration"
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="prose prose-lg max-w-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-[#004751] mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-8">
            At SwagSheet, we believe that data should be accessible, manageable,
            and actionable. Our mission is to simplify complex data operations for
            teams of all sizes, enabling them to focus on what truly matters:
            making informed decisions and driving business growth.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-[#004751] mb-4">Our Story</h2>
          <p className="text-gray-600 mb-8">
            Founded by a team of data enthusiasts and software engineers, SwagSheet
            emerged from a simple observation: businesses spend too much time
            managing and cleaning their data. We set out to create intelligent
            tools that automate these tedious tasks, leveraging cutting-edge AI to
            make data processing effortless and efficient.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-[#0AEF8D]/10 to-[#004751]/10 p-8 rounded-xl mb-8"
        >
          <h2 className="text-2xl font-bold text-[#004751] mb-4">
            Why Choose SwagSheet?
          </h2>
          <ul className="list-none space-y-4 text-gray-600">
            <li className="flex items-start">
              <span className="text-[#0AEF8D] mr-2">•</span>
              Powerful AI-driven data processing
            </li>
            <li className="flex items-start">
              <span className="text-[#0AEF8D] mr-2">•</span>
              Intuitive, user-friendly interface
            </li>
            <li className="flex items-start">
              <span className="text-[#0AEF8D] mr-2">•</span>
              Enterprise-grade security
            </li>
            <li className="flex items-start">
              <span className="text-[#0AEF8D] mr-2">•</span>
              Dedicated customer support
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            asChild
            size="lg"
            className="bg-[#0AEF8D] text-[#004751] hover:bg-[#0AEF8D]/90"
          >
            <Link to="/csv-reducer">
              Try SwagSheet Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}