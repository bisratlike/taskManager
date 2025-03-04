import React from 'react';
import { Modal, Button, TextInput, Select } from '@mantine/core';
import { TaskStatus } from './addModal';
import { Task } from './types';

type EditModalProps = {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
};

const EditModal: React.FC<EditModalProps> = ({ task, isOpen, onClose, onSave }) => {
    const [form, setForm] = React.useState({
      title: '',
      description: '',
      status: TaskStatus.Pending,
      dueDate: new Date(), // Initialize with current date
    });
  
    React.useEffect(() => {
      if (task) {
        setForm({
          title: task.title,
          description: task.description,
          status: task.status as TaskStatus,
          dueDate: new Date(task.dueDate), // Ensure Date object
        });
      }
    }, [task]);

  const handleSave = () => {
    if (!form.title || !form.dueDate) return;
    onSave({
      ...task!,
      ...form,
      dueDate: form.dueDate,
    });
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Edit Task">
      <TextInput
        label="Title"
        value={form.title}
        onChange={(event) => setForm({ ...form, title: event.currentTarget.value })}
      />
      <TextInput
        label="Description"
        value={form.description}
        onChange={(event) => setForm({ ...form, description: event.currentTarget.value })}
      />
      <Select
        label="Status"
        value={form.status}
        onChange={(value) => setForm({ ...form, status: value as TaskStatus })}
        data={[
          { value: TaskStatus.Pending, label: 'Pending' },
          { value: TaskStatus.Completed, label: 'Completed' },
          { value: TaskStatus.InProgress, label: 'In Progress' },
        ]}
      />
      <TextInput
        label="Due Date"
        type="date"
        value={form.dueDate ? form.dueDate.toISOString().split('T')[0] : ''}
        onChange={(event) => setForm({ ...form, dueDate: new Date(event.currentTarget.value) })}
      />
      <Button onClick={handleSave}>Save</Button>
    </Modal>
  );
};

export default EditModal;