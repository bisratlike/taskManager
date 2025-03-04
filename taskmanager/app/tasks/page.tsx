"use client";
import { useEffect, useReducer, useState } from 'react';
import AddModal from './components/addModal';
import TaskList from './components/taskList';
import TaskControls from './components/taskControl';
import { TaskStatus } from './components/addModal';
import { Task } from './components/types';
import { createTask, updateTask, deleteTask, getTasks } from './components/actions';

type State = {
  tasks: Task[];
  past: Task[][];
  future: Task[][];
};

type Action =
  | { type: 'ADD_TASK'; task: Task }
  | { type: 'REMOVE_TASK'; id: number }
  | { type: 'EDIT_TASK'; task: Task }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'INIT_TASKS'; tasks: Task[] };

const initialState: State = {
  tasks: [],
  past: [],
  future: [],
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'INIT_TASKS':
      return {
        tasks: action.tasks,
        past: [],
        future: [],
      };
    case 'EDIT_TASK': {
      const newTasks = state.tasks.map(task => 
        task.id === action.task.id ? action.task : task
      );
      return {
        tasks: newTasks,
        past: [...state.past, state.tasks],
        future: [],
      };
    }
    case 'ADD_TASK': {
      const newPast = [...state.past, state.tasks];
      return {
        tasks: [...state.tasks, action.task],
        past: newPast,
        future: [],
      };
    }
    case 'REMOVE_TASK': {
      const newTasks = state.tasks.filter(task => task.id !== action.id);
      const newPast = [...state.past, state.tasks];
      return {
        tasks: newTasks,
        past: newPast,
        future: [],
      };
    }
    case 'UNDO': {
      if (state.past.length === 0) return state;
      const previousTasks = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, state.past.length - 1);
      return {
        tasks: previousTasks,
        past: newPast,
        future: [state.tasks, ...state.future],
      };
    }
    case 'REDO': {
      if (state.future.length === 0) return state;
      const nextTasks = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        tasks: nextTasks,
        past: [...state.past, state.tasks],
        future: newFuture,
      };
    }
    default:
      return state;
  }
};

const replacer = (key: string, value: any) => {
  if (value instanceof Date) return { __type: 'Date', value: value.toISOString() };
  return value;
};

const reviver = (key: string, value: any) => {
  if (value?.__type === 'Date') return new Date(value.value);
  return value;
};

type TaskPageProps = {
  initialTasks: Task[];
};

export default function TaskPage({ initialTasks }: TaskPageProps) {
  const [state, dispatch] = useReducer(reducer, initialState, (initialState) => {
    if (typeof window === 'undefined') return initialState;
    
    const saved = localStorage.getItem('taskState');
    return saved ? JSON.parse(saved, reviver) : initialState;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync with server and localStorage
  useEffect(() => {
    const syncTasks = async () => {
      try {
        const serverTasks = await getTasks();
        if (serverTasks) {
          dispatch({ type: 'INIT_TASKS', tasks: serverTasks });
        }
      } catch (error) {
        console.error("Failed to load tasks:", error);
      }
    };
    syncTasks();
  }, []);

  useEffect(() => {
    localStorage.setItem('taskState', JSON.stringify(state, replacer));
  }, [state]);

  const handleAdd = async (title: string, description: string, status: TaskStatus, dueDate: Date) => {
    try {
      const newTask = await createTask(title, description, dueDate, status);
      if (newTask) {
        dispatch({ type: 'ADD_TASK', task: newTask });
      }
    } catch (error) {
      console.error("Failed to create task:", error);
    }
    setIsModalOpen(false);
  };

  const handleEdit = async (task: Task) => {
    try {
      await updateTask(task.id, task.title, task.description, task.dueDate, task.status as any);
      dispatch({ type: 'EDIT_TASK', task });
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      dispatch({ type: 'REMOVE_TASK', id });
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <div>
      <TaskList 
        tasks={state.tasks} 
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
      <TaskControls
        onAdd={() => setIsModalOpen(true)}
        onUndo={() => dispatch({ type: 'UNDO' })}
        onRedo={() => dispatch({ type: 'REDO' })}
        canUndo={state.past.length > 0}
        canRedo={state.future.length > 0}
      />
      <AddModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAdd} 
      />
    </div>
  );
}