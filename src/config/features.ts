import { CSVProcessor } from '@/components/csv/CSVProcessor';
import { AdvancedFilter } from '@/components/csv/AdvancedFilter';
import { ComingSoon } from '@/components/csv/ComingSoon';
import { IconType } from '@/types/icon';

export interface Feature {
  title: string;
  href: string;
  description: string;
  description2?: string;
  price: string;
  iconType: IconType;
  category: 'free-tools' | 'ai-tools';
  component?: React.ComponentType;
}

export const freeFeatures: Feature[] = [
  {
    title: 'Advanced Filter',
    href: '/advanced-filter',
    description: 'Automatically filter rows based on complex criteria.',
    description2: 'Why? It is a pain to go row by row to figure out what data to keep and discard.',
    price: 'Free',
    iconType: 'rules',
    category: 'free-tools',
    component: AdvancedFilter
  }
];

export const aiFeatures: Feature[] = [
  {
    title: 'CSV Processor',
    href: '/csv-processor',
    description: 'Process and clean your CSV data with AI.',
    price: 'Pay per use',
    iconType: 'columns',
    category: 'ai-tools',
    component: CSVProcessor
  }
];

export const features: Feature[] = [...freeFeatures, ...aiFeatures];

export default features;