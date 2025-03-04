"use client";
import Header from '../components/Header';
import TaskPage from './tasks/page';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-4 max-w-4xl mx-auto">
      <TaskPage/>
      </main>
    </div>
  );
}