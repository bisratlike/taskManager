import {pgTable , serial , text ,timestamp ,pgEnum} from "drizzle-orm/pg-core";
export const taskStatus = pgEnum("task_status",["pending","completed","in_progress"]);
export const tasks = pgTable("tasks",{
    id:serial("id").primaryKey(),
    title:text("title"),
    description:text("description"),
    status:taskStatus("status").default("pending"),
    dueDate:timestamp("due_date"),
    createdAt:timestamp("created_at").defaultNow(),
    updatedAt:timestamp("updated_at").defaultNow()
})