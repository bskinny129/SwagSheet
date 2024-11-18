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
      className="group hover:bg-[#363062]/50 text-lg"
      {...attributes}
    >
      <TableCell className="w-24 py-4">
       <div className="flex justify-center">
          <GripHorizontal
            className="h-6 w-6 text-[#818FB4] cursor-move"
            {...listeners}
          />
        </div>
      </TableCell>
      <TableCell className="text-[#F5E8C7] py-4 font-light">{column}</TableCell>
      <TableCell className="w-24 py-4 !pr-24 text-right">
        <div className="flex justify-end translate-x-[6px]">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onToggle}
            onClick={(e) => e.stopPropagation()}
            className="h-5 w-5 border-[#818FB4] data-[state=checked]:bg-[#818FB4] data-[state=checked]:border-[#818FB4]"
          />
        </div>
      </TableCell>
    </TableRow>
  );
}