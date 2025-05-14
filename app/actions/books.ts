"use server"

import { revalidatePath } from "next/cache"
import { createActionClient } from "@/lib/supabase/server"

export async function getBooks() {
  const supabase = createActionClient()

  const { data, error } = await supabase.from("books").select("*").order("title")

  if (error) {
    console.error("Error fetching books:", error)
    return { books: [], error: error.message }
  }

  return { books: data, error: null }
}

export async function getBookById(id: string) {
  const supabase = createActionClient()

  const { data, error } = await supabase.from("books").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching book:", error)
    return { book: null, error: error.message }
  }

  return { book: data, error: null }
}

export async function addBook(bookData: {
  title: string
  author: string
  isbn?: string
  category: string
  published_year?: number
  description?: string
  total_copies: number
  available_copies?: number
  cover_image?: string
}) {
  const supabase = createActionClient()

  // If available_copies is not provided, set it equal to total_copies
  if (!bookData.available_copies) {
    bookData.available_copies = bookData.total_copies
  }

  const { data, error } = await supabase.from("books").insert([bookData]).select()

  if (error) {
    console.error("Error adding book:", error)
    return { book: null, error: error.message }
  }

  revalidatePath("/dashboard/admin")
  revalidatePath("/dashboard/librarian")
  revalidatePath("/dashboard/student")

  return { book: data[0], error: null }
}

export async function updateBook(
  id: string,
  bookData: {
    title?: string
    author?: string
    isbn?: string
    category?: string
    published_year?: number
    description?: string
    total_copies?: number
    available_copies?: number
    cover_image?: string
  },
) {
  const supabase = createActionClient()

  const { data, error } = await supabase.from("books").update(bookData).eq("id", id).select()

  if (error) {
    console.error("Error updating book:", error)
    return { book: null, error: error.message }
  }

  revalidatePath("/dashboard/admin")
  revalidatePath("/dashboard/librarian")
  revalidatePath("/dashboard/student")

  return { book: data[0], error: null }
}

export async function deleteBook(id: string) {
  const supabase = createActionClient()

  const { error } = await supabase.from("books").delete().eq("id", id)

  if (error) {
    console.error("Error deleting book:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/admin")
  revalidatePath("/dashboard/librarian")
  revalidatePath("/dashboard/student")

  return { success: true, error: null }
}
