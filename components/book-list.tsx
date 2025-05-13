"use client"

import { useState } from "react"
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

// Sample book data
const sampleBooks = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "9780132350884",
    category: "Technology",
    publishedYear: 2008,
    available: 3,
    total: 5,
    description:
      "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. This book is a must for any developer, software engineer, project manager, team lead, or systems analyst with an interest in producing better code.",
  },
  {
    id: 2,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt, David Thomas",
    isbn: "9780201616224",
    category: "Technology",
    publishedYear: 1999,
    available: 2,
    total: 3,
    description:
      "The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development to examine the core process--taking a requirement and producing working, maintainable code that delights its users.",
  },
  {
    id: 3,
    title: "Design Patterns",
    author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    isbn: "9780201633610",
    category: "Technology",
    publishedYear: 1994,
    available: 0,
    total: 2,
    description:
      "Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems.",
  },
  {
    id: 4,
    title: "Atomic Habits",
    author: "James Clear",
    isbn: "9780735211292",
    category: "Self-Help",
    publishedYear: 2018,
    available: 4,
    total: 4,
    description:
      "No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
  },
  {
    id: 5,
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    isbn: "9780062316097",
    category: "History",
    publishedYear: 2014,
    available: 1,
    total: 3,
    description:
      "In Sapiens, Dr. Yuval Noah Harari spans the whole of human history, from the very first humans to walk the earth to the radical – and sometimes devastating – breakthroughs of the Cognitive, Agricultural and Scientific Revolutions.",
  },
]

interface BookListProps {
  isAdmin: boolean
}

export function BookList({ isAdmin }: BookListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBook, setSelectedBook] = useState<(typeof sampleBooks)[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const filteredBooks = sampleBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm),
  )

  const handleBorrow = (book: (typeof sampleBooks)[0]) => {
    if (book.available === 0) {
      toast({
        title: "Book unavailable",
        description: "This book is currently unavailable for borrowing.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Book borrowed",
      description: `You have successfully borrowed "${book.title}".`,
    })
  }

  const handleEdit = (book: (typeof sampleBooks)[0]) => {
    toast({
      title: "Edit book",
      description: `Editing "${book.title}" details.`,
    })
  }

  const handleDelete = (book: (typeof sampleBooks)[0]) => {
    toast({
      title: "Delete book",
      description: `"${book.title}" has been deleted from the library.`,
    })
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
                          variant={book.available > 0 ? "default" : "outline"}
                          className={book.available > 0 ? "bg-emerald-600" : ""}
                        >
                          {book.available > 0 ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">by {book.author}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary">{book.category}</Badge>
                        <Badge variant="secondary">{book.publishedYear}</Badge>
                        <Badge variant="secondary">ISBN: {book.isbn}</Badge>
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
                            <p>{book.description}</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="font-semibold">Category:</span> {book.category}
                              </div>
                              <div>
                                <span className="font-semibold">Published:</span> {book.publishedYear}
                              </div>
                              <div>
                                <span className="font-semibold">ISBN:</span> {book.isbn}
                              </div>
                              <div>
                                <span className="font-semibold">Availability:</span> {book.available}/{book.total}
                              </div>
                            </div>
                            {!isAdmin && (
                              <Button
                                className="w-full bg-emerald-600 hover:bg-emerald-700"
                                disabled={book.available === 0}
                                onClick={() => {
                                  handleBorrow(book)
                                  setIsDialogOpen(false)
                                }}
                              >
                                {book.available > 0 ? "Borrow Book" : "Unavailable"}
                              </Button>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {isAdmin ? (
                        <>
                          <Button variant="outline" onClick={() => handleEdit(book)}>
                            Edit
                          </Button>
                          <Button variant="destructive" onClick={() => handleDelete(book)}>
                            Delete
                          </Button>
                        </>
                      ) : (
                        <Button
                          className="bg-emerald-600 hover:bg-emerald-700"
                          disabled={book.available === 0}
                          onClick={() => handleBorrow(book)}
                        >
                          {book.available > 0 ? "Borrow" : "Unavailable"}
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Availability:</span> {book.available} of {book.total} copies
                      available
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
