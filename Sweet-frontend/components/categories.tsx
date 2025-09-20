"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"

const categories = [
  {
    name: "Cakes",
    icon: "🎂",
    description: "Fresh baked cakes for every occasion",
    hoverDescription:
      "Delicious custom cakes, birthday specials, and celebration treats made fresh daily with premium ingredients",
    bgGradient: "from-pink-100 via-rose-50 to-cream-100",
    hoverBg: "from-pink-200 via-rose-100 to-cream-200",
    borderColor: "border-pink-300/50 hover:border-pink-500",
    textColor: "text-pink-900",
    hoverTextColor: "text-gray-800",
    shadowColor: "hover:shadow-pink-300/40",
    iconBg: "from-pink-200/30 to-rose-200/30 group-hover:from-pink-400/50 group-hover:to-rose-400/50",
  },
  {
    name: "Chocolates",
    icon: "🍫",
    description: "Premium chocolates and truffles",
    hoverDescription: "Handcrafted artisan chocolates, luxury truffles, and gourmet confections from around the world",
    bgGradient: "from-amber-100 via-orange-50 to-yellow-50",
    hoverBg: "from-amber-200 via-orange-100 to-yellow-100",
    borderColor: "border-amber-400/50 hover:border-amber-600",
    textColor: "text-amber-950",
    hoverTextColor: "text-gray-800",
    shadowColor: "hover:shadow-amber-400/40",
    iconBg: "from-amber-200/30 to-orange-200/30 group-hover:from-amber-400/50 group-hover:to-orange-400/50",
  },
  {
    name: "Mithai",
    icon: "🧈",
    description: "Traditional Indian sweets",
    hoverDescription: "Authentic Indian sweets including gulab jamun, rasgulla, barfi, and festival specialties",
    bgGradient: "from-yellow-100 via-amber-50 to-orange-50",
    hoverBg: "from-yellow-200 via-amber-100 to-orange-100",
    borderColor: "border-yellow-400/50 hover:border-yellow-600",
    textColor: "text-yellow-950",
    hoverTextColor: "text-gray-800",
    shadowColor: "hover:shadow-yellow-400/40",
    iconBg: "from-yellow-200/30 to-amber-200/30 group-hover:from-yellow-400/50 group-hover:to-amber-400/50",
  },
  {
    name: "Pastries",
    icon: "🥐",
    description: "Flaky pastries and croissants",
    hoverDescription:
      "Buttery croissants, Danish pastries, éclairs, and European-style baked goods made fresh every morning",
    bgGradient: "from-orange-100 via-amber-50 to-yellow-50",
    hoverBg: "from-orange-200 via-amber-100 to-yellow-100",
    borderColor: "border-orange-300/50 hover:border-orange-500",
    textColor: "text-orange-950",
    hoverTextColor: "text-gray-800",
    shadowColor: "hover:shadow-orange-300/40",
    iconBg: "from-orange-200/30 to-yellow-200/30 group-hover:from-orange-400/50 group-hover:to-yellow-400/50",
  },
]

export default function Categories() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section id="explore" className="py-16 bg-pastel-beige">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-burgundy">
            Find and Get
            <span className="block text-burgundy">What You Love</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Card
              key={index}
              className={`
                group cursor-pointer border-2 rounded-2xl shadow-md hover:shadow-2xl
                transition-all duration-500 ease-out
                hover:-translate-y-2 hover:scale-110
                ${category.borderColor} ${category.shadowColor}
                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
              `}
              style={{
                transitionDelay: isVisible ? `${index * 200}ms` : "0ms",
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardContent className="p-8 text-center relative overflow-hidden">
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${hoveredCard === index ? category.hoverBg : category.bgGradient} transition-all duration-500 z-0`}
                />

                <div className="relative z-10 w-20 h-20 mx-auto mb-6">
                  <div
                    className={`
                    absolute inset-0 rounded-full bg-gradient-to-br ${category.iconBg}
                    transition-all duration-300
                    group-hover:shadow-lg ${category.shadowColor}
                    group-hover:animate-pulse
                  `}
                  />
                  <div
                    className={`
                    relative w-full h-full rounded-full bg-white/80 border-2 ${category.borderColor}
                    flex items-center justify-center
                    group-hover:shadow-lg ${category.shadowColor}
                    transition-all duration-300
                  `}
                  >
                    <span className="text-3xl group-hover:scale-125 transition-transform duration-300 group-hover:animate-bounce">
                      {category.icon}
                    </span>
                  </div>
                </div>

                <h3 className={`relative z-10 font-bold text-xl mb-3 ${category.textColor} transition-colors`}>{category.name}</h3>

                <div className="relative z-10 transition-all duration-300">
                  {hoveredCard === index ? (
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-gray-200 shadow-sm">
                      <p className={`text-sm ${category.hoverTextColor} leading-relaxed font-semibold animate-fade-in`}>
                        {category.hoverDescription}
                      </p>
                    </div>
                  ) : (
                    <p className={`text-sm ${category.textColor} leading-relaxed font-medium`}>
                      {category.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
