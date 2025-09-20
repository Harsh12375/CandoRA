import Header from "@/components/header"
import Hero from "@/components/hero"
import Categories from "@/components/categories"
import PopularSweets from "@/components/popular-sweets"
import WhyChooseUs from "@/components/why-choose-us"
import Testimonials from "@/components/testimonials"
import WhatsNew from "@/components/whats-new"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Categories />
      <PopularSweets />
      <WhyChooseUs />
      <Testimonials />
      <WhatsNew />
      <Footer />
    </main>
  )
}
