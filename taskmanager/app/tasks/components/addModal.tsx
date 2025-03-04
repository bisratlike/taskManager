import React, { useState } from 'react';
import { Modal, Button, TextInput, Select } from '@mantine/core';

export enum TaskStatus {
  Pending = "pending",
  Completed = "completed",
  InProgress = "in_progress"
}

type AddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, description: string, status: TaskStatus, dueDate: Date) => void;
};

const AddModal: React.FC<AddModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.Pending);
  const [dueDate, setDueDate] = useState<Date | null>(null);

  const handleSave = () => {
    if (dueDate) {
      onSave(title, description, status, dueDate);
      onClose();
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Add New Task">
      <TextInput
        label="Title"
        value={title}
        onChange={(event) => setTitle(event.currentTarget.value)}
      />
      <TextInput
        label="Description"
        value={description}
        onChange={(event) => setDescription(event.currentTarget.value)}
      />
      <Select
        label="Status"
        value={status}
        onChange={(value) => setStatus(value as TaskStatus)}
        data={[
          { value: TaskStatus.Pending, label: 'Pending' },
          { value: TaskStatus.Completed, label: 'Completed' },
          { value: TaskStatus.InProgress, label: 'In Progress' },
        ]}
      />
      <TextInput
        label="Due Date"
        type="date"
        value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
        onChange={(event) => setDueDate(new Date(event.currentTarget.value))}
      />
      <Button onClick={handleSave}>Save</Button>
    </Modal>
  );
};

export default AddModal;