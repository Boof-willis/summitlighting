"use client";
import React from "react";
import { motion } from "motion/react";

interface Testimonial {
  text: string;
  name: string;
  role: string;
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, name, role }, i) => {
                const initials = name.split(' ').map(n => n[0]).join('');
                return (
                  <div className="p-10 rounded-3xl border shadow-lg shadow-primary/10 max-w-xs w-full bg-white" key={i}>
                    <div className="text-gray-600 font-heading leading-relaxed">{text}</div>
                    <div className="flex items-center gap-2 mt-5">
                      <div className="h-10 w-10 rounded-full bg-[#498dcb] flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold font-heading text-sm">{initials}</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="font-medium tracking-tight leading-5 font-heading text-gray-900">{name}</div>
                        <div className="leading-5 opacity-60 tracking-tight font-heading text-gray-600">{role}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

const testimonials = [
  {
    text: "Love the lights and the pricing! Summit made our home look absolutely magical this year. Best decision we made was hiring professionals instead of doing it ourselves.",
    name: "Sarah M.",
    role: "Lehi, UT",
  },
  {
    text: "Holiday lights were installed and look awesome! The team was professional, fast, and the lights are beautiful. Plus, no storage in our garage anymore!",
    name: "John D.",
    role: "Orem, UT",
  },
  {
    text: "These guys are awesome! From the quote to installation to takedown, everything was seamless. Our neighbors are asking who did our lights!",
    name: "Jennifer L.",
    role: "American Fork, UT",
  },
  {
    text: "Summit Lighting made the holidays so much easier. They handled everything and our house looked amazing all season long. Will definitely use them again next year!",
    name: "David R.",
    role: "Highland, UT",
  },
  {
    text: "We've tried doing it ourselves for years. Summit Lighting was worth every penny. Professional installation, beautiful design, and we didn't have to climb any ladders!",
    name: "Jennifer K.",
    role: "Pleasant Grove, UT",
  },
  {
    text: "Fast, friendly, and the lights looked incredible. They came back to fix one bulb that went out and stored everything for us after the season. Great service!",
    name: "Tom H.",
    role: "Provo, UT",
  },
  {
    text: "The quote was transparent and accurate. No hidden fees, lights looked exactly as they showed us, and the team was professional from start to finish.",
    name: "Amanda S.",
    role: "Lindon, UT",
  },
  {
    text: "Our house was the talk of the neighborhood! Summit Lighting designed a custom display that was absolutely stunning. Can't wait for next year!",
    name: "Robert M.",
    role: "Spanish Fork, UT",
  },
  {
    text: "Professional, reliable, and the lights were beautiful. They maintained them all season and took them down in spring. This is the way to do Christmas lights!",
    name: "Emily W.",
    role: "Saratoga Springs, UT",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export default function Testimonials() {
  return (
    <section className="bg-gray-50 py-20 relative">
      <div className="container z-10 mx-auto max-w-[1200px] px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[700px] mx-auto"
        >
          <h2 className="text-[36px] sm:text-[40px] lg:text-[52px] font-medium font-heading mb-6 text-gray-800 text-center">
            What Our Customers Say
          </h2>
          <p className="text-center text-lg text-gray-600 font-heading">
            Don't just take our word for it. Hear from satisfied homeowners across Utah.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-16 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
}
