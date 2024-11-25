import { motion } from 'framer-motion';
import { AnimatedIcon } from '@/components/animated-icons/AnimatedIcon';
import { Feature } from '@/config/features';

interface ToolLayoutProps {
  feature: Feature;
}

export function ToolLayout({ feature }: ToolLayoutProps) {
  const FeatureComponent = feature.component;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{feature.title}</h1>
        <div className="flex justify-center mt-4 mb-8">
          <AnimatedIcon iconType={feature.iconType} />
        </div>
        <p className="text-xl text-gray-600 font-light">
          {feature.description}
        </p>
        {feature.description2 && (
          <p className="text-xl text-gray-600 font-light mt-8">
            {feature.description2}
          </p>
        )}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {FeatureComponent && <FeatureComponent />}
      </motion.div>
    </div>
  );
}