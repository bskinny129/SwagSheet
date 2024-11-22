import { CSVProcessor } from '@/components/csv/CSVProcessor';
import { AnimatedIcon } from '@/components/animated-icons/AnimatedIcon';

export function CSVReducer() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">CSV Reducer</h1>
        <div className="flex justify-center mt-4 mb-8">
          <AnimatedIcon iconType="columns" />
        </div>
        <p className="text-xl text-gray-600 font-light">
          Optimize your CSV files by removing and rearranging columns, plus limit the number of rows
        </p>
        <p className="text-xl text-gray-600 font-light mt-8">
          Why? If you are using AI on your data, the cost and accuracy depends upon how much data you give it.
        </p>
      </div>
      
      <div className="">
        <CSVProcessor />
      </div>
    </div>
  );
}