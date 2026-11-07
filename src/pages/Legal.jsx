import { PageTransition, Reveal } from '../components/Motion'
import { PageHeader } from '../components/Ui'

// Placeholder legal copy — replace with text reviewed by your legal advisor before launch.
const docs = {
  privacy: {
    title: <>Privacy <em>Policy</em></>,
    updated: 'November 2026',
    sections: [
      ['What we collect', 'When you place an order or create an account we collect your name, email, delivery address and phone number. Payment details are handled by our payment provider and never stored by us.'],
      ['How we use it', 'We use your information to process and deliver orders, provide customer support and — only if you opt in — send news and offers.'],
      ['Cookies', 'We use essential cookies to keep your cart and session working, and optional analytics cookies that you can decline at any time.'],
      ['Your rights', 'You can request a copy of your data, ask us to correct it or delete it by emailing Support@wodcumer.com.'],
    ],
  },
  terms: {
    title: <>Terms &amp; <em>Conditions</em></>,
    updated: 'November 2026',
    sections: [
      ['Orders', 'All orders are subject to availability and confirmation of the order price. We’ll email you to confirm once your order is accepted.'],
      ['Prices & payment', 'Prices are set in USD and shown in the currency of the region you select, including applicable taxes. Payment is taken when your order is placed.'],
      ['Delivery', 'Delivery times are estimates. We’ll keep you updated by email if anything changes.'],
      ['Returns', 'You can return items within 90 days under our worry-free trial, as described in our Help centre.'],
      ['Warranty', 'Frames carry a 10-year warranty against manufacturing defects; upholstery is covered for 2 years.'],
    ],
  },
}

export default function Legal({ doc }) {
  const d = docs[doc]
  return (
    <PageTransition>
      <PageHeader crumbs={[{ label: doc === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions' }]} title={d.title} intro={`Last updated ${d.updated}`} />
      <article className="container-x pb-20 md:pb-[110px]">
        <div className="max-w-[760px]">
          {d.sections.map(([h, p], i) => (
            <Reveal key={h} delay={i * 0.04} className="border-t border-ink/10 py-8">
              <h2 className="mb-3 font-serif text-[26px] italic">{h}</h2>
              <p className="leading-[1.7] opacity-85">{p}</p>
            </Reveal>
          ))}
        </div>
      </article>
    </PageTransition>
  )
}
