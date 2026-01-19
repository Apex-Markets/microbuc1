import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Paid off $8,200 in credit cards",
    quote: "I didn't even notice the round-ups happening. But I definitely noticed when my debt was gone 18 months early.",
    avatar: "SM",
  },
  {
    name: "Marcus T.",
    role: "Student loan warrior",
    quote: "As a student, every cent counts. Micropay found money I didn't know I had and put it toward my loans.",
    avatar: "MT",
  },
  {
    name: "Jessica & Tom",
    role: "Debt-free homeowners",
    quote: "We used Micropay together. Combined round-ups knocked out our car loan in record time. Now saving for a house!",
    avatar: "JT",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-24 lg:py-32 relative">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-primary font-semibold mb-4">Success stories</p>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Real people.
            <span className="gradient-text"> Real freedom.</span>
          </h2>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="glass-card p-8 h-full hover-lift">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-lg mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
