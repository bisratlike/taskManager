// app/page.tsx
"use client";
import Header from '../components/Header';
import TaskPage from './tasks/page';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Header />
      <main style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
        <TaskPage />
      </main>
    </div>
  );
}