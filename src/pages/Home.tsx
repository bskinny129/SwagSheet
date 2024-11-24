import { motion } from 'framer-motion';
//import { ArrowRight, FileSpreadsheet, Users, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedIcon } from '@/components/animated-icons/AnimatedIcon';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: <AnimatedIcon iconType="columns" />,
    title: 'CSV Reducer',
    description:
      'Optimize your CSV files by removing and rearranging columns, plus limit the number of rows.',
    link: '/csv-reducer',
    price: 'Free'
  },
  {
    icon: <AnimatedIcon iconType="doc" />,
    title: 'AI Contact Names',
    description:
      'Normalize and standardize contact names using advanced AI algorithms.',
    link: '/contact-names',
    price: '½ cent per row'
  },
  {
    icon: <AnimatedIcon iconType="arrows" />,
    title: 'AI Smart Merge',
    description:
      'Intelligently merge CSV files with automatic duplicate detection.',
    link: '/smart-merge',
    price: '¼ cent per row'
  },
];

export function Home() {
  return (
    <div className="relative z-0">
      {/* Hero Section */}
      <div className="relative z-10">
        <div className="md:mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-[3.6rem] sm:leading-[3.75rem] font-bold text-gray-900 mb-6"
            >
              Your Messy Sheets Data Transformed<br /> with{' '}
              <span className="bg-gradient-to-r from-primary-bright-purple to-primary-bright-purple/80 bg-clip-text text-transparent">
                AI-Powered Tools
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              No monthly subscription! Free CSV processing tools to reduce and
              merge your data. Or pay a fraction of a cent to improve your data with AI.
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
                className="bg-primary-bright text-primary-dark hover:bg-primary-bright/90 py-3 px-8 rounded-md transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <Link to="/csv-reducer">
                  Get Started for Free
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>

      </div>

      {/* Why Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
        <div className="relative p-8 md:p-12">
          <div className="absolute top-0 -mt-2 left-0 w-40 h-40 bg-primary-very-light-green/35 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-primary-very-light-green/35 rounded-full translate-x-1/3 translate-y-1/3"></div>
          
          <div className="relative z-10 flex flex-col-reverse md:flex-row items-center">
            
            <div className="md:pr-8 mt-8 md:mt-0 flex-1">
              <h2 className="mb-4 text-[1.66rem] text-bold">From One Business Owner to Another: Let’s Make More Money</h2>

              <p className="text-gray-600 mb-6 leading-relaxed max-w-2xl">
                I'm sure email was amazing in the 90s. WOAH ELECTRONIC MAIL! In {new Date().getFullYear()}, we tolerate it — but any business owner knows it is the <span className="font-semibold">veins through which revenue flows</span>.
                <br />
                <br />
                Whether it's your own email list or cold email outreach for growth, the <span className="font-semibold">data is messy</span>. This hurts deliverability, meaning you are reaching fewer people, and leaving money on the table.
                <br />
                <br />
                I created tools to fix the problem for my business. Now, it's my gift to you — <span className="font-semibold">for free</span> (or advanced AI features a low pay-per-use).
              </p>
            </div>
            <div className="px-4 md:px-0 md:w-1/4 flex-shrink-0">
              <div className="relative w-36 h-48 md:w-48 md:h-64 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-primary-bright-purple rounded-xl transform rotate-6"></div>
                <img
                  src="/assets/Brian Skinner headshot large thin 3.jpeg"
                  alt="Founder Brian Skinner"
                  height={300}
                  className="rounded-xl relative z-10 object-cover"
                />
 
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="mb-8 text-3xl text-bold">Free CSV Tools and AI Powered Sheets</h2>
        <div className="md:h-[403.2px] grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <Link to={feature.link} className="block h-full">
                <div className="flex flex-col relative p-6 rounded-2xl shadow-md border border-primary-bright/30 h-full transform group-hover:scale-105 group-hover:border-2 transition-transform duration-300">
                  <div className="flex justify-center mt-4 mb-8">
                    { feature.icon }
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                  <div className="mt-auto text-right">
                    <span className="text-lg font-bold text-gray-400">
                      {feature.price}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}