import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="bg-gray-100 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-2">About Us</h3>
            <p className="text-sm">Sports Fixtures is your go-to source for all sports schedules and results.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Quick Links</h3>
            <ul className="text-sm space-y-1">
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms">Terms of Service</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Follow Us</h3>
            <div className="flex space-x-4">{/* Add social media icons/links here */}</div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">© 2023 Sports Fixtures. All rights reserved.</div>
      </div>
    </footer>
  )
}
