export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          role: "admin" | "librarian" | "student"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          role: "admin" | "librarian" | "student"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: "admin" | "librarian" | "student"
          created_at?: string
          updated_at?: string
        }
      }
      books: {
        Row: {
          id: string
          title: string
          author: string
          isbn: string | null
          category: string
          published_year: number | null
          description: string | null
          total_copies: number
          available_copies: number
          cover_image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          author: string
          isbn?: string | null
          category: string
          published_year?: number | null
          description?: string | null
          total_copies?: number
          available_copies?: number
          cover_image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          author?: string
          isbn?: string | null
          category?: string
          published_year?: number | null
          description?: string | null
          total_copies?: number
          available_copies?: number
          cover_image?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      borrowings: {
        Row: {
          id: string
          book_id: string
          user_id: string
          borrow_date: string
          due_date: string
          return_date: string | null
          status: "borrowed" | "returned" | "overdue"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          book_id: string
          user_id: string
          borrow_date?: string
          due_date: string
          return_date?: string | null
          status: "borrowed" | "returned" | "overdue"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          user_id?: string
          borrow_date?: string
          due_date?: string
          return_date?: string | null
          status?: "borrowed" | "returned" | "overdue"
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
