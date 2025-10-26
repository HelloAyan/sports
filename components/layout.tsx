"use client"

import type React from "react"

import { CalendarDays, Menu, X, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { SearchBar } from "@/components/search-bar"

export function Layout({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <CalendarDays className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">Sports Fixtures</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/calendar">Calendar</Link>
              <Link href="/leagues">Leagues</Link>
              <Link href="/tv-guide">TV Guide</Link>
            </nav>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <nav className="grid gap-6 text-lg font-medium">
                <Link href="/calendar">Calendar</Link>
                <Link href="/leagues">Leagues</Link>
                <Link href="/tv-guide">TV Guide</Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {isSearchOpen ? (
                <div className="relative w-full max-w-md">
                  <SearchBar />
                  <Button
                    variant="ghost"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" className="w-9 px-0" onClick={() => setIsSearchOpen(true)}>
                  <Search className="h-6 w-6" />
                  <span className="sr-only">Toggle search</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built with data from{" "}
              <a
                href="https://www.thesportsdb.com"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                TheSportsDB
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
