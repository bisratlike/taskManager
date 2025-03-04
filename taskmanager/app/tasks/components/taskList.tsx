// app/tasks/components/TaskList.tsx
import React from 'react';
import { Button } from '@mantine/core';
import {Task}  from './types'; 

import { useState } from 'react';
import EditModal from './editModal';

type TaskListProps = {
  tasks: Task[];
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
};

const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete, onEdit }) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="p-4 bg-white rounded shadow">
          <h2 className="font-bold text-lg">{task.title}</h2>
          <p className="text-gray-600">{task.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-2 py-1 rounded text-sm ${
              task.status === "completed"? 'bg-green-100 text-green-800' :
              task.status === "in_progress" ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {task.status}
            </span>
            <span className="text-sm text-gray-500">
              Due: {task.dueDate.toLocaleDateString()}
            </span>
          </div>
          <div className="mt-2 flex gap-2">
            <Button size="sm" onClick={() => onEdit(task)}>Edit</Button>
            <Button size="sm" color="red" onClick={() => onDelete(task.id)}>
              Delete
            </Button>
          </div>
        </div>
      ))}
      
      <EditModal
        task={editingTask}
        isOpen={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        onSave={(updated) => {
          onEdit(updated);
          setEditingTask(null);
        }}
      />
    </div>
  );
};

export default TaskList;

