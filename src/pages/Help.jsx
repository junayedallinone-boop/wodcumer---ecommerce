import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import AccordionItem from '../components/Accordion'
import { PageTransition, Reveal, ease } from '../components/Motion'
import { PageHeader } from '../components/Ui'
import { faqs, localize, shippingMethods } from '../data'
import { useStore } from '../store'

const sections = {
  faq: {
    label: 'FAQ',
    items: [
      ...faqs,
      { q: 'Do you ship internationally?', a: 'Yes — we deliver across Europe, the United States, Canada, the UK and Australia. Duties are included at checkout so there are no surprises on delivery.' },
      { q: 'Can I change or cancel my order?', a: 'You can change or cancel free of charge until your order is dispatched. Contact us with your order number and we’ll take care of it.' },
    ],
  },
  shipping: {
    label: 'Shipping',
    items: [
      { q: 'How much does delivery cost?', a: `Standard delivery is free on orders over $230 and $25 otherwise. ${shippingMethods.slice(1).map((m) => `${m.name} is $${m.price} (${m.eta}).`).join(' ')}` },
      { q: 'When will my order arrive?', a: 'Most in-stock pieces leave our workshop within 2 business days. You’ll get a tracking link by email as soon as your order ships.' },
      { q: 'What is white-glove delivery?', a: 'Two-person delivery to the room of your choice, full assembly and removal of all packaging — ideal for sofas and large tables.' },
      { q: 'Do you deliver to apartments without a lift?', a: 'Yes. Let us know at checkout in the apartment field and our team will plan the delivery accordingly.' },
    ],
  },
  returns: {
    label: 'Returns',
    items: [
      { q: 'What is the 90-day trial?', a: 'Live with your piece for up to 90 days. If it isn’t right, we’ll collect it and refund you in full — no questions asked.' },
      { q: 'How do I start a return?', a: 'Email us with your order number. We’ll book a collection at a time that suits you and send a prepaid label for smaller items.' },
      { q: 'When will I get my refund?', a: 'Refunds are issued to the original payment method within 5 business days of the item reaching our workshop.' },
      { q: 'Are any items final sale?', a: 'Made-to-order upholstery in custom fabrics can’t be returned unless faulty. All other pieces are covered by the 90-day trial.' },
    ],
  },
  care: {
    label: 'Care & warranty',
    items: [
      { q: 'How do I care for solid wood?', a: 'Dust with a soft dry cloth, wipe spills immediately and re-oil oiled finishes once or twice a year. Keep away from radiators and direct sun.' },
      { q: 'What does the warranty cover?', a: 'Every frame carries a 10-year warranty against manufacturing defects. Upholstery and cushions are covered for 2 years.' },
    ],
  },
}

export default function Help() {
  useStore() // re-render when the currency changes
  const [params, setParams] = useSearchParams()
  const key = sections[params.get('tab')] ? params.get('tab') : 'faq'
  const [open, setOpen] = useState(0)
  const items = sections[key].items

  return (
    <PageTransition>
      <PageHeader center crumbs={[{ label: 'Help centre' }]} title={<>How can we <em>help?</em></>} intro="Answers about orders, delivery, returns and caring for your furniture." />
      <section className="mx-auto w-full max-w-[926px] px-4 pb-20 md:px-10 md:pb-[110px] xl:px-0">
        <LayoutGroup>
          <Reveal className="mb-8 flex flex-wrap justify-center gap-2">
            {Object.entries(sections).map(([k, s]) => (
              <button
                key={k}
                onClick={() => {
                  setParams({ tab: k })
                  setOpen(0)
                }}
                className={`relative rounded-full px-5 py-2.5 text-[15px] font-medium transition-colors duration-300 ${key === k ? 'text-white' : 'hover:bg-ink/5'}`}
              >
                {key === k && <motion.span layoutId="help-pill" className="absolute inset-0 rounded-full bg-primary" transition={{ duration: 0.45, ease }} />}
                <span className="relative">{s.label}</span>
              </button>
            ))}
          </Reveal>
        </LayoutGroup>
        <AnimatePresence mode="wait">
          <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease }}>
            {items.map((f, i) => (
              <AccordionItem key={f.q} title={f.q} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} className="py-7" titleClassName="text-[18px] font-medium md:text-[20px]">
                <p className="max-w-[836px] pt-4 leading-[1.6] opacity-90">{localize(f.a)}</p>
              </AccordionItem>
            ))}
          </motion.div>
        </AnimatePresence>
        <Reveal className="mt-14 flex flex-col items-center gap-4 bg-sand p-8 text-center md:p-12">
          <p className="font-serif text-[28px] italic">Still have a question?</p>
          <p className="opacity-80">Our team answers every message within one business day.</p>
          <Link to="/contact" className="btn-primary">Contact us</Link>
        </Reveal>
      </section>
    </PageTransition>
  )
}
