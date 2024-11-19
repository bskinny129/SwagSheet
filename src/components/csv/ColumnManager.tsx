import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SortableColumn } from './SortableColumn';
import { Checkbox } from '@/components/ui/checkbox';


interface ColumnManagerProps {
  columns: string[];
  selectedColumns: string[];
  onColumnsReorder: (newColumns: string[]) => void;
  onColumnToggle: (column: string) => void;
  selectAll: boolean;
  onSelectAll: (checked: boolean) => void;
}

export function ColumnManager({
  columns,
  selectedColumns,
  onColumnsReorder,
  onColumnToggle,
  selectAll,
  onSelectAll,
}: ColumnManagerProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      if (over && active.id !== over.id) {
        const oldIndex = columns.indexOf(active.id as string);
        const newIndex = columns.indexOf(over.id as string);
        const newColumns = arrayMove(columns, oldIndex, newIndex);
        onColumnsReorder(newColumns);
      }
    }
  };

  return (
    <div className="rounded-md border border-[#818FB4]/20 bg-[#435585]/50 overflow-hidden">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Table className="font-normal w-full table-fixed">
          <TableHeader>
            <TableRow className="text-lg">
              <TableHead className="w-16 py-6 font-semibold"></TableHead>
              <TableHead className="text-[#F5E8C7] py-6 font-semibold">Column Name</TableHead>
              <TableHead className="w-40 text-[#F5E8C7] py-6 font-semibold">
                <div className="flex items-center">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={(checked) => onSelectAll(checked as boolean)}
                    className="h-5 w-5 border-[#818FB4] data-[state=checked]:bg-[#818FB4] data-[state=checked]:border-[#818FB4] mr-2"
                  />
                  Include
                </div>
                
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody style={{ overflow: 'clip' }}>
            <SortableContext
              items={columns}
              strategy={horizontalListSortingStrategy}
            >
              {columns.map((column) => (
                <SortableColumn
                  key={column}
                  column={column}
                  isSelected={selectedColumns.includes(column)}
                  onToggle={() => onColumnToggle(column)}
                />
              ))}
            </SortableContext>
          </TableBody>
        </Table>
      </DndContext>
    </div>
  );
}