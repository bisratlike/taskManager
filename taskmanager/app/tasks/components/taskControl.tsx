import { Group, Button } from '@mantine/core';
import { IconPlus, IconArrowBack, IconArrowForward } from '@tabler/icons-react';

export default function TaskControls({ 
  onAdd, 
  onUndo, 
  onRedo, 
  canUndo, 
  canRedo 
}: {
  onAdd: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}) {
  return (
    <Group mb="md">
      <Button 
  leftSection={<IconPlus size={16} />}
  onClick={onAdd}
  variant="filled"
>
  New Task
</Button>
      
      <Button
        onClick={onUndo}
        disabled={!canUndo}
        variant="outline"
      >
        <IconArrowBack size={16} />
        Undo
      </Button>
      
      <Button
        onClick={onRedo}
        disabled={!canRedo}
        variant="outline"
      >
        <IconArrowForward size={16} />
        Redo
      </Button>
    </Group>
  );
}