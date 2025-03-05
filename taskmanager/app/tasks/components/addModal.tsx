// app/tasks/components/addModal.tsx
"use client";
import { Modal, Button, TextInput, Select, DatePicker } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Task, TaskStatus } from './types';
import { DateInput } from '@mantine/dates';

import { showNotification } from '@mantine/notifications';

type AddModalProps = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (taskData: Omit<Task, 'id'>) => void;
};

const AddModal: React.FC<AddModalProps> = ({ opened, onClose, onSubmit }) => {
  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      status: TaskStatus.Pending,
      dueDate: null as Date | null,
    },
    validate: {
      title: (value) => (value.trim() ? null : 'Title is required'),
      dueDate: (value) => (value ? null : 'Due date is required'),
    },
  });

// app/tasks/components/addModal.tsx
const handleSubmit = (values: typeof form.values) => {
  try {
    if (!values.dueDate) {
      throw new Error("Due date is required");
    }
    
    onSubmit({
      ...values,
      dueDate: values.dueDate instanceof Date 
        ? values.dueDate 
        : new Date(values.dueDate)
    });
    
    form.reset();
    onClose();
  } catch (error) {
    console.error("Submission error:", error);
    showNotification({
      title: 'Submission error',
      message: error.message,
      color: 'red',
    });
  }
};
  return (
    <Modal opened={opened} onClose={onClose} title="Add New Task">
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
  mb="sm"
  minDate={new Date()}
/>
        
        <Button type="submit" fullWidth>
          Create Task
        </Button>
      </form>
    </Modal>
  );
};

export default AddModal;