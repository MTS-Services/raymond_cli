import React, { memo } from 'react';

const Section = ({ id, title, children }) => (
  <section id={id} className='pt-6'>
    <h2 className='text-xl font-semibold text-ink-deep-alt mb-3'>{title}</h2>
    <div className='text-gray-700 text-base leading-7'>{children}</div>
  </section>
);

const PolicyContentSection = memo(() => (
  <section className='py-12 sm:py-16 lg:py-20'>
    <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12'>
      <article className='bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm'>
        <div className='space-y-6 text-gray-800'>
          <p className='text-base'>
            This Privacy Policy explains how Skyridge Group ("we", "us", or
            "our") collects, uses, discloses, and protects personal
            information when you visit or interact with our website and
            services. Please read this policy carefully. If you do not agree
            with our practices, please do not use our site.
          </p>

          <Section id='what-we-collect' title='1. Information We Collect'>
            <p>
              We collect information that you provide directly and information
              that is collected automatically when you use our services. This
              may include:
            </p>
            <ul className='list-disc ml-6 mt-3 space-y-1'>
              <li>Contact details (name, email, phone number)</li>
              <li>Property preferences and transaction details</li>
              <li>Communications and messages you send us</li>
              <li>Technical data (IP address, browser, device, cookies)</li>
            </ul>
          </Section>

          <Section id='how-we-use' title='2. How We Use Your Information'>
            <p>
              We use your information to provide and improve our services,
              respond to inquiries, process applications, and communicate
              important updates. Typical uses include:
            </p>
            <ul className='list-disc ml-6 mt-3 space-y-1'>
              <li>To respond to inquiries and process mortgage applications</li>
              <li>To provide property listings and tailored recommendations</li>
              <li>To maintain records and comply with legal obligations</li>
              <li>To send administrative messages and marketing where you have
                consented</li>
            </ul>
          </Section>

          <Section id='sharing' title='3. Sharing And Disclosure'>
            <p>
              We do not sell your personal information. We may share data with
              trusted third parties when necessary to provide services or when
              required by law, such as:
            </p>
            <ul className='list-disc ml-6 mt-3 space-y-1'>
              <li>Service providers who assist with transaction fulfillment</li>
              <li>Legal or regulatory authorities when required</li>
              <li>Other parties involved in a real estate transaction</li>
            </ul>
          </Section>

          <Section id='cookies' title='4. Cookies And Tracking Technologies'>
            <p>
              We use cookies and similar technologies to improve site
              performance and personalize your experience. You can manage
              cookie preferences through your browser settings. Disabling
              cookies may affect site functionality.
            </p>
          </Section>

          <Section id='security' title='5. Security'>
            <p>
              We maintain reasonable administrative, technical, and physical
              safeguards designed to protect your personal information. While
              we take security seriously, no method of transmission or
              electronic storage is completely secure.
            </p>
          </Section>

          <Section id='third-party' title='6. Third-Party Links And Services'>
            <p>
              Our website may contain links to third-party websites and
              services that are not operated by us. We are not responsible for
              the privacy practices or content of those sites. Please review
              their privacy policies before sharing information.
            </p>
          </Section>

          <Section id='rights' title='7. Your Rights And Choices'>
            <p>
              Depending on your jurisdiction, you may have rights to access,
              correct, or delete your personal data and to object to certain
              processing. To exercise these rights, please contact us using
              the details below.
            </p>
          </Section>

          <Section id='retention' title='8. Data Retention'>
            <p>
              We retain personal information only as long as necessary to
              provide our services and for legitimate business purposes, or as
              required by law.
            </p>
          </Section>

          <Section id='children' title='9. Children'>
            <p>
              Our services are not directed at children under 18. We do not
              knowingly collect personal information from children. If you
              believe a child has provided us with personal information,
              contact us and we will take steps to remove the information.
            </p>
          </Section>

          <Section id='changes' title='10. Changes To This Policy'>
            <p>
              We may update this policy periodically. When we make material
              changes, we will notify you by posting the updated policy and
              updating the "Last updated" date at the top of this page.
            </p>
          </Section>

        

          <p className='text-sm text-gray-600'>
            This Privacy Policy is provided for informational purposes and is
            not legal advice. For legal questions, consult with an attorney in
            your jurisdiction.
          </p>
        </div>
      </article>
    </div>
  </section>
));

PolicyContentSection.displayName = 'PolicyContentSection';

export default PolicyContentSection;
