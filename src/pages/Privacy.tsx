import { motion } from 'framer-motion';
import { Shield, Lock, Clock } from 'lucide-react';

const policies = [
  {
    icon: Shield,
    title: 'Data Protection',
    description:
      'Your data is never sold or shared with third parties. We take data protection seriously and implement industry-standard security measures.',
  },
  {
    icon: Lock,
    title: 'Service Providers',
    description:
      'We use OpenAI and Supabase services to provide AI functionality and data storage. These providers are bound by strict data protection agreements.',
  },
  {
    icon: Clock,
    title: 'Data Retention',
    description:
      'All uploaded data is automatically deleted after 30 days. You can manually delete your data at any time before this period.',
  },
];

export function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 bg-primary-very-light-purple/10 rounded-xl shadow-lg border border-gray-200/50 p-12 text-center"
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Coming Soon
        </h2>
        <p className="text-gray-600">
          We're working hard to bring you this feature. Stay tuned!
        </p>
      </motion.div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#004751] mb-4">Privacy Policy</h1>
        <p className="text-xl text-gray-600">
          How we handle and protect your data
        </p>
      </div>

      <div className="prose prose-lg max-w-none mb-12">
        <p>
          At SwagSheet, we prioritize the privacy and security of your data. This
          privacy policy explains how we collect, use, and protect your
          information.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3 mb-12">
        {policies.map((policy, index) => (
          <motion.div
            key={policy.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative p-6 bg-white rounded-2xl border border-[#0AEF8D]/20 shadow-lg"
          >
            <policy.icon className="h-8 w-8 text-[#0AEF8D] mb-4" />
            <h3 className="text-lg font-semibold text-[#004751] mb-2">
              {policy.title}
            </h3>
            <p className="text-gray-600">{policy.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="prose prose-lg max-w-none">
        <h2 className="text-2xl font-bold text-[#004751] mb-4">
          Detailed Information
        </h2>
        
        <h3>Data Collection</h3>
        <p>
          We collect only the data necessary to provide our services, including:
          CSV files you upload, processing preferences, and account information.
        </p>

        <h3>AI Processing</h3>
        <p>
          Our AI features use OpenAI's services to process your data. The data is
          transmitted securely and is not used to train AI models.
        </p>

        <h3>Data Storage</h3>
        <p>
          We use Supabase for secure data storage. All data is encrypted at rest
          and in transit. After 30 days, your data is automatically and
          permanently deleted from our systems.
        </p>

        <h3>Your Rights</h3>
        <p>
          You have the right to:
        </p>
        <ul>
          <li>Access your data</li>
          <li>Request data deletion</li>
          <li>Export your data</li>
          <li>Opt-out of data processing</li>
        </ul>

        <h3>Contact Us</h3>
        <p>
          If you have any questions about our privacy policy or how we handle your
          data, please contact our privacy team at privacy@swagsheet.com.
        </p>
      </div>
    </div>
  );
}