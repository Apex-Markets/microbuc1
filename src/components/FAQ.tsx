import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does Micropay round up my purchases?",
    answer:
      "Every time you make a purchase, Micropay automatically rounds up to the nearest dollar. For example, a $4.67 coffee becomes $5.00, and the $0.33 difference is set aside to pay down your debt. It all happens automatically once you connect your cards.",
  },
  {
    question: "Is my financial data secure?",
    answer:
      "Absolutely. We use 256-bit bank-level encryption and never store your banking credentials. We're PCI DSS compliant and use read-only access to your transaction data. Your security is our top priority.",
  },
  {
    question: "Which banks and cards are supported?",
    answer:
      "Micropay works with over 10,000 financial institutions in the US, including all major banks, credit unions, and card issuers. If you can use it to make purchases, chances are we support it.",
  },
  {
    question: "Can I pause or adjust the round-ups?",
    answer:
      "Yes! You have complete control. Pause round-ups anytime with one tap, set a daily/weekly maximum, or even boost your round-ups by multiplying them (2x, 3x, 5x). It's your money, your rules.",
  },
  {
    question: "How much does Micropay cost?",
    answer:
      "Micropay is free to start with our Basic plan. Our Premium plan at $3.99/month includes advanced features like round-up multipliers, priority debt targeting, and detailed analytics. No hidden fees, ever.",
  },
  {
    question: "What types of debt can I pay off?",
    answer:
      "Micropay works with credit cards, student loans, personal loans, car loans, and more. You can connect multiple debts and choose which ones to prioritize, or let our smart algorithm optimize payments for you.",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="py-24 lg:py-32 relative scroll-mt-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-primary font-semibold mb-4">FAQ</p>
<h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
  Got questions?
  <span className="gradient-text"> We've got answers.</span>
</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about crushing your debt with Micropay.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card px-6 border-none"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6 text-lg font-semibold text-white">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-base leading-relaxed text-white">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};