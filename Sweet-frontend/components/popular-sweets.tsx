"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"

// Mock data - replace with actual API call
const mockSweets = [
  {
    id: 1,
    name: "Chocolate Truffle Cake",
    price: 25.99,
    rating: 4.8,
    image: "/chocolate-truffle.jpg",
    category: "Cakes",
  },
  {
    id: 2,
    name: "Gulab Jamun",
    price: 12.99,
    rating: 4.9,
    image: "/gulab-jamun.jpg",
    category: "Mithai",
  },
  {
    id: 3,
    name: "Belgian Chocolates",
    price: 18.99,
    rating: 4.7,
    image: "/belgian-chocolates.jpg",
    category: "Chocolates",
  },
  {
    id: 4,
    name: "Croissant Variety Pack",
    price: 15.99,
    rating: 4.6,
    image: "/croissants.jpg",
    category: "Pastries",
  },
]

export default function PopularSweets() {
  const [sweets, setSweets] = useState(mockSweets)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Simulate API call
  useEffect(() => {
    // Replace with actual API call to /api/sweets
    // fetchSweets()
  }, [])

  const handleViewAllSweets = () => {
    router.push("/auth")
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-primary">Loved</span> by Locals
          </h2>
          <p className="text-lg text-muted-foreground">Our most popular sweets that keep customers coming back</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {sweets.map((sweet) => (
            <Card key={sweet.id} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={sweet.image || "/placeholder.svg"}
                    alt={sweet.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{sweet.rating}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-balance">{sweet.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">${sweet.price}</span>
                    <Button size="sm" className="gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Buy Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" onClick={handleViewAllSweets}>
            View All Sweets
          </Button>
        </div>
      </div>
    </section>
  )
}
