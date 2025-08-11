"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  username: string
  email: string
  avatar: string
  bio?: string
  following: string[]
  followers: string[]
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  followUser: (userId: string) => void
  unfollowUser: (userId: string) => void
  isFollowing: (userId: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    avatar: "/placeholder.svg?height=40&width=40&text=JD",
    bio: "Software Developer | Tech Enthusiast",
    following: [],
    followers: [],
  },
  {
    id: "2",
    name: "Jane Smith",
    username: "janesmith",
    email: "jane@example.com",
    avatar: "/placeholder.svg?height=40&width=40&text=JS",
    bio: "Designer | Creative Mind",
    following: [],
    followers: [],
  },
  {
    id: "3",
    name: "Sarah Johnson",
    username: "sarahj_dev",
    email: "sarah@example.com",
    avatar: "/placeholder.svg?height=40&width=40&text=SJ",
    bio: "Full Stack Developer | Open Source Contributor",
    following: [],
    followers: [],
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>(mockUsers)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("twitter-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would be an API call
    const foundUser = users.find((u) => u.email === email)
    if (foundUser && password === "password") {
      setUser(foundUser)
      localStorage.setItem("twitter-user", JSON.stringify(foundUser))
      return true
    }
    return false
  }

  const signup = async (name: string, username: string, email: string, password: string): Promise<boolean> => {
    // Check if user already exists
    if (users.find((u) => u.email === email || u.username === username)) {
      return false
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      username,
      email,
      avatar: `/placeholder.svg?height=40&width=40&text=${name.charAt(0)}${name.split(" ")[1]?.charAt(0) || ""}`,
      bio: "New to Twitter",
      following: [],
      followers: [],
    }

    setUsers([...users, newUser])
    setUser(newUser)
    localStorage.setItem("twitter-user", JSON.stringify(newUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("twitter-user")
  }

  const followUser = (userId: string) => {
    if (!user) return

    const updatedUsers = users.map((u) => {
      if (u.id === user.id) {
        return { ...u, following: [...u.following, userId] }
      }
      if (u.id === userId) {
        return { ...u, followers: [...u.followers, user.id] }
      }
      return u
    })

    setUsers(updatedUsers)
    const updatedCurrentUser = updatedUsers.find((u) => u.id === user.id)
    if (updatedCurrentUser) {
      setUser(updatedCurrentUser)
      localStorage.setItem("twitter-user", JSON.stringify(updatedCurrentUser))
    }
  }

  const unfollowUser = (userId: string) => {
    if (!user) return

    const updatedUsers = users.map((u) => {
      if (u.id === user.id) {
        return { ...u, following: u.following.filter((id) => id !== userId) }
      }
      if (u.id === userId) {
        return { ...u, followers: u.followers.filter((id) => id !== user.id) }
      }
      return u
    })

    setUsers(updatedUsers)
    const updatedCurrentUser = updatedUsers.find((u) => u.id === user.id)
    if (updatedCurrentUser) {
      setUser(updatedCurrentUser)
      localStorage.setItem("twitter-user", JSON.stringify(updatedCurrentUser))
    }
  }

  const isFollowing = (userId: string): boolean => {
    return user?.following.includes(userId) || false
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        followUser,
        unfollowUser,
        isFollowing,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
