"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const steps = ["Venue Details", "Owner Information", "Billing", "Review"]

export default function VenueOwnerSignup() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    venueName: "",
    venueAddress: "",
    venueType: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    billingPlan: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
    agreeTerms: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreeTerms: checked }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData)
    // Redirect to a success page or dashboard
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Venue Owner Sign Up</CardTitle>
          <CardDescription>
            Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {currentStep === 0 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="venueName">Venue Name</Label>
                  <Input
                    id="venueName"
                    name="venueName"
                    value={formData.venueName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="venueAddress">Venue Address</Label>
                  <Input
                    id="venueAddress"
                    name="venueAddress"
                    value={formData.venueAddress}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="venueType">Venue Type</Label>
                  <Select
                    name="venueType"
                    value={formData.venueType}
                    onValueChange={(value) => handleSelectChange("venueType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select venue type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">Bar</SelectItem>
                      <SelectItem value="pub">Pub</SelectItem>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="sportsClub">Sports Club</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ownerName">Owner Name</Label>
                  <Input
                    id="ownerName"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="ownerEmail">Owner Email</Label>
                  <Input
                    id="ownerEmail"
                    name="ownerEmail"
                    type="email"
                    value={formData.ownerEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="ownerPhone">Owner Phone</Label>
                  <Input
                    id="ownerPhone"
                    name="ownerPhone"
                    type="tel"
                    value={formData.ownerPhone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="billingPlan">Billing Plan</Label>
                  <Select
                    name="billingPlan"
                    value={formData.billingPlan}
                    onValueChange={(value) => handleSelectChange("billingPlan", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select billing plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly ($49/month)</SelectItem>
                      <SelectItem value="annual">Annual ($499/year)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cardExpiry">Expiry Date</Label>
                    <Input
                      id="cardExpiry"
                      name="cardExpiry"
                      placeholder="MM/YY"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardCVC">CVC</Label>
                    <Input id="cardCVC" name="cardCVC" value={formData.cardCVC} onChange={handleInputChange} required />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Review Your Information</h3>
                <p>Venue Name: {formData.venueName}</p>
                <p>Venue Address: {formData.venueAddress}</p>
                <p>Venue Type: {formData.venueType}</p>
                <p>Owner Name: {formData.ownerName}</p>
                <p>Owner Email: {formData.ownerEmail}</p>
                <p>Owner Phone: {formData.ownerPhone}</p>
                <p>Billing Plan: {formData.billingPlan}</p>
                <div className="flex items-center space-x-2">
                  <Checkbox id="agreeTerms" checked={formData.agreeTerms} onCheckedChange={handleCheckboxChange} />
                  <label htmlFor="agreeTerms" className="text-sm">
                    I agree to the terms and conditions
                  </label>
                </div>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handlePrevious}>
              Previous
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!formData.agreeTerms}>
              Submit
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
