import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden bg-gradient-animated">
      <div className="container mx-auto px-4">
        <div className="text-center">
          {/* Hero Content */}
          <div className="max-w-4xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-6 text-balance leading-tight animate-text-glow font-playfair">
              <span className="inline-block">Life Gets</span>
              <br />
              Sweeter Here
            </h1>

            <p className="text-lg md:text-xl text-cream/80 mb-8 text-pretty max-w-2xl mx-auto">
              Because great sweets is the start of something even greater.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8 bg-cream text-burgundy hover:bg-cream/90 font-semibold rounded-full"
              >
                Explore Sweets
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 border-cream text-cream hover:bg-cream hover:text-burgundy rounded-full bg-transparent"
              >
                Our Locations
              </Button>
            </div>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="flex justify-center items-end relative">
              {/* Left Truffle */}
              <div className="animate-float transform -rotate-12 relative z-10">
                <img
                  src="/images/chocolate-truffle-clean.png"
                  alt="Chocolate Truffle"
                  className="w-44 md:w-60 lg:w-72 h-auto drop-shadow-2xl"
                />
              </div>

              {/* Center Truffle - Largest and overlapping */}
              <div className="animate-float-delayed transform scale-110 relative z-20 -mx-8 md:-mx-12 lg:-mx-16">
                <img
                  src="/images/chocolate-truffle-clean.png"
                  alt="Chocolate Truffle"
                  className="w-52 md:w-72 lg:w-84 h-auto drop-shadow-2xl"
                />
              </div>

              {/* Right Truffle */}
              <div className="animate-float transform rotate-12 relative z-10">
                <img
                  src="/images/chocolate-truffle-clean.png"
                  alt="Chocolate Truffle"
                  className="w-44 md:w-60 lg:w-72 h-auto drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-cream py-2 overflow-hidden">
        <div className="animate-scroll whitespace-nowrap">
          <span className="text-burgundy font-medium text-sm mx-8">Fast Service</span>
          <span className="text-burgundy font-medium text-sm mx-8">🍫 Sweet Treats</span>
          <span className="text-burgundy font-medium text-sm mx-8">Handcrafted Sweets</span>
          <span className="text-burgundy font-medium text-sm mx-8">🧁 Local Flavors</span>
          <span className="text-burgundy font-medium text-sm mx-8">Global Taste</span>
          <span className="text-burgundy font-medium text-sm mx-8">🍰 Friendly Service</span>
          <span className="text-burgundy font-medium text-sm mx-8">Great Sweets</span>
          <span className="text-burgundy font-medium text-sm mx-8">🍭 Fast Service</span>
          <span className="text-burgundy font-medium text-sm mx-8">Sweet Treats</span>
          <span className="text-burgundy font-medium text-sm mx-8">🍫 Handcrafted Sweets</span>
          <span className="text-burgundy font-medium text-sm mx-8">Local Flavors</span>
          <span className="text-burgundy font-medium text-sm mx-8">🧁 Global Taste</span>
        </div>
      </div>
    </section>
  )
}
