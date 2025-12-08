import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { User } from "@/components/types/user"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!email.trim() || !password) {
      toast.error("Email and password are required")
      return
    }

    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find(
      (u) => u.email === email.trim() && u.password === password
    )

    if (!user) {
      toast.error("Incorrect email or password")
      return
    }

    localStorage.setItem("currentUser", JSON.stringify(user))
    toast.success("Login successful")
    navigate("/FreelancerDashboard")
  }

  return (
    <Card className="w-full max-w-sm mx-auto mt-10 bg-white border border-gray-200 rounded-lg shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-center">Login</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Buttons match inputs perfectly */}
          <Button
            type="submit"
            className="w-full bg-[#3B82F6] text-white hover:bg-[#6366F1]"
          >
            Login
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full hover:bg-[#6366F1] hover:text-white"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default Login
