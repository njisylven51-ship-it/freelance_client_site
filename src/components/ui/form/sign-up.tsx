import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import type { User } from "src/components/types/user"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Signup() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const navigate = useNavigate()

  const handleSignup = (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      toast.error("All fields are required")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      toast.error("Invalid email format")
      return
    }

    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]")
    const exist = users.find((u) => u.email === email)

    if (exist) {
      toast.error("User with this email already exists")
      return
    }

    const newUser: User = {
      name: name.trim(),
      email: email.trim(),
      password,
    }

    users.push(newUser)

    localStorage.setItem("users", JSON.stringify(users))
    localStorage.setItem("currentUser", JSON.stringify(newUser))

    toast.success("Signup successful!")
    navigate("/FreelancerDashboard")
  }

  return (
        <Card className="w-full max-w-sm mx-auto mt-10 bg-white border border-gray-200 rounded-lg shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-center">Sign up</CardTitle>
        <CardDescription className="text-center">
          Fill in your details to create an account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSignup} className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Buttons match input width perfectly */}
          <Button
            type="submit"
            className="w-full bg-[#3B82F6] text-white hover:bg-[#6366F1]"
          >
            Sign up
          </Button>

          <Button
            variant="outline"
            className="w-full hover:bg-[#6366F1] hover:text-white"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default Signup;
