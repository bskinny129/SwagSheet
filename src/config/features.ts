import { CSVProcessor } from '@/components/csv/CSVProcessor';
import { ComingSoon } from '@/components/csv/ComingSoon';
import { AdvancedFilter } from '@/components/csv/AdvancedFilter';


export interface Feature {
  title: string;
  href: string;
  description: string;
  description2?: string;
  price: string;
  iconType: 'columns' | 'doc' | 'arrows' | 'rules';
  category: 'free-tools' | 'ai-tools';
  component?: React.ComponentType;
}

export const features: Feature[] = [
  {
    title: 'Advanced Filter',
    href: '/advanced-filter',
    description: 'Automatically filter rows based on complex criteria.',
    description2: 'Why? It is a pain to go row by row to figure out what data to keep and discard.',
    price: 'Free',
    iconType: 'rules',
    category: 'free-tools',
    component: AdvancedFilter
  },
  {
    title: 'CSV Reducer',
    href: '/csv-reducer',
    description: 'Remove and rearrange columns, plus limit the number of rows.',
    description2: 'Why? If you are using AI on your data, the cost and accuracy depends upon how much data you give it.',
    price: 'Free',
    iconType: 'columns',
    category: 'free-tools',
    component: CSVProcessor
  },
  {
    title: 'AI Contact Names',
    href: '/contact-names',
    description: 'Normalize and standardize contact names using advanced AI algorithms.',
    description2: "Why? People type in the craziest thing for their name, that doesn't mean you should use it. Or if they don't provide a name, it might be in their email address.",
    price: '½ cent per row',
    iconType: 'doc',
    category: 'ai-tools',
    component: ComingSoon
  },
  {
    title: 'AI Smart Merge',
    href: '/smart-merge',
    description: 'Intelligently merge CSV files with automatic duplicate detection.',
    description2: "Why? Too many separate emails lists to manage? Merge them all into one with tags.",
    price: '¼ cent per row',
    iconType: 'arrows',
    category: 'ai-tools',
    component: ComingSoon
  },
];

export const freeFeatures: Feature[] = features.filter(feature => feature.category === 'free-tools');
export const aiFeatures: Feature[] = features.filter(feature => feature.category === 'ai-tools');
