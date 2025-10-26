import { Suspense } from "react"
import { LiveEvents } from "@/components/live-events"
import { TopLiveEvents } from "@/components/top-live-events"
import { PopularSports } from "@/components/popular-sports"
import { PopularCompetitions } from "@/components/popular-competitions"
import { SportsIconsGrid } from "@/components/sports-icons-grid"
import { AdPlacement } from "@/components/ad-placement"
import { MatchHighlights } from "@/components/match-highlights"
import SportsMatchDisplay from "@/components/sports-match-display"
import { UpcomingEvents } from "@/components/upcoming-events"
import { AllFixtures } from "@/components/all-fixtures"
import { FindVenues } from "@/components/find-venues"
import { HeroSearchSection } from "@/components/hero-search-section"
import { TrendingNowSection } from "@/components/trending-now-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-gold-50">
      {/* Hero Section with Search */}
      <HeroSearchSection />

      {/* Top Live Events */}
      <TopLiveEvents />

      {/* Ad Placement */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <AdPlacement id="homepage-top" />
        </div>
      </section>

      {/* Trending Now Section */}
      <TrendingNowSection />

      {/* Live Events - Grid Layout */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold sports-text-gradient mb-4">Live Sports Events - Grid Layout</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real-time updates from multiple sports in an organized grid view
            </p>
          </div>
          <Suspense fallback={<div className="text-center">Loading live events...</div>}>
            <LiveEvents layout="grid" title="Live Sports Events" />
          </Suspense>
        </div>
      </section>

      {/* Live Events - Wide Layout */}
      <section className="py-16 bg-gradient-to-br from-red-50 to-gold-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold sports-text-gradient mb-4">Featured Matches - Wide Layout</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive match information in an expanded horizontal format
            </p>
          </div>
          <Suspense fallback={<div className="text-center">Loading wide events...</div>}>
            <LiveEvents layout="wide" title="Featured Matches - Wide Layout" />
          </Suspense>
        </div>
      </section>

      {/*Best-of-breed version */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold sports-text-gradient mb-4"> Best-of-breed version</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Combined two layout
            </p>
          </div>
          <Suspense fallback={<div className="text-center">Loading single layout events...</div>}>
            <LiveEvents layout="single" title="Live Events " />
          </Suspense>
        </div>
      </section>

      {/* Live Events - Single Layout (1x2) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold sports-text-gradient mb-4">Live Events - Single Layout (1x2)</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Focused single match display with detailed statistics and live updates
            </p>
          </div>
          <Suspense fallback={<div className="text-center">Loading single layout events...</div>}>
            <LiveEvents layout="single" title="Live Events - Single Layout (1x2)" />
          </Suspense>
        </div>
      </section>

      {/* Live Events 2 - Single Layout (1x2) - Enhanced Version */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-gold-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold sports-text-gradient mb-4">Live Events 2 - Single Layout (1x2)</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Enhanced single match display with comprehensive live data, betting odds, match events, and TV channel
              information in a horizontal layout.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex justify-center">
              <SportsMatchDisplay matchIndex={0} />
            </div>

            <div className="flex justify-center">
              {/* <SportsMatchDisplay matchIndex={1} /> */}
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Real-time match data • Live betting odds • TV channel listings • Interactive match events
            </p>
          </div>
        </div>
      </section>

      {/* Ad Placement */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <AdPlacement id="homepage-middle" />
        </div>
      </section>

      {/* Animated Sport Icons */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold sports-text-gradient mb-4">Popular Sports</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover live events and fixtures across all major sports categories
            </p>
          </div>
          <SportsIconsGrid />
        </div>
      </section>

      {/* Popular Sports */}
      <section className="py-16 bg-gradient-to-br from-red-50 to-gold-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold sports-text-gradient mb-4">Trending Sports</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Most watched and followed sports events worldwide</p>
          </div>
          <Suspense fallback={<div className="text-center">Loading popular sports...</div>}>
            <PopularSports />
          </Suspense>
        </div>
      </section>

      {/* Popular Competitions */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold sports-text-gradient mb-4">Popular Competitions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Follow the biggest tournaments and leagues from around the globe
            </p>
          </div>
          <Suspense fallback={<div className="text-center">Loading popular competitions...</div>}>
            <PopularCompetitions />
          </Suspense>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-gold-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold sports-text-gradient mb-4">Upcoming Events</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Plan ahead with upcoming matches and tournaments</p>
          </div>
          <Suspense fallback={<div className="text-center">Loading upcoming events...</div>}>
            <UpcomingEvents />
          </Suspense>
        </div>
      </section>

      {/* All Fixtures */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold sports-text-gradient mb-4">All Fixtures</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Complete fixture list across all sports and competitions</p>
          </div>
          <Suspense fallback={<div className="text-center">Loading all fixtures...</div>}>
            <AllFixtures />
          </Suspense>
        </div>
      </section>

      {/* Match Highlights */}
      <section className="py-16 bg-gradient-to-br from-red-50 to-gold-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold sports-text-gradient mb-4">Match Highlights</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Catch up on the best moments from recent matches</p>
          </div>
          <Suspense fallback={<div className="text-center">Loading match highlights...</div>}>
            <MatchHighlights />
          </Suspense>
        </div>
      </section>

      {/* Find Venues */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold sports-text-gradient mb-4">Find Sports Venues</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover bars, pubs, and venues showing live sports near you
            </p>
          </div>
          <Suspense fallback={<div className="text-center">Loading venues...</div>}>
            <FindVenues />
          </Suspense>
        </div>
      </section>

      {/* Ad Placement */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <AdPlacement id="homepage-bottom" />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 sports-bg-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 animate-shine">Never Miss a Match</h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Get real-time notifications for your favorite teams and sports. Stay updated with live scores, fixtures, and
            breaking news.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-4 rounded-full font-semibold hover:bg-green-50 transition-colors shadow-lg sports-button">
              Sign Up for Alerts
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-colors">
              Download App
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-br from-green-100 to-gold-100">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold sports-text-gradient mb-4">Stay Updated</h2>
            <p className="text-gray-600 mb-8">
              Subscribe to our newsletter for the latest sports news and fixture updates
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors sports-button">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
