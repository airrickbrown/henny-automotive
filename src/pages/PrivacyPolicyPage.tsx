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

export default function PrivacyPolicyPage() {
  return (
    <PageWrapper>
      <PageMeta
        title="Privacy Policy — Henny Automotive"
        description="How Henny Automotive collects, uses, and protects your personal data under Ghana's Data Protection Act 2012."
      />

      <div className="max-w-3xl mx-auto px-6 py-20 md:py-28">

        <div className="mb-12">
          <p className="font-label text-xs uppercase tracking-widest text-primary-container mb-3">Legal</p>
          <h1 className="font-headline font-black italic uppercase tracking-tighter text-4xl md:text-5xl text-white leading-none mb-4">
            Privacy Policy
          </h1>
          <p className="font-body text-sm text-gray-400">
            Last updated: January 2025 &nbsp;·&nbsp; Effective immediately
          </p>
          <p className="font-body text-sm text-gray-400 mt-3 leading-relaxed">
            This Privacy Policy explains how Henny Automotive ("we", "us", or "our") collects,
            uses, stores, and protects your personal data in accordance with the{' '}
            <strong className="text-white">Data Protection Act, 2012 (Act 843)</strong> of the
            Republic of Ghana, and applicable international best practices.
          </p>
        </div>

        <Section title="1. About Us">
          <p>
            Henny Automotive is an automotive dealership and import/export business operating
            in Ghana and the United States of America.
          </p>
          <p>
            <strong className="text-white">Ghana Office:</strong> L573 Yomo Afoko St, Agbogbe Plaza, Accra, Ghana<br />
            <strong className="text-white">US Operations:</strong> Nashville, TN, USA<br />
            <strong className="text-white">Phone:</strong> 059 320 4050<br />
            <strong className="text-white">WhatsApp:</strong> Available via our website<br />
            <strong className="text-white">Email:</strong> hello@hennyautomotive.com
          </p>
          <p>
            We are a data controller as defined under Act 843 and are responsible for the personal
            data you provide to us through this website and other communication channels.
          </p>
        </Section>

        <Section title="2. What Data We Collect">
          <p>We may collect the following categories of personal data:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-white">Contact information:</strong> Full name, email address,
              phone number, and location provided through our contact and inquiry forms.
            </li>
            <li>
              <strong className="text-white">Transaction data:</strong> Details of vehicles you
              inquire about, services requested, and correspondence history.
            </li>
            <li>
              <strong className="text-white">Newsletter data:</strong> Email address provided when
              subscribing to our mailing list.
            </li>
            <li>
              <strong className="text-white">Technical data:</strong> IP address, browser type,
              device information, and pages visited — collected automatically when you use our website.
            </li>
            <li>
              <strong className="text-white">Communication data:</strong> Records of any messages
              sent to us via WhatsApp, email, or our website contact form.
            </li>
          </ul>
          <p>
            We do not collect sensitive personal data (such as financial account details, national
            ID numbers, or biometric data) unless specifically required to complete a transaction,
            and only with your explicit consent.
          </p>
        </Section>

        <Section title="3. How We Collect Your Data">
          <p>We collect personal data through:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Our website contact and inquiry forms</li>
            <li>Newsletter subscription forms</li>
            <li>Direct communications (WhatsApp, email, phone)</li>
            <li>Cookies and similar tracking technologies on our website</li>
            <li>Referrals from third parties, where applicable</li>
          </ul>
        </Section>

        <Section title="4. How We Use Your Data">
          <p>
            We process your personal data only for the following lawful purposes, consistent
            with Act 843:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-white">Service delivery:</strong> To respond to inquiries,
              provide vehicle sourcing quotes, arrange shipping, and deliver services you request.
            </li>
            <li>
              <strong className="text-white">Marketing communications:</strong> To send newsletters
              and promotional content to subscribers who have explicitly opted in. You can unsubscribe
              at any time.
            </li>
            <li>
              <strong className="text-white">Business operations:</strong> To manage our customer
              relationships, maintain records, and improve our services.
            </li>
            <li>
              <strong className="text-white">Legal compliance:</strong> To comply with applicable
              laws and regulations in Ghana and any other jurisdictions we operate in.
            </li>
            <li>
              <strong className="text-white">Website improvement:</strong> To analyse usage patterns
              and improve the functionality of our website.
            </li>
          </ul>
          <p>
            We will not sell, rent, or trade your personal data to any third party for their
            independent marketing purposes.
          </p>
        </Section>

        <Section title="5. Legal Basis for Processing">
          <p>
            Under Act 843, we process your data on the following legal bases:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-white">Consent:</strong> For newsletter subscriptions and
              direct marketing. You may withdraw consent at any time.
            </li>
            <li>
              <strong className="text-white">Contractual necessity:</strong> Where processing is
              required to fulfil a contract with you (e.g., vehicle purchase or import arrangement).
            </li>
            <li>
              <strong className="text-white">Legitimate interests:</strong> For responding to
              inquiries, improving our services, and managing business communications, provided
              these interests are not overridden by your rights.
            </li>
            <li>
              <strong className="text-white">Legal obligation:</strong> Where required to comply
              with applicable law.
            </li>
          </ul>
        </Section>

        <Section title="6. Data Storage and Security">
          <p>
            Your data is stored securely using Supabase, a cloud database platform with
            enterprise-grade security including encrypted storage (AES-256) and secure
            data transmission (TLS/SSL). Our servers comply with international data security
            standards.
          </p>
          <p>
            We have implemented appropriate technical and organisational measures to protect
            your personal data against unauthorised access, loss, destruction, or disclosure,
            including:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Password-protected admin access with multi-step verification</li>
            <li>Encrypted database storage</li>
            <li>Access controls limiting data access to authorised personnel only</li>
            <li>Regular security reviews</li>
          </ul>
          <p>
            We retain personal data only for as long as necessary to fulfil the purposes
            outlined in this policy, or as required by law. Newsletter subscriber data is
            retained until you unsubscribe. Inquiry data is retained for up to 3 years
            for business record-keeping purposes.
          </p>
        </Section>

        <Section title="7. Sharing Your Data">
          <p>
            We may share your data with trusted third-party service providers who assist us
            in operating our business, strictly under confidentiality obligations:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-white">Email service providers</strong> (Resend) — for
              delivering newsletters and transactional emails.
            </li>
            <li>
              <strong className="text-white">Cloud infrastructure providers</strong> (Supabase) —
              for database hosting and authentication.
            </li>
            <li>
              <strong className="text-white">Shipping and logistics partners</strong> — where
              necessary to complete vehicle import/export transactions.
            </li>
          </ul>
          <p>
            We may also disclose your data if required by law, court order, or governmental
            authority in Ghana or any applicable jurisdiction.
          </p>
        </Section>

        <Section title="8. Your Rights Under Act 843">
          <p>
            Under Ghana's Data Protection Act 2012 (Act 843), you have the following rights:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-white">Right of access:</strong> Request a copy of the
              personal data we hold about you.
            </li>
            <li>
              <strong className="text-white">Right to rectification:</strong> Request correction
              of inaccurate or incomplete data.
            </li>
            <li>
              <strong className="text-white">Right to erasure:</strong> Request deletion of your
              personal data where there is no legitimate reason for us to continue processing it.
            </li>
            <li>
              <strong className="text-white">Right to object:</strong> Object to processing based
              on legitimate interests or for direct marketing purposes.
            </li>
            <li>
              <strong className="text-white">Right to withdraw consent:</strong> Where processing
              is based on consent, you may withdraw it at any time without affecting the lawfulness
              of prior processing.
            </li>
            <li>
              <strong className="text-white">Right to lodge a complaint:</strong> You have the right
              to lodge a complaint with the{' '}
              <strong className="text-white">Data Protection Commission of Ghana</strong> if you
              believe your data has been processed unlawfully.
            </li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{' '}
            <strong className="text-white">hello@hennyautomotive.com</strong> or call{' '}
            <strong className="text-white">059 320 4050</strong>. We will respond within 30 days.
          </p>
        </Section>

        <Section title="9. Cookies">
          <p>
            Our website may use cookies and similar tracking technologies to enhance your
            browsing experience and analyse site traffic. By continuing to use our website,
            you consent to the use of cookies in accordance with this policy.
          </p>
          <p>
            You can control cookie settings through your browser. Disabling cookies may
            affect the functionality of certain parts of our website.
          </p>
        </Section>

        <Section title="10. Third-Party Links">
          <p>
            Our website may contain links to third-party websites (e.g., WhatsApp, Snapchat).
            We are not responsible for the privacy practices of those sites and encourage you
            to review their respective privacy policies.
          </p>
        </Section>

        <Section title="11. Children's Privacy">
          <p>
            Our services are not directed at individuals under the age of 18. We do not
            knowingly collect personal data from minors. If you believe we have inadvertently
            collected data from a minor, please contact us immediately for deletion.
          </p>
        </Section>

        <Section title="12. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our
            practices or applicable laws. The updated policy will be posted on this page
            with the revised effective date. We encourage you to review this page periodically.
          </p>
        </Section>

        <Section title="13. Contact Us">
          <p>
            For any questions, requests, or concerns regarding this Privacy Policy or how
            we handle your data, please contact:
          </p>
          <div className="bg-surface-container border border-white/5 p-5 mt-2">
            <p className="text-white font-bold mb-1">Henny Automotive</p>
            <p>L573 Yomo Afoko St, Agbogbe Plaza, Accra, Ghana</p>
            <p>Phone: 059 320 4050</p>
            <p>Email: hello@hennyautomotive.com</p>
            <p className="mt-2">Data Protection Commission of Ghana: <span className="text-white">www.dataprotection.org.gh</span></p>
          </div>
        </Section>

      </div>
    </PageWrapper>
  )
}
