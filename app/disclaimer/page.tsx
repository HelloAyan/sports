import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function Disclaimer() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>
        <div className="space-y-4">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Information Accuracy</h2>
            <p>
              The information provided on Sports Fixtures is for general informational purposes only. While we strive to
              keep the information up to date and correct, we make no representations or warranties of any kind, express
              or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the
              website or the information, products, services, or related graphics contained on the website for any
              purpose.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">2. No Definitive Information</h2>
            <p>
              Sports Fixtures offers best-guess information and in no way provides definitive data. We do not guarantee
              the accuracy of any information presented on this site.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">3. No Liability</h2>
            <p>
              In no event will we be liable for any loss or damage including without limitation, indirect or
              consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits
              arising out of, or in connection with, the use of this website.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">4. External Links</h2>
            <p>
              Through this website you are able to link to other websites which are not under the control of Sports
              Fixtures. We have no control over the nature, content and availability of those sites. The inclusion of
              any links does not necessarily imply a recommendation or endorse the views expressed within them.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">5. Website Availability</h2>
            <p>
              Every effort is made to keep the website up and running smoothly. However, Sports Fixtures takes no
              responsibility for, and will not be liable for, the website being temporarily unavailable due to technical
              issues beyond our control.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">6. Use at Your Own Risk</h2>
            <p>
              Any reliance you place on information provided by Sports Fixtures is strictly at your own risk. We will
              not be liable for any losses or damages in connection with the use of our website or its content.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
