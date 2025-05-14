import { NextResponse } from "next/server"
import { seedDatabase } from "@/app/actions/seed"

export async function GET() {
  const { success, error } = await seedDatabase()

  if (!success) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json({ message: "Database seeded successfully" })
}
