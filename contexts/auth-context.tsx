"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Session, User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

type Profile = {
  id: string
  name: string
  role: "admin" | "librarian" | "student"
}

type AuthContextType = {
  user: User | null
  profile: Profile | null
  session: Session | null
  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    error: any | null
    data: { session: Session | null; user: User | null } | null
  }>
  signUp: (
    email: string,
    password: string,
    name: string,
    role: string,
  ) => Promise<{
    error: any | null
    data: { session: Session | null; user: User | null } | null
  }>
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getSession = async () => {
      setLoading(true)
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

          setProfile(profile)
        }
      } catch (error) {
        console.error("Error getting session:", error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        setProfile(profile)
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error, data: null }
      }

      if (data.user) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

        setProfile(profile)

        if (profile?.role) {
          router.push(`/dashboard/${profile.role}`)
        }
      }

      return { data, error: null }
    } catch (error) {
      return { error, data: null }
    }
  }

  const signUp = async (email: string, password: string, name: string, role: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        return { error, data: null }
      }

      if (data.user) {
        // Create a profile for the new user
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          name,
          role,
        })

        if (profileError) {
          return { error: profileError, data: null }
        }

        const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

        setProfile(profile)

        if (profile?.role) {
          router.push(`/dashboard/${profile.role}`)
        }
      }

      return { data, error: null }
    } catch (error) {
      return { error, data: null }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const value = {
    user,
    profile,
    session,
    signIn,
    signUp,
    signOut,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
