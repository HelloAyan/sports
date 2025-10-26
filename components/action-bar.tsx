import { Plane, ShoppingCart, MessageCircle, Tv, BookOpen, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ActionBarProps {
  fixtureId: string
  className?: string
}

export function ActionBar({ fixtureId, className }: ActionBarProps) {
  return (
    <div className={`flex items-center border-t ${className}`}>
      <Button variant="default" className="rounded-none bg-[#1e2c66] hover:bg-[#1e2c66]/90 text-white px-6 h-12">
        BUY TICKETS
      </Button>

      <Button variant="ghost" className="rounded-none h-12">
        <Plane className="h-4 w-4 mr-2" />
        PLAN A TRIP
      </Button>

      <Button variant="ghost" className="rounded-none h-12">
        <ShoppingCart className="h-4 w-4 mr-2" />
        SHOP
      </Button>

      <Button variant="ghost" className="rounded-none h-12">
        <MessageCircle className="h-4 w-4 mr-2" />
        ENGAGE
      </Button>

      <Button variant="ghost" className="rounded-none h-12">
        <Tv className="h-4 w-4 mr-2" />
        WATCH ONLINE / TV
      </Button>

      <Button variant="ghost" className="rounded-none h-12">
        <BookOpen className="h-4 w-4 mr-2" />
        READ, LISTEN & MORE
      </Button>

      <Link href={`/fixture/${fixtureId}`} className="ml-auto">
        <Button variant="default" size="icon" className="rounded-none bg-[#38E1B9] hover:bg-[#38E1B9]/90 h-12 w-12">
          <ArrowRight className="h-5 w-5" />
        </Button>
      </Link>
    </div>
  )
}
