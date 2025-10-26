"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function BarOwnerSignup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    barName: "",
    address: "",
    openingHours: {
      monday: { open: "09:00", close: "23:00" },
      tuesday: { open: "09:00", close: "23:00" },
      wednesday: { open: "09:00", close: "23:00" },
      thursday: { open: "09:00", close: "23:00" },
      friday: { open: "09:00", close: "00:00" },
      saturday: { open: "09:00", close: "00:00" },
      sunday: { open: "09:00", close: "23:00" },
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch("/api/bar-owners/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
    const data = await response.json()
    if (data.success) {
      // Handle successful signup
      console.log("Signup successful", data.barOwner)
    } else {
      // Handle signup error
      console.error("Signup failed")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
      </div>
      <div>
        <Label htmlFor="barName">Bar Name</Label>
        <Input id="barName" name="barName" value={formData.barName} onChange={handleInputChange} required />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
      </div>
      {/* Add opening hours inputs here */}
      <Button type="submit">Sign Up</Button>
    </form>
  )
}
