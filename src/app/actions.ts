"use server" // 👈 This marks the function as Backend Code

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

// 1. Function to create a task
export async function addTask(formData: FormData) {
  
  // Get the text from the input field named "title"
  const title = formData.get("title") as string
  
  // Save to database
  await prisma.task.create({
    data: {
      title: title,
    },
  })

  // Refresh the page data automatically
  revalidatePath("/")
}

// 2. Function to delete a task
export async function deleteTask(formData: FormData) {
  const id = formData.get("id") as string

  await prisma.task.delete({
    where: {
      id: id,
    },
  })

  revalidatePath("/")
}

// 3. Function to toggle status (Done / Not Done)
export async function toggleTask(formData: FormData) {
  const id = formData.get("id") as string

  // First, find the task to see if it's currently true or false
  const task = await prisma.task.findUnique({ where: { id } })
  
  if (!task) return

  // Then update it to the opposite value
  await prisma.task.update({
    where: { id },
    data: { isCompleted: !task.isCompleted },
  })

  revalidatePath("/")
}