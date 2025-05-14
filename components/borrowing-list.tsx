"use client"

import { useState, useEffect } from "react"
import { Search, Filter, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getBorrowings, returnBook, extendBorrowing } from "@/app/actions/borrowings"

interface Book {
  id: string
  title: string
  author: string
}

interface Borrowing {
  id: string
  book_id: string
  user_id: string
  borrow_date: string
  due_date: string
  return_date: string | null
  status: "borrowed" | "returned" | "overdue"
  created_at: string
  updated_at: string
  books: Book
}

export function BorrowingList() {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchBorrowings() {
      setIsLoading(true)
      try {
        const { borrowings, error } = await getBorrowings()
        if (error) {
          toast({
            title: "Error fetching borrowings",
            description: error,
            variant: "destructive",
          })
        } else {
          setBorrowings(borrowings)
        }
      } catch (error) {
        toast({
          title: "Error fetching borrowings",
          description: "An unexpected error occurred.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBorrowings()
  }, [toast])

  const filteredBorrowings = borrowings.filter(
    (borrowing) =>
      borrowing.books.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrowing.user_id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleReturn = async (borrowing: Borrowing) => {
    if (borrowing.status === "returned") {
      toast({
        title: "Already returned",
        description: `This book has already been returned on ${new Date(borrowing.return_date!).toLocaleDateString()}.`,
      })
      return
    }

    try {
      const { success, error } = await returnBook(borrowing.id)

      if (error) {
        toast({
          title: "Failed to return book",
          description: error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Book returned",
          description: `"${borrowing.books.title}" has been marked as returned.`,
        })

        // Update local state to reflect the change
        setBorrowings(
          borrowings.map((b) =>
            b.id === borrowing.id ? { ...b, status: "returned", return_date: new Date().toISOString() } : b,
          ),
        )
      }
    } catch (error) {
      toast({
        title: "Failed to return book",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  }

  const handleExtend = async (borrowing: Borrowing) => {
    if (borrowing.status === "returned") {
      toast({
        title: "Cannot extend",
        description: "This book has already been returned.",
        variant: "destructive",
      })
      return
    }

    try {
      const { success, error } = await extendBorrowing(borrowing.id)

      if (error) {
        toast({
          title: "Failed to extend due date",
          description: error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Due date extended",
          description: `The due date for "${borrowing.books.title}" has been extended by 14 days.`,
        })

        // Update local state to reflect the change
        const currentDueDate = new Date(borrowing.due_date)
        const newDueDate = new Date(currentDueDate)
        newDueDate.setDate(newDueDate.getDate() + 14)

        setBorrowings(
          borrowings.map((b) =>
            b.id === borrowing.id
              ? {
                  ...b,
                  due_date: newDueDate.toISOString(),
                  status: b.status === "overdue" ? "borrowed" : b.status,
                }
              : b,
          ),
        )
      }
    } catch (error) {
      toast({
        title: "Failed to extend due date",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p>Loading borrowings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by book title or borrower..."
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

      {filteredBorrowings.length === 0 ? (
        <div className="text-center py-10">
          <BookOpen className="h-10 w-10 mx-auto text-gray-400" />
          <p className="mt-2 text-gray-500">No borrowing records found matching your search.</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book</TableHead>
                <TableHead>Borrower</TableHead>
                <TableHead>Borrow Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBorrowings.map((borrowing) => (
                <TableRow key={borrowing.id}>
                  <TableCell className="font-medium">{borrowing.books.title}</TableCell>
                  <TableCell>{borrowing.user_id}</TableCell>
                  <TableCell>{new Date(borrowing.borrow_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(borrowing.due_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        borrowing.status === "borrowed"
                          ? "default"
                          : borrowing.status === "overdue"
                            ? "destructive"
                            : "secondary"
                      }
                      className={borrowing.status === "borrowed" ? "bg-emerald-600" : ""}
                    >
                      {borrowing.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={borrowing.status === "returned"}
                        onClick={() => handleReturn(borrowing)}
                      >
                        Mark Returned
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={borrowing.status === "returned"}
                        onClick={() => handleExtend(borrowing)}
                      >
                        Extend
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
