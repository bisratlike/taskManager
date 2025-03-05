// app/tasks/components/actions.ts
"use server";
import { db } from "@/drizzle/db";
import { tasks } from "@/drizzle/schema";
import { eq, asc } from "drizzle-orm";
import { Task} from './types';

export async function createTask(taskData: Omit<Task, 'id'>) {
  try {
      const dueDate = taskData.dueDate instanceof Date 
          ? taskData.dueDate 
          : new Date(taskData.dueDate);
      console.log("Task Data:", taskData);
      console.log("Due Date:", dueDate);

      const [newTask] = await db.insert(tasks).values({
          title: taskData.title,
          description: taskData.description,
          dueDate: dueDate,
          status: taskData.status,
      }).returning();

      console.log("New Task:", newTask);
      return newTask;
  } catch (error) {
      console.error("Error creating task:", error);
      throw new Error("Failed to create task");
  }
}

export async function updateTask(task: Task) {
  try {
    const [updatedTask] = await db.update(tasks)
      .set({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        status: task.status,
      })
      .where(eq(tasks.id, task.id))
      .returning();

    return updatedTask;
  } catch (error) {
    console.error("Error updating task:", error);
    throw new Error("Failed to update task");
  }
}



export async function deleteTask(id: number) {
    try{

        const [deletedTask]= await db.delete(tasks).where(eq(tasks.id, id)).returning();
        return deletedTask;

    }catch(error){

        console.log("error on deleting task",error)
    }
}


// app/tasks/components/actions.ts
export async function getTasks() {
    try {
      const allTasks = await db.select().from(tasks).orderBy(asc(tasks.id));
      return allTasks || [];
    } catch (error) {
      console.log("error on getting tasks", error);
      return [];
    }
  }