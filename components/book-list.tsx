"use client"

import { useState, useEffect } from "react"
import { Search, Filter, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { getBooks, deleteBook } from "@/app/actions/books"
import { borrowBook } from "@/app/actions/borrowings"

interface Book {
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

interface BookListProps {
  isAdmin: boolean
}

export function BookList({ isAdmin }: BookListProps) {
  const [books, setBooks] = useState<Book[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    async function fetchBooks() {
      setIsLoading(true)
      try {
        const { books, error } = await getBooks()
        if (error) {
          toast({
            title: "Error fetching books",
            description: error,
            variant: "destructive",
          })
        } else {
          setBooks(books)
        }
      } catch (error) {
        toast({
          title: "Error fetching books",
          description: "An unexpected error occurred.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [toast])

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.isbn && book.isbn.includes(searchTerm)),
  )

  const handleBorrow = async (book: Book) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to borrow books.",
        variant: "destructive",
      })
      return
    }

    if (book.available_copies === 0) {
      toast({
        title: "Book unavailable",
        description: "This book is currently unavailable for borrowing.",
        variant: "destructive",
      })
      return
    }

    try {
      const { success, error } = await borrowBook(book.id, user.id)

      if (error) {
        toast({
          title: "Failed to borrow book",
          description: error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Book borrowed",
          description: `You have successfully borrowed "${book.title}".`,
        })

        // Update local state to reflect the change
        setBooks(books.map((b) => (b.id === book.id ? { ...b, available_copies: b.available_copies - 1 } : b)))
      }
    } catch (error) {
      toast({
        title: "Failed to borrow book",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (book: Book) => {
    try {
      const { success, error } = await deleteBook(book.id)

      if (error) {
        toast({
          title: "Failed to delete book",
          description: error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Book deleted",
          description: `"${book.title}" has been deleted from the library.`,
        })

        // Update local state to reflect the change
        setBooks(books.filter((b) => b.id !== book.id))
      }
    } catch (error) {
      toast({
        title: "Failed to delete book",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p>Loading books...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by title, author, or ISBN..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="sm:w-auto">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="text-center py-10">
          <BookOpen className="h-10 w-10 mx-auto text-gray-400" />
          <p className="mt-2 text-gray-500">No books found matching your search.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{book.title}</h3>
                        <Badge
                          variant={book.available_copies > 0 ? "default" : "outline"}
                          className={book.available_copies > 0 ? "bg-emerald-600" : ""}
                        >
                          {book.available_copies > 0 ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">by {book.author}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary">{book.category}</Badge>
                        {book.published_year && <Badge variant="secondary">{book.published_year}</Badge>}
                        {book.isbn && <Badge variant="secondary">ISBN: {book.isbn}</Badge>}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-start">
                      <Dialog
                        open={isDialogOpen && selectedBook?.id === book.id}
                        onOpenChange={(open) => {
                          setIsDialogOpen(open)
                          if (!open) setSelectedBook(null)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedBook(book)
                              setIsDialogOpen(true)
                            }}
                          >
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{book.title}</DialogTitle>
                            <DialogDescription>by {book.author}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <p>{book.description || "No description available."}</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="font-semibold">Category:</span> {book.category}
                              </div>
                              {book.published_year && (
                                <div>
                                  <span className="font-semibold">Published:</span> {book.published_year}
                                </div>
                              )}
                              {book.isbn && (
                                <div>
                                  <span className="font-semibold">ISBN:</span> {book.isbn}
                                </div>
                              )}
                              <div>
                                <span className="font-semibold">Availability:</span> {book.available_copies}/
                                {book.total_copies}
                              </div>
                            </div>
                            {!isAdmin && (
                              <Button
                                className="w-full bg-emerald-600 hover:bg-emerald-700"
                                disabled={book.available_copies === 0}
                                onClick={() => {
                                  handleBorrow(book)
                                  setIsDialogOpen(false)
                                }}
                              >
                                {book.available_copies > 0 ? "Borrow Book" : "Unavailable"}
                              </Button>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {isAdmin ? (
                        <>
                          <Button variant="outline">Edit</Button>
                          <Button variant="destructive" onClick={() => handleDelete(book)}>
                            Delete
                          </Button>
                        </>
                      ) : (
                        <Button
                          className="bg-emerald-600 hover:bg-emerald-700"
                          disabled={book.available_copies === 0}
                          onClick={() => handleBorrow(book)}
                        >
                          {book.available_copies > 0 ? "Borrow" : "Unavailable"}
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Availability:</span> {book.available_copies} of {book.total_copies}{" "}
                      copies available
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
