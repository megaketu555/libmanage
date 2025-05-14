"use server"

import { revalidatePath } from "next/cache"
import { createActionClient } from "@/lib/supabase/server"

// Helper function to add days to a date
function addDays(date: Date, days: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export async function getBorrowings() {
  const supabase = createActionClient()

  const { data, error } = await supabase
    .from("borrowings")
    .select(`
      *,
      books (
        id,
        title,
        author
      )
    `)
    .order("borrow_date", { ascending: false })

  if (error) {
    console.error("Error fetching borrowings:", error)
    return { borrowings: [], error: error.message }
  }

  return { borrowings: data, error: null }
}

export async function getUserBorrowings(userId: string) {
  const supabase = createActionClient()

  const { data, error } = await supabase
    .from("borrowings")
    .select(`
      *,
      books (
        id,
        title,
        author
      )
    `)
    .eq("user_id", userId)
    .order("borrow_date", { ascending: false })

  if (error) {
    console.error("Error fetching user borrowings:", error)
    return { borrowings: [], error: error.message }
  }

  return { borrowings: data, error: null }
}

export async function borrowBook(bookId: string, userId: string) {
  const supabase = createActionClient()

  // Check if book is available
  const { data: book, error: bookError } = await supabase
    .from("books")
    .select("available_copies")
    .eq("id", bookId)
    .single()

  if (bookError) {
    console.error("Error fetching book:", bookError)
    return { success: false, error: bookError.message }
  }

  if (!book || book.available_copies <= 0) {
    return { success: false, error: "Book is not available for borrowing" }
  }

  // Check if user already has this book borrowed
  const { data: existingBorrowing, error: borrowingError } = await supabase
    .from("borrowings")
    .select("id")
    .eq("book_id", bookId)
    .eq("user_id", userId)
    .eq("status", "borrowed")
    .maybeSingle()

  if (borrowingError) {
    console.error("Error checking existing borrowings:", borrowingError)
    return { success: false, error: borrowingError.message }
  }

  if (existingBorrowing) {
    return { success: false, error: "You already have this book borrowed" }
  }

  // Create borrowing record
  const borrowDate = new Date()
  const dueDate = addDays(borrowDate, 14) // 2 weeks loan period

  const { error } = await supabase.from("borrowings").insert([
    {
      book_id: bookId,
      user_id: userId,
      borrow_date: borrowDate.toISOString(),
      due_date: dueDate.toISOString(),
      status: "borrowed",
    },
  ])

  if (error) {
    console.error("Error creating borrowing record:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/admin")
  revalidatePath("/dashboard/librarian")
  revalidatePath("/dashboard/student")

  return { success: true, error: null }
}

export async function returnBook(borrowingId: string) {
  const supabase = createActionClient()

  const returnDate = new Date()

  const { error } = await supabase
    .from("borrowings")
    .update({
      return_date: returnDate.toISOString(),
      status: "returned",
    })
    .eq("id", borrowingId)

  if (error) {
    console.error("Error returning book:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/admin")
  revalidatePath("/dashboard/librarian")
  revalidatePath("/dashboard/student")

  return { success: true, error: null }
}

export async function extendBorrowing(borrowingId: string, days = 14) {
  const supabase = createActionClient()

  // Get current due date
  const { data: borrowing, error: fetchError } = await supabase
    .from("borrowings")
    .select("due_date, status")
    .eq("id", borrowingId)
    .single()

  if (fetchError) {
    console.error("Error fetching borrowing:", fetchError)
    return { success: false, error: fetchError.message }
  }

  if (!borrowing || borrowing.status === "returned") {
    return { success: false, error: "Cannot extend a returned borrowing" }
  }

  // Calculate new due date
  const currentDueDate = new Date(borrowing.due_date)
  const newDueDate = addDays(currentDueDate, days)

  // Update due date
  const { error } = await supabase
    .from("borrowings")
    .update({
      due_date: newDueDate.toISOString(),
      // If it was overdue, change it back to borrowed
      status: borrowing.status === "overdue" ? "borrowed" : borrowing.status,
    })
    .eq("id", borrowingId)

  if (error) {
    console.error("Error extending borrowing:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/admin")
  revalidatePath("/dashboard/librarian")
  revalidatePath("/dashboard/student")

  return { success: true, error: null }
}

export async function updateOverdueBorrowings() {
  const supabase = createActionClient()

  const today = new Date()

  // Update all borrowings where due_date < today and status is 'borrowed'
  const { error } = await supabase
    .from("borrowings")
    .update({
      status: "overdue",
    })
    .lt("due_date", today.toISOString())
    .eq("status", "borrowed")

  if (error) {
    console.error("Error updating overdue borrowings:", error)
    return { success: false, error: error.message }
  }

  return { success: true, error: null }
}
