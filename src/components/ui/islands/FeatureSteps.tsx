import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Feature {
  step: string
  title: string
  content: string
  image: string
}

interface FeatureStepsProps {
  features: Feature[]
  title?: string
  autoPlayInterval?: number
}

export default function FeatureSteps({
  features,
  title = "Why Utah Homeowners Choose R&R Solar",
  autoPlayInterval = 4000,
}: FeatureStepsProps) {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 100 / (autoPlayInterval / 100))
      } else {
        setCurrentFeature((prev) => (prev + 1) % features.length)
        setProgress(0)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [progress, features.length, autoPlayInterval])

  return (
    <div className="w-full">
      <div className="max-w-[1200px] mx-auto w-full">
        <h2 className="text-[36px] sm:text-[40px] lg:text-[52px] font-medium font-heading mb-12 text-center text-gray-800">
          {title}
        </h2>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-10 items-center">
          {/* Image Section - Left on desktop, top on mobile */}
          <div className="order-1 relative w-full h-[250px] md:h-[400px] overflow-hidden rounded-xl bg-gray-100">
            <AnimatePresence mode="wait">
              {features.map(
                (feature, index) =>
                  index === currentFeature && (
                    <motion.div
                      key={index}
                      className="absolute inset-0 rounded-xl overflow-hidden"
                      initial={{ y: 100, opacity: 0, rotateX: -20 }}
                      animate={{ y: 0, opacity: 1, rotateX: 0 }}
                      exit={{ y: -100, opacity: 0, rotateX: 20 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          console.log('Image failed to load:', feature.image);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                    </motion.div>
                  ),
              )}
            </AnimatePresence>
          </div>

          {/* Features List - Right on desktop, bottom on mobile */}
          <div className="order-2 space-y-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-6 cursor-pointer"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: index === currentFeature ? 1 : 0.3 }}
                transition={{ duration: 0.5 }}
                onClick={() => {
                  setCurrentFeature(index)
                  setProgress(0)
                }}
              >
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-all duration-300 ${
                    index === currentFeature
                      ? "bg-[#498dcb] border-[#498dcb] text-white scale-110"
                      : "bg-gray-100 border-gray-300 text-gray-500"
                  }`}
                >
                  {index <= currentFeature ? (
                    <span className="text-lg font-bold">✓</span>
                  ) : (
                    <span className="text-lg font-semibold">{index + 1}</span>
                  )}
                </motion.div>

                <div className="flex-1 border-b border-gray-200 pb-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 font-heading">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 font-heading">
                    {feature.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
