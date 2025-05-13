"use client"

import { useState } from "react"
import { Search, Filter, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

// Sample student borrowing data
const sampleBorrowings = [
  {
    id: 1,
    bookTitle: "Clean Code",
    bookId: 1,
    borrowDate: "2023-04-15",
    dueDate: "2023-05-15",
    status: "borrowed",
  },
  {
    id: 2,
    bookTitle: "The Pragmatic Programmer",
    bookId: 2,
    borrowDate: "2023-04-20",
    dueDate: "2023-05-20",
    status: "borrowed",
  },
  {
    id: 3,
    bookTitle: "Design Patterns",
    bookId: 3,
    borrowDate: "2023-03-10",
    dueDate: "2023-04-10",
    status: "overdue",
  },
  {
    id: 4,
    bookTitle: "Atomic Habits",
    bookId: 4,
    borrowDate: "2023-03-05",
    dueDate: "2023-04-05",
    status: "returned",
    returnDate: "2023-03-25",
  },
  {
    id: 5,
    bookTitle: "Sapiens: A Brief History of Humankind",
    bookId: 5,
    borrowDate: "2023-02-01",
    dueDate: "2023-03-01",
    status: "returned",
    returnDate: "2023-02-28",
  },
]

export function StudentBorrowings() {
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const filteredBorrowings = sampleBorrowings.filter((borrowing) =>
    borrowing.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleRenew = (borrowing: (typeof sampleBorrowings)[0]) => {
    if (borrowing.status === "returned") {
      toast({
        title: "Cannot renew",
        description: "This book has already been returned.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Book renewed",
      description: `"${borrowing.bookTitle}" has been renewed for 14 more days.`,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by book title..."
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
                <TableHead>Borrow Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBorrowings.map((borrowing) => (
                <TableRow key={borrowing.id}>
                  <TableCell className="font-medium">{borrowing.bookTitle}</TableCell>
                  <TableCell>{borrowing.borrowDate}</TableCell>
                  <TableCell>{borrowing.dueDate}</TableCell>
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
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={borrowing.status === "returned"}
                      onClick={() => handleRenew(borrowing)}
                    >
                      Renew
                    </Button>
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
