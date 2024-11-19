import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for trying out SwagSheet',
    features: [
      'Process up to 1,000 rows',
      'Basic CSV reduction',
      'Export to CSV',
      'Community support',
    ],
  },
  {
    name: 'Pro',
    price: '$19',
    description: 'For professionals and small teams',
    features: [
      'Process up to 100,000 rows',
      'Advanced CSV reduction',
      'AI-powered name normalization',
      'Priority email support',
      'API access',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    features: [
      'Unlimited row processing',
      'Custom AI models',
      'Advanced security features',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
    ],
  },
];

export function Pricing() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple Pricing</h1>
        <p className="text-xl text-gray-600">
          Choose the plan that's right for you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative rounded-2xl bg-white p-8 shadow-lg border ${
              plan.name === 'Pro'
                ? 'border-purple-600 ring-2 ring-purple-600 ring-opacity-50'
                : 'border-gray-200'
            }`}
          >
            {plan.name === 'Pro' && (
              <div className="absolute top-0 right-6 transform -translate-y-1/2">
                <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  Popular
                </span>
              </div>
            )}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price}
                </span>
                {plan.price !== 'Custom' && (
                  <span className="text-gray-600">/month</span>
                )}
              </div>
              <p className="mt-2 text-gray-600">{plan.description}</p>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className={`w-full ${
                plan.name === 'Pro'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90'
                  : ''
              }`}
              variant={plan.name === 'Pro' ? 'default' : 'outline'}
            >
              {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}