// app/tasks/page.tsx
"use client";
import { useEffect, useReducer } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Task,} from './components/types';
import { createTask, updateTask, deleteTask, getTasks } from './components/actions';
import TaskList from './components/taskList';
import TaskControls from './components/taskControl';
import AddModal from './components/addModal';

type State = {
  tasks: Task[];
  past: Task[][];
  future: Task[][];
};

type Action =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: number }
  | { type: 'UNDO' }
  | { type: 'REDO' };

const localStorageKey = 'taskManagerState';

// Custom replacer/reviver for Date handling
// app/tasks/page.tsx
const replacer = (key: string, value: any) => {
  if (value instanceof Date) return value.toISOString(); // Return ISO string instead of custom format
  return value;
};

const reviver = (key: string, value: any) => {
  if (typeof value === 'string' && isISO8601(value)) {
    const date = new Date(value);
   
    return new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    ));
  }
  return value;
};


function isISO8601(dateString: string) {
  return /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(dateString);
}

function reducer(state: State, action: Action): State {
  let newState = { ...state };

  switch (action.type) {
    case 'SET_TASKS':
      newState = { 
        tasks: action.payload.filter(task => 
          task !== null && task.title !== undefined
        ), 
        past: [], 
        future: [] 
      };
      break;
    case 'ADD_TASK':
      newState = {
        tasks: [...state.tasks, action.payload],
        past: [...state.past, state.tasks],
        future: []
      };
      break;
    case 'UPDATE_TASK':
      newState = {
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        ),
        past: [...state.past, state.tasks],
        future: []
      };
      break;
    case 'DELETE_TASK':
      newState = {
        tasks: state.tasks.filter(task => task.id !== action.payload),
        past: [...state.past, state.tasks],
        future: []
      };
      break;
    case 'UNDO':
      if (state.past.length === 0) return state;
      newState = {
        tasks: state.past[state.past.length - 1],
        past: state.past.slice(0, -1),
        future: [state.tasks, ...state.future]
      };
      break;
    case 'REDO':
      if (state.future.length === 0) return state;
      newState = {
        tasks: state.future[0],
        past: [...state.past, state.tasks],
        future: state.future.slice(1)
      };
      break;
    default:
      return state;
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(localStorageKey, JSON.stringify(newState, replacer));
  }
  
  return newState;
}

function getInitialState(): State {
  if (typeof window === 'undefined') return { tasks: [], past: [], future: [] };

  const saved = localStorage.getItem(localStorageKey);
  return saved ? JSON.parse(saved, reviver) : { tasks: [], past: [], future: [] };
}

export default function TaskPage() {
  const [state, dispatch] = useReducer(reducer, getInitialState());
  const [opened, { open, close }] = useDisclosure(false);

  
  useEffect(() => {
    const syncWithServer = async () => {
      try {
        const serverTasks = await getTasks();
        if (serverTasks) {
          dispatch({ type: 'SET_TASKS', payload: serverTasks });
        }
      } catch (error) {
        notifications.show({
          title: 'Sync Error',
          message: 'Failed to sync with server. Using local data.',
          color: 'yellow'
        });
      }
    };
    syncWithServer();
  }, []);
  

  const handleAdd = async (taskData: Omit<Task, 'id'>) => {
    try {
      const newTask = await createTask(taskData);
      dispatch({ type: 'ADD_TASK', payload: newTask });
      notifications.show({ title: 'Success', message: 'Task created!', color: 'teal' });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create task',
        color: 'red'
      });
    }
  };

  const handleUpdate = async (task: Task) => {
    try {
      await updateTask(task);
      dispatch({ type: 'UPDATE_TASK', payload: task });
      notifications.show({ title: 'Success', message: 'Task updated!', color: 'teal' });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update task',
        color: 'red'
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      dispatch({ type: 'DELETE_TASK', payload: id });
      notifications.show({ title: 'Success', message: 'Task deleted!', color: 'teal' });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete task',
        color: 'red'
      });
    }
  };

  return (
    <>
      <TaskControls 
        onAdd={open}
        onUndo={() => dispatch({ type: 'UNDO' })}
        onRedo={() => dispatch({ type: 'REDO' })}
        canUndo={state.past.length > 0}
        canRedo={state.future.length > 0}
      />

      <TaskList
        tasks={state.tasks}
        onEdit={handleUpdate}
        onDelete={handleDelete}
      />

      <AddModal
        opened={opened}
        onClose={close}
        onSubmit={handleAdd}
      />
    </>
  );
}