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
    <div className="rounded-md border border-primary-very-dark bg-primary-very-light-purple/10 overflow-hidden">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Table className="font-normal w-full table-fixed">
          <TableHeader>
            <TableRow className="text-md sm:text-lg bg-primary-very-light-purple/30 hover:bg-primary-very-light-purple/30 border-primary-very-dark">
              <TableHead className="w-10 sm:w-16"></TableHead>
              <TableHead className="text-gray-600 font-semibold align-top py-3 pt-4 sm:pt-6">Column Name</TableHead>
              <TableHead className="w-20 sm:w-40 text-gray-600 font-semibold align-top py-3 sm:py-6">
                <div className="flex flex-col sm:flex-row items-center">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={(checked) => onSelectAll(checked as boolean)}
                    className="order-2 sm:order-1 h-5 w-5 bg-white border-primary-bright-purple/30 data-[state=checked]:bg-primary-very-light-purple data-[state=checked]:border-primary-bright-purple/30 mr-1 sm:mr-2"
                  />
                  <span className="order-1 sm:order-2 mt-1 sm:mt-0">Include</span>
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