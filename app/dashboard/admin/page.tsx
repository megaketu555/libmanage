"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, LogOut, Users, BookPlus, Library, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddBookForm } from "@/components/add-book-form"
import { BookList } from "@/components/book-list"
import { UserList } from "@/components/user-list"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold">LibraryHub</span>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Admin Dashboard</span>
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
                variant={activeTab === "overview" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("overview")}
              >
                <Library className="h-4 w-4 mr-2" />
                Overview
              </Button>
              <Button
                variant={activeTab === "books" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("books")}
              >
                <BookPlus className="h-4 w-4 mr-2" />
                Manage Books
              </Button>
              <Button
                variant={activeTab === "users" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("users")}
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
              <Button
                variant={activeTab === "settings" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-6 bg-gray-50">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="md:hidden">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="books">Books</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Total Books</CardTitle>
                    <CardDescription>Library inventory</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">247</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Active Users</CardTitle>
                    <CardDescription>Registered accounts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">128</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Books Borrowed</CardTitle>
                    <CardDescription>Currently checked out</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">42</div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-b pb-2">
                      <p className="text-sm text-gray-500">Today, 10:15 AM</p>
                      <p>New book added: "The Design of Everyday Things"</p>
                    </div>
                    <div className="border-b pb-2">
                      <p className="text-sm text-gray-500">Yesterday, 3:45 PM</p>
                      <p>User "john.doe" borrowed "Clean Code"</p>
                    </div>
                    <div className="border-b pb-2">
                      <p className="text-sm text-gray-500">Yesterday, 1:30 PM</p>
                      <p>New librarian account created: "sarah.smith"</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="books" className="space-y-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Manage Books</h1>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <BookPlus className="h-4 w-4 mr-2" />
                  Add New Book
                </Button>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Add New Book</CardTitle>
                  <CardDescription>Enter the details of the new book</CardDescription>
                </CardHeader>
                <CardContent>
                  <AddBookForm />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Book Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                  <BookList isAdmin={true} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <h1 className="text-2xl font-bold">Manage Users</h1>
              <Card>
                <CardHeader>
                  <CardTitle>User Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                  <UserList />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <h1 className="text-2xl font-bold">Settings</h1>
              <Card>
                <CardHeader>
                  <CardTitle>Library Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">System settings will be displayed here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
