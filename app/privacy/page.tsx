import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="space-y-4">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Information Collection</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, subscribe to our
              newsletter, or contact us for support.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">2. Use of Information</h2>
            <p>
              We use the information we collect to operate, maintain, and improve our services, to communicate with you,
              and to personalize your experience.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">3. Information Sharing</h2>
            <p>
              We do not share personal information with companies, organizations, or individuals outside of Sports
              Fixtures except in the following cases: with your consent, for legal reasons, or to protect rights,
              property, or safety.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
            <p>
              We work hard to protect Sports Fixtures and our users from unauthorized access to or unauthorized
              alteration, disclosure, or destruction of information we hold.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">5. Cookies</h2>
            <p>
              We use cookies and similar technologies to collect and analyze information about your use of our services
              and to personalize your experience.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">6. Changes to This Policy</h2>
            <p>
              We may change this privacy policy from time to time. We will post any privacy policy changes on this page
              and, if the changes are significant, we will provide a more prominent notice.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">7. Contact Us</h2>
            <p>If you have any questions about this privacy policy, please contact us at: admin@sportsfixtures.net</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
