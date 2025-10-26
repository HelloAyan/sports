"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { signInWithGoogle, signInWithFacebook, signInWithLine, signInWithEmail } from "@/lib/auth"

export function AuthModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const showModal = () => {
      if (!document.cookie.includes("auth_modal_shown")) {
        setIsOpen(true)
        // Set cookie to expire in 24 hours
        document.cookie = "auth_modal_shown=true; max-age=86400; path=/"
      }
    }

    const interval = setInterval(showModal, 22000) // Show every 22 seconds if cookie not set

    return () => clearInterval(interval)
  }, [])

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const result = await signInWithEmail(email, password)
      if (result.success) {
        setIsOpen(false)
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    }
  }

  const handleSocialSignIn = async (provider: "google" | "facebook" | "line") => {
    setError("")

    try {
      const signInMethod = {
        google: signInWithGoogle,
        facebook: signInWithFacebook,
        line: signInWithLine,
      }[provider]

      const result = await signInMethod()
      if (result.success) {
        setIsOpen(false)
      } else {
        setError(`Failed to sign in with ${provider}`)
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[800px] p-0">
        <div className="grid md:grid-cols-2">
          {/* Left Side - Form */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="ghost" className="h-6 w-6 p-0 rounded-full" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Username / Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me
                  </Label>
                </div>
                <Button variant="link" className="px-0 text-sm">
                  Forgot Password?
                </Button>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button type="submit" className="w-full">
                Sign in
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Button type="button" variant="outline" onClick={() => handleSocialSignIn("google")} className="w-full">
                  <Image src="/google.svg" alt="Google" width={20} height={20} className="mr-2" />
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialSignIn("facebook")}
                  className="w-full"
                >
                  <Image src="/facebook.svg" alt="Facebook" width={20} height={20} className="mr-2" />
                  Facebook
                </Button>
                <Button type="button" variant="outline" onClick={() => handleSocialSignIn("line")} className="w-full">
                  <Image src="/line.svg" alt="LINE" width={20} height={20} className="mr-2" />
                  LINE
                </Button>
              </div>
            </form>
          </div>

          {/* Right Side - Benefits */}
          <div className="bg-gray-900 p-6 text-white">
            <div className="flex items-center gap-4 mb-8">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-heB94aRhJMK3hY2XtWCRWEXjrrjyKo.png"
                alt="Sports Fixtures"
                width={50}
                height={50}
              />
              <h2 className="text-2xl font-bold">SPORTS FIXTURES</h2>
            </div>

            <h3 className="text-xl font-bold mb-6">Why Sign Up?</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-teal-600 rounded-lg">
                  <Image src="/calendar-icon.svg" alt="Calendar" width={24} height={24} />
                </div>
                <div>
                  <h4 className="font-semibold">All Your Favorite Matches, All in One Place!</h4>
                  <p className="text-gray-300">
                    Your personal sports calendar keeps you on top of every match that matters.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-teal-600 rounded-lg">
                  <Image src="/bell-icon.svg" alt="Notifications" width={24} height={24} />
                </div>
                <div>
                  <h4 className="font-semibold">Never Miss a Moment!</h4>
                  <p className="text-gray-300">
                    Custom alerts keep you in the loop—be the first to know about big games and key events.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-teal-600 rounded-lg">
                  <Image src="/mail-icon.svg" alt="Email" width={24} height={24} />
                </div>
                <div>
                  <h4 className="font-semibold">No Nonsense Emails!</h4>
                  <p className="text-gray-300">Get only the updates you want—no spam, just pure sports action.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-teal-600 rounded-lg">
                  <Image src="/device-icon.svg" alt="Devices" width={24} height={24} />
                </div>
                <div>
                  <h4 className="font-semibold">Seamless Access, Anytime, Anywhere!</h4>
                  <p className="text-gray-300">Sync across web and mobile for the ultimate sports experience.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
