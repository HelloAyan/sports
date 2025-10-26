import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function TermsOfService() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <div className="space-y-4">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Sports Fixtures, you agree to be bound by these Terms of Service. If you do not
              agree to these terms, please do not use our service.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">2. Description of Service</h2>
            <p>
              Sports Fixtures provides information about sports events, schedules, and results. This information is for
              entertainment purposes only and should not be considered as definitive or used for betting purposes.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">3. Disclaimer of Warranties</h2>
            <p>
              The information provided by Sports Fixtures is on an "as is" and "as available" basis. We make no
              representations or warranties of any kind, express or implied, as to the operation of the service or the
              information, content, materials, or products included on this site.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">4. Limitation of Liability</h2>
            <p>
              Sports Fixtures and its affiliates shall not be liable for any damages of any kind arising from the use of
              this site, including but not limited to direct, indirect, incidental, punitive, and consequential damages.
              We do not accept any claims for any liability whatsoever.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">5. User Agreement</h2>
            <p>
              By using Sports Fixtures, you fully agree to these terms and conditions. If you do not agree with any part
              of these terms, you must not use our service.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">6. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Your continued use of the service after any
              changes indicates your acceptance of the new terms.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
