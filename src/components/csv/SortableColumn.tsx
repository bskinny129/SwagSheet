import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

interface SortableColumnProps {
  column: string;
  isSelected: boolean;
  onToggle: () => void;
}

export function SortableColumn({
  column,
  isSelected,
  onToggle,
}: SortableColumnProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    overflow: 'hidden'
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className="group hover:bg-primary-very-light-purple/20 border-primary-bright-purple/20 text-lg"
      {...attributes}
    >
      <TableCell className="w-24 py-4">
       <div className="flex justify-center">
          <GripHorizontal
            className="h-6 w-6 text-primary-very-dark cursor-move"
            {...listeners}
          />
        </div>
      </TableCell>
      <TableCell className="text-gray-600 py-4 font-light">{column}</TableCell>
      <TableCell className="w-40 py-4 text-center">
        <div className="flex items-center">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onToggle}
            onClick={(e) => e.stopPropagation()}
            className="h-5 w-5 bg-white border-primary-bright-purple/30 data-[state=checked]:bg-primary-very-light-purple data-[state=checked]:border-primary-bright-purple/30"
          />
        </div>
      </TableCell>
    </TableRow>
  );
}