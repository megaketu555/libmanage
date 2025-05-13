import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold">LibraryHub</span>
          </div>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-gradient-to-b from-white to-emerald-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to LibraryHub</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              A modern library management system for students, librarians, and administrators.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  Get Started
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-emerald-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">User Management</h3>
                <p className="text-gray-600">
                  Secure login and signup system with role-based access for students, librarians, and administrators.
                </p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Book Catalog</h3>
                <p className="text-gray-600">
                  Comprehensive book management system allowing librarians and admins to add, update, and track books.
                </p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Borrowing System</h3>
                <p className="text-gray-600">
                  Students can easily browse, search, and borrow books with automated return date tracking.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© Crafted with ❤️ by Ronit Kashyap. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
