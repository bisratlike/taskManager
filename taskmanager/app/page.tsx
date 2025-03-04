import Header from '../components/Header';
import '../app/globals.css';
import TaskPage from './tasks/page';
import React from 'react';
export default function Home() {
  return (
    <div><Header />
    <TaskPage/>
    </div>
    
  );
}
