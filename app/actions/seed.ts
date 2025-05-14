"use server"

import { createActionClient } from "@/lib/supabase/server"

export async function seedDatabase() {
  const supabase = createActionClient()

  // Sample books data
  const books = [
    {
      title: "Clean Code",
      author: "Robert C. Martin",
      isbn: "9780132350884",
      category: "Technology",
      published_year: 2008,
      description:
        "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. This book is a must for any developer, software engineer, project manager, team lead, or systems analyst with an interest in producing better code.",
      total_copies: 5,
      available_copies: 5,
    },
    {
      title: "The Pragmatic Programmer",
      author: "Andrew Hunt, David Thomas",
      isbn: "9780201616224",
      category: "Technology",
      published_year: 1999,
      description:
        "The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development to examine the core process--taking a requirement and producing working, maintainable code that delights its users.",
      total_copies: 3,
      available_copies: 3,
    },
    {
      title: "Design Patterns",
      author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
      isbn: "9780201633610",
      category: "Technology",
      published_year: 1994,
      description:
        "Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems.",
      total_copies: 2,
      available_copies: 2,
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      isbn: "9780735211292",
      category: "Self-Help",
      published_year: 2018,
      description:
        "No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
      total_copies: 4,
      available_copies: 4,
    },
    {
      title: "Sapiens: A Brief History of Humankind",
      author: "Yuval Noah Harari",
      isbn: "9780062316097",
      category: "History",
      published_year: 2014,
      description:
        "In Sapiens, Dr. Yuval Noah Harari spans the whole of human history, from the very first humans to walk the earth to the radical – and sometimes devastating – breakthroughs of the Cognitive, Agricultural and Scientific Revolutions.",
      total_copies: 3,
      available_copies: 3,
    },
  ]

  // Insert books
  const { error: booksError } = await supabase.from("books").upsert(books, { onConflict: "isbn" })

  if (booksError) {
    console.error("Error seeding books:", booksError)
    return { success: false, error: booksError.message }
  }

  return { success: true, error: null }
}
