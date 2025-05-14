"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { getUserBorrowings, extendBorrowing } from "@/app/actions/borrowings"

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

export function StudentBorrowings() {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    async function fetchBorrowings() {
      if (!user) return

      setIsLoading(true)
      try {
        const { borrowings, error } = await getUserBorrowings(user.id)
        if (error) {
          toast({
            title: "Error fetching borrowings",
            description: error,
            variant: "destructive",
          })
        }
        if (borrowings) {
          setBorrowings(borrowings)
        }
      } catch (error: any) {
        toast({
          title: "Error fetching borrowings",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBorrowings()
  }, [user, toast])

  const handleExtendBorrowing = async (borrowingId: string) => {
    try {
      const { success, error } = await extendBorrowing(borrowingId)

      if (success) {
        setBorrowings(
          borrowings.map((borrowing) =>
            borrowing.id === borrowingId ? { ...borrowing, due_date: success.due_date } : borrowing,
          ),
        )
        toast({
          title: "Borrowing extended",
          description: "The borrowing due date has been extended.",
        })
      }

      if (error) {
        toast({
          title: "Error extending borrowing",
          description: error,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error extending borrowing",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const filteredBorrowings = borrowings.filter((borrowing) => {
    const bookTitle = borrowing.books?.title || ""
    return bookTitle.toLowerCase().includes(searchTerm.toLowerCase())
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Borrowings</h1>
        <div className="space-x-2">
          <Input
            type="text"
            placeholder="Search by book title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Book Title</TableHead>
            <TableHead>Borrow Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Return Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBorrowings.map((borrowing) => (
            <TableRow key={borrowing.id}>
              <TableCell>{borrowing.books?.title}</TableCell>
              <TableCell>{new Date(borrowing.borrow_date).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(borrowing.due_date).toLocaleDateString()}</TableCell>
              <TableCell>
                {borrowing.return_date ? new Date(borrowing.return_date).toLocaleDateString() : "Not Returned"}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    borrowing.status === "overdue"
                      ? "destructive"
                      : borrowing.status === "returned"
                        ? "secondary"
                        : "default"
                  }
                >
                  {borrowing.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {borrowing.status === "borrowed" && (
                  <Button variant="outline" size="sm" onClick={() => handleExtendBorrowing(borrowing.id)}>
                    Extend
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
