import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LocationPicker } from "@/components/location-picker"
import { TimezonePicker } from "@/components/timezone-picker"
import { MegaMenu } from "@/components/mega-menu"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="logo-container">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-IYgOOJbRYgAXc5V1WcNZ5EM7dBiJIb.png"
                alt="Sports Fixtures Logo"
                width={150}
                height={40}
                className="object-contain"
              />
            </div>
          </Link>
          <LocationPicker />
        </div>

        {/* Main Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <MegaMenu />
          <Link href="/leagues" className="text-sm font-medium hover:text-sports-primary transition-colors">
            Leagues
          </Link>
          <Link href="/teams" className="text-sm font-medium hover:text-sports-primary transition-colors">
            Teams
          </Link>
          <Link href="/tv-guide" className="text-sm font-medium hover:text-sports-primary transition-colors">
            TV Guide
          </Link>
          <Link href="/bars-pubs" className="text-sm font-medium hover:text-sports-primary transition-colors">
            Bars & Pubs
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <TimezonePicker />
          <Button variant="outline" asChild>
            <Link href="/venue-owners/signup">Venue Owners</Link>
          </Button>
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/all-fixtures" className="text-sm font-medium hover:text-sports-primary transition-colors">
              All Fixtures
            </Link>
            <Link href="/news" className="text-sm font-medium hover:text-sports-primary transition-colors">
              News
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-sports-primary transition-colors">
              Categories
            </Link>
            <Link href="/shop" className="text-sm font-medium hover:text-sports-primary transition-colors">
              Shop
            </Link>
            <Link href="/read" className="text-sm font-medium hover:text-sports-primary transition-colors">
              Read
            </Link>
            <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700 text-white">
              Login
            </Button>
            <Link href="/about-us" className="text-sm font-medium hover:text-sports-primary transition-colors">
              About Us
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
