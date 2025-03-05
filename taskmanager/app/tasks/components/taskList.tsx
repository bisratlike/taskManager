// app/tasks/components/taskList.tsx
"use client";
import { Card, Text, Group, ActionIcon, Badge, Stack } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import EditModal from './editModal';
import { useState } from 'react';
import { Task, TaskStatus } from './types';

export default function TaskList({ tasks, onEdit, onDelete }: {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC' // Force UTC to match server-rendered format
    });
  };

  return (
    <Stack spacing="sm">
      {tasks
        .filter(task => task !== null)
        .map((task) => (
          <Card 
            key={task.id} 
            shadow="sm" 
            p="lg" 
            radius="md" 
            withBorder
            data-testid="task-card"
          >
            <Group position="apart" mb="xs">
              <Text weight={500} size="lg">{task.title}</Text>
              <Group spacing="xs">
                <ActionIcon
                  variant="light"
                  color="blue"
                  onClick={() => setEditingTask(task)}
                  aria-label="Edit task"
                >
                  <IconEdit size={18} />
                </ActionIcon>
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => onDelete(task.id)}
                  aria-label="Delete task"
                >
                  <IconTrash size={18} />
                </ActionIcon>
              </Group>
            </Group>

            {task.description && (
              <Text size="sm" color="dimmed" mb="xs">
                {task.description}
              </Text>
            )}

            <Group spacing="xl" align="center">
              <Badge
                variant="filled"
                color={
                  task.status === TaskStatus.Completed ? 'teal' :
                  task.status === TaskStatus.InProgress ? 'blue' : 'yellow'
                }
                size="lg"
              >
                {task.status.replace('_', ' ')}
              </Badge>
              <Text size="sm" weight={500}>
                Due: {formatDate(task.dueDate)}
              </Text>
            </Group>
          </Card>
        ))}

      <EditModal
        task={editingTask}
        opened={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={(editedTask) => {
          onEdit(editedTask);
          setEditingTask(null);
        }}
      />
    </Stack>
  );
}