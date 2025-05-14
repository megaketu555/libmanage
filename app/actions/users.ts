"use server"

import { revalidatePath } from "next/cache"
import { createActionClient } from "@/lib/supabase/server"

export async function getUsers() {
  const supabase = createActionClient()

  const { data, error } = await supabase.from("profiles").select("*").order("name")

  if (error) {
    console.error("Error fetching users:", error)
    return { users: [], error: error.message }
  }

  return { users: data, error: null }
}

export async function getUserById(id: string) {
  const supabase = createActionClient()

  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching user:", error)
    return { user: null, error: error.message }
  }

  return { user: data, error: null }
}

export async function updateUserRole(id: string, role: "admin" | "librarian" | "student") {
  const supabase = createActionClient()

  const { data, error } = await supabase.from("profiles").update({ role }).eq("id", id).select()

  if (error) {
    console.error("Error updating user role:", error)
    return { user: null, error: error.message }
  }

  revalidatePath("/dashboard/admin")

  return { user: data[0], error: null }
}

export async function getUserBorrowingStats(userId: string) {
  const supabase = createActionClient()

  // Get current borrowings count
  const { data: currentBorrowings, error: currentError } = await supabase
    .from("borrowings")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "borrowed")

  // Get overdue borrowings count
  const { data: overdueBorrowings, error: overdueError } = await supabase
    .from("borrowings")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "overdue")

  if (currentError || overdueError) {
    console.error("Error fetching borrowing stats:", currentError || overdueError)
    return {
      current: 0,
      overdue: 0,
      error: (currentError || overdueError)?.message,
    }
  }

  return {
    current: currentBorrowings?.length || 0,
    overdue: overdueBorrowings?.length || 0,
    error: null,
  }
}
