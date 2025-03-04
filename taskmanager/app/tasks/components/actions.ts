
"use server";
import {db} from "@/drizzle/db";
import {tasks} from "@/drizzle/schema";
import { eq, asc } from "drizzle-orm";
// import { sql } from "drizzle-orm";


export async function createTask(title: string, description: string, dueDate: Date, status: "pending" | "completed" | "in_progress" = "pending") {

    try{

        const [newTask]= await db.insert(tasks).values({
            title,
            description,
            dueDate,
            status, 
        }).returning();
        return newTask;
      
    

    }catch(error){

    console.log("error on creating task",error)
    }

}

export async function updateTask(id: number, title: string, description: string, dueDate: Date, status: "pending" | "completed" | "in_progress") {

    try{

        const [updatedTask]= await db.update(tasks).set({
            title,
            description,
            dueDate,
            status
        }).where(eq(tasks.id, id)).returning();

        return updatedTask;

    }catch(error){

        console.log("error on updating task",error)
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


export async function getTasks() {
    try{

        const allTasks = await db.select().from(tasks).orderBy(asc(tasks.id));
       
        return allTasks|| []; ;

    }catch(error){

        console.log("error on getting tasks",error)
    }
}