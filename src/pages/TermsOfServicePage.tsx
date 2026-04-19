import PageWrapper from '../components/layout/PageWrapper'
import PageMeta from '../components/seo/PageMeta'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-headline font-bold uppercase tracking-tight text-white text-xl mb-4 pb-3 border-b border-white/10">
        {title}
      </h2>
      <div className="space-y-4 font-body text-sm text-gray-400 leading-relaxed">
        {children}
      </div>
    </section>
  )
}

export default function TermsOfServicePage() {
  return (
    <PageWrapper>
      <PageMeta
        title="Terms of Service — Henny Automotive"
        description="Terms and conditions governing the use of Henny Automotive's services, governed by the laws of the Republic of Ghana."
      />

      <div className="max-w-3xl mx-auto px-6 py-20 md:py-28">

        <div className="mb-12">
          <p className="font-label text-xs uppercase tracking-widest text-primary-container mb-3">Legal</p>
          <h1 className="font-headline font-black italic uppercase tracking-tighter text-4xl md:text-5xl text-white leading-none mb-4">
            Terms of Service
          </h1>
          <p className="font-body text-sm text-gray-400">
            Last updated: January 2025 &nbsp;·&nbsp; Effective immediately
          </p>
          <p className="font-body text-sm text-gray-400 mt-3 leading-relaxed">
            Please read these Terms of Service ("Terms") carefully before using the Henny
            Automotive website or engaging our services. By accessing our website or
            requesting our services, you agree to be bound by these Terms.
          </p>
          <div className="mt-4 bg-primary-container/10 border border-primary-container/20 px-4 py-3">
            <p className="font-label text-xs text-primary-container uppercase tracking-wider">
              These Terms are governed by and construed in accordance with the laws of the
              Republic of Ghana.
            </p>
          </div>
        </div>

        <Section title="1. About Henny Automotive">
          <p>
            Henny Automotive ("the Company", "we", "us", or "our") is an automotive dealership
            and vehicle import/export business operating in Ghana and the United States.
          </p>
          <p>
            <strong className="text-white">Registered Office:</strong> L573 Yomo Afoko St,
            Agbogbe Plaza, Accra, Ghana<br />
            <strong className="text-white">US Operations:</strong> Nashville, TN, USA<br />
            <strong className="text-white">Phone:</strong> 059 320 4050<br />
            <strong className="text-white">Email:</strong> hello@hennyautomotive.com
          </p>
        </Section>

        <Section title="2. Services">
          <p>Henny Automotive provides the following services:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Vehicle sales — new and pre-owned vehicles sourced from the USA</li>
            <li>Vehicle import and shipping to Ghana</li>
            <li>Car parts and spare parts supply</li>
            <li>Vehicle diagnostics and inspection</li>
            <li>Tuning and performance modifications</li>
            <li>Collision repair and body work</li>
          </ul>
          <p>
            We reserve the right to modify, suspend, or discontinue any service at any time
            with reasonable notice to affected customers.
          </p>
        </Section>

        <Section title="3. Use of This Website">
          <p>
            By using this website, you confirm that you are at least 18 years of age and
            have the legal capacity to enter into binding agreements. You agree to use
            this website only for lawful purposes and in a manner that does not infringe
            the rights of others.
          </p>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use the website for any fraudulent, unlawful, or harmful purpose</li>
            <li>Attempt to gain unauthorised access to any part of the website</li>
            <li>Transmit any harmful, offensive, or unsolicited content</li>
            <li>Copy, reproduce, or distribute our content without written permission</li>
            <li>Use automated tools to scrape or extract data from the website</li>
          </ul>
        </Section>

        <Section title="4. Vehicle Purchases and Orders">
          <p>
            All vehicle purchases are subject to availability and final confirmation by
            Henny Automotive. Listing a vehicle on our website does not constitute an offer
            to sell and prices are subject to change without notice.
          </p>
          <p>
            <strong className="text-white">Deposits:</strong> A non-refundable deposit may be
            required to secure a vehicle or initiate an import order. The deposit amount will
            be communicated and agreed upon in writing before payment is made.
          </p>
          <p>
            <strong className="text-white">Payment:</strong> Full payment is required before
            delivery of any vehicle or parts unless otherwise agreed in a separate written
            agreement. We accept payment via bank transfer and other methods communicated
            at the time of purchase.
          </p>
          <p>
            <strong className="text-white">Pricing:</strong> Prices displayed on this website
            are indicative and may exclude applicable taxes, duties, shipping costs, and
            clearing fees. Final pricing will be confirmed in a formal quotation.
          </p>
        </Section>

        <Section title="5. Vehicle Import and Shipping">
          <p>
            Import timelines are estimates and may be affected by factors outside our
            control including shipping delays, port congestion, customs processing, and
            third-party logistics. We will communicate any significant delays promptly.
          </p>
          <p>
            <strong className="text-white">Customs and Duties:</strong> Import duties,
            ECOWAS levy, VAT, and other applicable Ghana Revenue Authority charges are
            the responsibility of the buyer unless explicitly included in the agreed price.
          </p>
          <p>
            <strong className="text-white">Risk of Loss:</strong> Risk of loss or damage
            passes to the buyer at the point of delivery unless otherwise agreed. We
            strongly recommend customers obtain vehicle insurance prior to collection.
          </p>
        </Section>

        <Section title="6. Car Parts">
          <p>
            Parts are sold as described. Where a part is listed as "used" or "refurbished",
            this will be clearly stated. We do not accept returns on electrical components
            or parts that have been installed and subsequently found to be incompatible,
            unless the incompatibility was caused by our error.
          </p>
          <p>
            Parts availability is subject to stock. Where a part is unavailable after
            payment, you will be offered a full refund or a suitable alternative.
          </p>
        </Section>

        <Section title="7. Warranties">
          <p>
            Where a warranty is provided on a vehicle or part, the terms of that warranty
            will be set out in a separate written document provided at the time of sale.
          </p>
          <p>
            Vehicles imported from the USA are sold on an "as inspected" basis unless a
            specific warranty is agreed in writing. We recommend buyers commission an
            independent pre-purchase inspection before finalising any transaction.
          </p>
          <p>
            We make no warranty, express or implied, regarding vehicles or parts beyond
            what is expressly stated in writing.
          </p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>
            To the fullest extent permitted by Ghana law, Henny Automotive shall not be
            liable for:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Indirect, incidental, or consequential loss or damage</li>
            <li>Loss of profit, revenue, or business opportunity</li>
            <li>Delays caused by shipping companies, port authorities, or customs agencies</li>
            <li>Damage to vehicles during transit where caused by third-party carriers</li>
            <li>Inaccuracies in vehicle descriptions provided by overseas sellers or auction platforms</li>
          </ul>
          <p>
            Our total liability for any claim shall not exceed the amount actually paid by
            the customer for the specific vehicle or service giving rise to the claim.
          </p>
        </Section>

        <Section title="9. Cancellations and Refunds">
          <p>
            <strong className="text-white">Customer-initiated cancellations:</strong> If you
            cancel an order after an import has been initiated, deposits paid are
            non-refundable. Any additional costs incurred (shipping, auction fees, agent fees)
            will be charged to the customer.
          </p>
          <p>
            <strong className="text-white">Company-initiated cancellations:</strong> If we are
            unable to fulfil an order due to circumstances within our control, you will receive
            a full refund of all amounts paid within 14 business days.
          </p>
          <p>
            Refunds are processed via the original payment method where possible.
          </p>
        </Section>

        <Section title="10. Newsletter and Marketing Communications">
          <p>
            By subscribing to our newsletter, you consent to receiving marketing emails from
            Henny Automotive. You may unsubscribe at any time by clicking the unsubscribe link
            in any email or contacting us directly.
          </p>
          <p>
            We handle subscriber data in accordance with our{' '}
            <a href="/privacy-policy" className="text-primary-container hover:text-white transition-colors">
              Privacy Policy
            </a>
            {' '}and Ghana's Data Protection Act 2012 (Act 843).
          </p>
        </Section>

        <Section title="11. Intellectual Property">
          <p>
            All content on this website — including text, images, logos, design elements,
            and vehicle listings — is the property of Henny Automotive or its content
            suppliers and is protected by applicable copyright and intellectual property laws.
          </p>
          <p>
            You may not reproduce, distribute, or create derivative works from our content
            without express written permission.
          </p>
        </Section>

        <Section title="12. Dispute Resolution">
          <p>
            In the event of a dispute, both parties agree to attempt to resolve the matter
            amicably through direct negotiation within 30 days of written notice of the dispute.
          </p>
          <p>
            If a resolution cannot be reached, the dispute shall be referred to mediation
            in accordance with the Alternative Dispute Resolution Act, 2010 (Act 798) of Ghana.
          </p>
          <p>
            If mediation fails, disputes shall be submitted to the exclusive jurisdiction of
            the courts of the Republic of Ghana.
          </p>
        </Section>

        <Section title="13. Governing Law">
          <p>
            These Terms are governed by and construed in accordance with the laws of the
            Republic of Ghana. Any legal proceedings arising from or related to these Terms
            shall be brought in the courts of Ghana.
          </p>
        </Section>

        <Section title="14. Changes to These Terms">
          <p>
            We reserve the right to update or modify these Terms at any time. Updated Terms
            will be posted on this page with the revised effective date. Continued use of
            our website or services after changes are posted constitutes acceptance of the
            revised Terms.
          </p>
          <p>
            For material changes, we will endeavour to provide reasonable notice via email
            (where we hold your contact details) or a prominent notice on the website.
          </p>
        </Section>

        <Section title="15. Contact">
          <p>
            For any questions or concerns regarding these Terms, please contact:
          </p>
          <div className="bg-surface-container border border-white/5 p-5 mt-2">
            <p className="text-white font-bold mb-1">Henny Automotive</p>
            <p>L573 Yomo Afoko St, Agbogbe Plaza, Accra, Ghana</p>
            <p>Phone: 059 320 4050</p>
            <p>Email: hello@hennyautomotive.com</p>
          </div>
        </Section>

      </div>
    </PageWrapper>
  )
}
