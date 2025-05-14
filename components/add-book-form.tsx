"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { addBook } from "@/app/actions/books"

export function AddBookForm() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    published_year: "",
    description: "",
    copies: "1",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await addBook({
        title: formData.title,
        author: formData.author,
        isbn: formData.isbn || undefined,
        category: formData.category || "Uncategorized",
        published_year: formData.published_year ? Number.parseInt(formData.published_year) : undefined,
        description: formData.description || undefined,
        total_copies: Number.parseInt(formData.copies) || 1,
      })

      if (error) {
        toast({
          title: "Failed to add book",
          description: error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Book added",
          description: `"${formData.title}" has been added to the library.`,
        })

        // Reset form
        setFormData({
          title: "",
          author: "",
          isbn: "",
          category: "",
          published_year: "",
          description: "",
          copies: "1",
        })
      }
    } catch (error) {
      toast({
        title: "Failed to add book",
        description: "There was an error adding the book.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input id="author" name="author" value={formData.author} onChange={handleChange} required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="isbn">ISBN</Label>
          <Input id="isbn" name="isbn" value={formData.isbn} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fiction">Fiction</SelectItem>
              <SelectItem value="non-fiction">Non-Fiction</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="history">History</SelectItem>
              <SelectItem value="biography">Biography</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="published_year">Published Year</Label>
          <Input
            id="published_year"
            name="published_year"
            type="number"
            value={formData.published_year}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="copies">Number of Copies</Label>
          <Input
            id="copies"
            name="copies"
            type="number"
            min="1"
            value={formData.copies}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} />
      </div>

      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
        {isLoading ? "Adding Book..." : "Add Book"}
      </Button>
    </form>
  )
}
