// app/tasks/components/editModal.tsx
"use client";
import { Modal, TextInput, Select, Button } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import { Task, TaskStatus } from './types';

export default function EditModal({ task, opened, onClose, onSubmit }: {
  task: Task | null;
  opened: boolean;
  onClose: () => void;
  onSubmit: (task: Task) => void;
}) {
  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      status: TaskStatus.Pending,
      dueDate: null as Date | null,
    },
    validate: {
      title: (value) => (value.trim().length > 0 ? null : 'Title is required'),
      dueDate: (value) => (value ? null : 'Due date is required'),
    },
  });

  useEffect(() => {
    if (task) {
      form.setValues({
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate)
      });
    }
  }, [task]);

  const handleSubmit = (values: typeof form.values) => {
    if (!values.dueDate) return;
    
    onSubmit({
      ...task!,
      ...values,
      dueDate: values.dueDate
    });
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Edit Task" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Title"
          withAsterisk
          {...form.getInputProps('title')}
          mb="sm"
        />

        <TextInput
          label="Description"
          {...form.getInputProps('description')}
          mb="sm"
        />

        <Select
          label="Status"
          data={[
            { value: TaskStatus.Pending, label: 'Pending' },
            { value: TaskStatus.Completed, label: 'Completed' },
            { value: TaskStatus.InProgress, label: 'In Progress' },
          ]}
          {...form.getInputProps('status')}
          mb="sm"
        />

        <DateInput
          label="Due Date"
          value={form.values.dueDate}
          onChange={(date) => form.setFieldValue('dueDate', date)}
          minDate={new Date()}
          withAsterisk
          mb="md"
          popoverProps={{ withinPortal: true }}
        />

        <Button type="submit" fullWidth>
          Save Changes
        </Button>
      </form>
    </Modal>
  );
}