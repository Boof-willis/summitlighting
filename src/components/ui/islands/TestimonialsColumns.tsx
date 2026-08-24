// Real Google reviews, quoted verbatim from the business's Google profile.
const testimonials = [
  {
    text: "Holiday lights were installed and look awesome! I liked that they had color options to choose from and were really easy to work with. If you are looking for Christmas light installers these guys nailed it.",
    name: "Brandon Anderson",
    role: "Google review",
  },
  {
    text: "Love the lights and the pricing! They work quick and do a great job. Our home has never looked more festive!!",
    name: "Aaron Ludwig",
    role: "Local Guide on Google",
  },
  {
    text: "Great company!! Did a excellent job on my home.",
    name: "Corey Higgins",
    role: "Google review",
  },
  {
    text: "These guys are awesome! Very affordable and professional. HIGHLY RECOMMEND!",
    name: "Taylor Jones",
    role: "Google review",
  },
];

function GoogleG({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-label="Google" role="img">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-[#EFECE3] py-20 relative">
      <div className="container z-10 mx-auto max-w-[1200px] px-8">
        <div className="text-center mb-14">
          <h2 className="text-[30px] sm:text-[40px] lg:text-[52px] font-normal font-heading mb-4 text-gray-800">
            What homeowners are saying.
          </h2>
          <div className="inline-flex items-center gap-2 text-gray-600 font-heading text-sm">
            <GoogleG size={16} />
            <span>5-star reviews on Google</span>
          </div>
        </div>

        {/* Mobile: horizontal snap carousel. Desktop: static grid. */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 -mx-8 px-8 md:mx-0 md:px-0">
          {testimonials.map(({ text, name, role }) => (
            <div
              key={name}
              className="flex flex-col justify-between shrink-0 w-[82%] sm:w-[60%] md:w-auto snap-center rounded-3xl border border-black/5 bg-[#FCFBF7] p-8"
            >
              <div>
                <div className="font-heading text-[40px] leading-none text-[#0B0C0A] select-none" aria-hidden="true">&ldquo;</div>
                <p className="text-gray-700 font-heading leading-relaxed text-[15px] mt-1">{text}</p>
              </div>
              <div className="flex items-center justify-between mt-8">
                <div className="flex flex-col">
                  <div className="font-medium tracking-tight leading-5 font-heading text-gray-900">{name}</div>
                  <div className="leading-5 opacity-60 tracking-tight font-heading text-gray-600 text-sm">{role}</div>
                </div>
                <GoogleG />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
