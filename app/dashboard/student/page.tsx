"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, LogOut, BookMarked, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookList } from "@/components/book-list"
import { StudentBorrowings } from "@/components/student-borrowings"

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("books")

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold">LibraryHub</span>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Student Dashboard</span>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-gray-50 border-r hidden md:block">
          <div className="p-4">
            <nav className="space-y-1">
              <Button
                variant={activeTab === "books" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("books")}
              >
                <BookMarked className="h-4 w-4 mr-2" />
                Browse Books
              </Button>
              <Button
                variant={activeTab === "borrowings" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("borrowings")}
              >
                <Clock className="h-4 w-4 mr-2" />
                My Borrowings
              </Button>
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-6 bg-gray-50">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="md:hidden">
              <TabsTrigger value="books">Browse Books</TabsTrigger>
              <TabsTrigger value="borrowings">My Borrowings</TabsTrigger>
            </TabsList>

            <TabsContent value="books" className="space-y-4">
              <h1 className="text-2xl font-bold">Browse Books</h1>
              <Card>
                <CardHeader>
                  <CardTitle>Available Books</CardTitle>
                  <CardDescription>Browse and borrow books from our collection</CardDescription>
                </CardHeader>
                <CardContent>
                  <BookList isAdmin={false} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="borrowings" className="space-y-4">
              <h1 className="text-2xl font-bold">My Borrowings</h1>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Current Borrowings</CardTitle>
                    <CardDescription>Books you currently have</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">2</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Books Due Soon</CardTitle>
                    <CardDescription>Return within 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">1</div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Borrowing History</CardTitle>
                </CardHeader>
                <CardContent>
                  <StudentBorrowings />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
