"use client"

import { useState } from "react"
import { Search, Filter, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

// Sample user data
const sampleUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "student",
    status: "active",
    joined: "2023-01-15",
    borrowedBooks: 2,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "student",
    status: "active",
    joined: "2023-02-20",
    borrowedBooks: 1,
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    role: "librarian",
    status: "active",
    joined: "2022-11-05",
    borrowedBooks: 0,
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "student",
    status: "inactive",
    joined: "2023-03-10",
    borrowedBooks: 0,
  },
  {
    id: 5,
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    role: "admin",
    status: "active",
    joined: "2022-09-01",
    borrowedBooks: 0,
  },
]

export function UserList() {
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const filteredUsers = sampleUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (user: (typeof sampleUsers)[0]) => {
    toast({
      title: "Edit user",
      description: `Editing ${user.name}'s account details.`,
    })
  }

  const handleToggleStatus = (user: (typeof sampleUsers)[0]) => {
    const newStatus = user.status === "active" ? "inactive" : "active"
    toast({
      title: `User ${newStatus}`,
      description: `${user.name}'s account has been ${newStatus === "active" ? "activated" : "deactivated"}.`,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by name or email..."
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

      {filteredUsers.length === 0 ? (
        <div className="text-center py-10">
          <UserCircle className="h-10 w-10 mx-auto text-gray-400" />
          <p className="mt-2 text-gray-500">No users found matching your search.</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Books</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === "active" ? "default" : "secondary"}
                      className={user.status === "active" ? "bg-emerald-600" : ""}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.joined}</TableCell>
                  <TableCell>{user.borrowedBooks}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                        Edit
                      </Button>
                      <Button
                        variant={user.status === "active" ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleToggleStatus(user)}
                      >
                        {user.status === "active" ? "Deactivate" : "Activate"}
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
