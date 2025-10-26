import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function DMCAPolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">DMCA Policy</h1>
        <div className="space-y-4">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Reporting Copyright Infringement</h2>
            <p>
              If you believe that content available on or through our site, Sports Fixtures, infringes one or more of
              your copyrights, please send a written notice to our designated copyright agent at
              admin@sportsfixtures.net.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">2. Required Information</h2>
            <p>To be effective, your notice must include the following:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>
                A physical or electronic signature of a person authorized to act on behalf of the copyright owner;
              </li>
              <li>Identification of the copyrighted work claimed to have been infringed;</li>
              <li>
                Identification of the material that is claimed to be infringing and information reasonably sufficient to
                permit us to locate the material;
              </li>
              <li>Your contact information, including your address, telephone number, and email;</li>
              <li>
                A statement that you have a good faith belief that use of the material in the manner complained of is
                not authorized by the copyright owner, its agent, or the law;
              </li>
              <li>
                A statement that the information in the notification is accurate, and, under penalty of perjury, that
                you are authorized to act on behalf of the copyright owner.
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">3. Counter-Notification</h2>
            <p>
              If you believe your content was wrongly removed due to a mistake or misidentification, you can send a
              written counter-notice to our designated agent at admin@sportsfixtures.net.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">4. Repeat Infringers</h2>
            <p>
              It is our policy to terminate the accounts of repeat infringers when appropriate and to maintain a record
              of repeat infringer terminations.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
