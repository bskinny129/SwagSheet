import { CSVProcessor } from '@/components/csv/CSVProcessor';

export function CSVReducer() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">CSV Reducer</h1>
        <p className="text-xl text-gray-600">
          Optimize and compress your CSV files while maintaining data integrity
        </p>
      </div>
      
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-lg border border-gray-200/50">
        <CSVProcessor />
      </div>
    </div>
  );
}