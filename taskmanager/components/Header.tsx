// components/Header.tsx
import { Text } from '@mantine/core';

export default function Header() {
  return (
    <div style={{ 
      backgroundColor: '#6c5ce7', 
      padding: '1rem',
      width: '100%',
      textAlign: 'center'
    }}>
      <Text c="white" fw={700} size="xl">
        Task Manager
      </Text>
    </div>
  );
}