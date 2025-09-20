import { Clock, Package, Truck, Heart } from "lucide-react"

const features = [
  {
    icon: Clock,
    title: "Freshly Made",
    description: "All our sweets are made fresh daily using the finest ingredients",
  },
  {
    icon: Package,
    title: "Wide Selection",
    description: "From traditional to modern, we have sweets for every taste and occasion",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick and reliable delivery to bring sweetness to your doorstep",
  },
  {
    icon: Heart,
    title: "Loved by Customers",
    description: "Thousands of happy customers trust us for their sweet moments",
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Good Vibes,
              <span className="block text-primary">Great Sweets.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We believe every sweet moment deserves the perfect treat. That's why we craft each product with love,
              using traditional recipes and modern techniques.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img src="/baker-making-sweets-in-kitchen.jpg" alt="Baker at work" className="rounded-2xl shadow-lg w-full" />
              <img src="/colorful-macarons-display.jpg" alt="Macarons" className="rounded-2xl shadow-lg w-full" />
            </div>
            <div className="pt-8">
              <img src="/elegant-sweet-shop-interior.jpg" alt="Sweet shop" className="rounded-2xl shadow-lg w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
