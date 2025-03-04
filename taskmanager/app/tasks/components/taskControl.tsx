// app/tasks/components/TaskControls.tsx
import React from 'react';
import { Button } from '@mantine/core';

type TaskControlsProps = {
  onAdd: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};



const TaskControls: React.FC<TaskControlsProps> = ({ 
  onAdd, onUndo, onRedo, canUndo, canRedo 
}) => (
  <div className="flex gap-2 mb-4">
    <Button onClick={onAdd} color="blue">Add Task</Button>
    <Button onClick={onUndo} color="yellow" disabled={!canUndo}>Undo</Button>
    <Button onClick={onRedo} color="green" disabled={!canRedo}>Redo</Button>
  </div>
);

export default TaskControls;