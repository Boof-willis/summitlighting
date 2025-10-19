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
    text: "R&R Solar fixed our inverter issue in just one visit. Professional, fast, and reasonably priced. Our system is back to full production.",
    name: "Sarah M.",
    role: "Salt Lake City, UT",
  },
  {
    text: "Had a roof leak after our original installer went out of business. R&R Solar came out quickly and fixed everything properly. No more leaks!",
    name: "Mike J.",
    role: "Provo, UT",
  },
  {
    text: "Excellent service! They diagnosed our monitoring issue and had our app working again the same day. Highly recommend for any solar repairs.",
    name: "Lisa C.",
    role: "Ogden, UT",
  },
  {
    text: "Our solar system stopped producing power. R&R Solar identified the problem with our optimizer and replaced it within 48 hours. Great work!",
    name: "David R.",
    role: "Park City, UT",
  },
  {
    text: "We needed our panels removed for a roof replacement. They handled everything perfectly and coordinated with our roofer. System works better than ever!",
    name: "Jennifer K.",
    role: "Sandy, UT",
  },
  {
    text: "Fast response for our critter damage issue. They sealed everything up and installed guards to prevent future problems. Very thorough!",
    name: "Tom H.",
    role: "Draper, UT",
  },
  {
    text: "The diagnostic was detailed and transparent. They explained everything clearly and the repair cost was exactly as quoted. No surprises!",
    name: "Amanda S.",
    role: "Lehi, UT",
  },
  {
    text: "Our SolarEdge inverter was showing errors constantly. R&R Solar came out same week, diagnosed the issue, and had us back online quickly.",
    name: "Robert M.",
    role: "American Fork, UT",
  },
  {
    text: "They fixed wiring issues left by our original installer. Professional, knowledgeable, and they actually care about quality work. Highly recommended!",
    name: "Emily W.",
    role: "Orem, UT",
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
