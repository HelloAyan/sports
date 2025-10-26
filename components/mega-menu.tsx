"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const SPORTS_CATEGORIES = [
  {
    name: "Ball Sports",
    items: [
      { name: "Soccer", href: "/sports/soccer", icon: "⚽" },
      { name: "Basketball", href: "/sports/basketball", icon: "🏀" },
      { name: "American Football", href: "/sports/american_football", icon: "🏈" },
      { name: "Baseball", href: "/sports/baseball", icon: "⚾" },
      { name: "Cricket", href: "/sports/cricket", icon: "🏏" },
      { name: "Rugby", href: "/sports/rugby", icon: "🏉" },
      { name: "Volleyball", href: "/sports/volleyball", icon: "🏐" },
      { name: "Tennis", href: "/sports/tennis", icon: "🎾" },
      { name: "Table Tennis", href: "/sports/table_tennis", icon: "🏓" },
    ],
  },
  {
    name: "Racing Sports",
    items: [
      { name: "Formula 1", href: "/sports/formula_1", icon: "🏎️" },
      { name: "MotoGP", href: "/sports/motogp", icon: "🏍️" },
      { name: "NASCAR", href: "/sports/nascar", icon: "🏁" },
      { name: "Cycling", href: "/sports/cycling", icon: "🚴" },
      { name: "Horse Racing", href: "/sports/horse_racing", icon: "🏇" },
    ],
  },
  {
    name: "Combat Sports",
    items: [
      { name: "Boxing", href: "/sports/boxing", icon: "🥊" },
      { name: "MMA", href: "/sports/mma", icon: "🥋" },
      { name: "Wrestling", href: "/sports/wrestling", icon: "🤼" },
    ],
  },
  {
    name: "Winter Sports",
    items: [
      { name: "Ice Hockey", href: "/sports/ice_hockey", icon: "🏒" },
      { name: "Skiing", href: "/sports/skiing", icon: "⛷️" },
      { name: "Snowboarding", href: "/sports/snowboarding", icon: "🏂" },
      { name: "Figure Skating", href: "/sports/figure_skating", icon: "⛸️" },
    ],
  },
  {
    name: "Other Sports",
    items: [
      { name: "Golf", href: "/sports/golf", icon: "⛳" },
      { name: "Swimming", href: "/sports/swimming", icon: "🏊" },
      { name: "Athletics", href: "/sports/athletics", icon: "🏃" },
      { name: "Gymnastics", href: "/sports/gymnastics", icon: "🤸" },
      { name: "Darts", href: "/sports/darts", icon: "🎯" },
      { name: "Snooker", href: "/sports/snooker", icon: "🎱" },
    ],
  },
]

export function MegaMenu() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  return (
    <div className="relative">
      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-6">
        <div className="relative group">
          <Button variant="ghost" className="flex items-center gap-1 text-sm font-medium hover:text-sports-primary">
            Sports <ChevronDown className="h-4 w-4" />
          </Button>
          <div className="absolute left-0 top-full z-50 hidden group-hover:flex bg-white shadow-lg rounded-lg p-6 w-[800px] border">
            <div className="w-1/4 border-r pr-4">
              {SPORTS_CATEGORIES.map((category) => (
                <div
                  key={category.name}
                  className={`py-2 px-3 cursor-pointer rounded-md mb-1 ${
                    activeCategory === category.name ? "bg-muted" : "hover:bg-muted"
                  }`}
                  onMouseEnter={() => setActiveCategory(category.name)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category.name}</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
            <div className="w-3/4 pl-6">
              <div className="grid grid-cols-3 gap-4">
                {SPORTS_CATEGORIES.find((cat) => cat.name === (activeCategory || SPORTS_CATEGORIES[0].name))?.items.map(
                  (item) => (
                    <Link key={item.name} href={item.href} className="flex items-center p-2 rounded-md hover:bg-muted">
                      <span className="text-xl mr-2">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col gap-6 py-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Menu</h2>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </Button>
                </SheetTrigger>
              </div>

              <div className="space-y-4">
                <MobileAccordion title="Sports" items={SPORTS_CATEGORIES} />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

function MobileAccordion({ title, items }: { title: string; items: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  return (
    <div>
      <button className="flex w-full items-center justify-between py-2" onClick={() => setIsOpen(!isOpen)}>
        <span className="font-medium">{title}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="ml-4 mt-2 space-y-2">
          {items.map((category) => (
            <div key={category.name} className="mb-2">
              <button
                className="flex w-full items-center justify-between py-1"
                onClick={() => setOpenCategory(openCategory === category.name ? null : category.name)}
              >
                <span>{category.name}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${openCategory === category.name ? "rotate-180" : ""}`}
                />
              </button>

              {openCategory === category.name && (
                <div className="ml-4 mt-1 space-y-1">
                  {category.items.map((item: any) => (
                    <Link key={item.name} href={item.href} className="flex items-center py-1 hover:text-primary">
                      <span className="mr-2">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
