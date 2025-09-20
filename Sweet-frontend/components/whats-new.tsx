import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"

const newSweets = [
  {
    id: 1,
    title: "Introducing Seasonal Pumpkin Spice Collection",
    description: "Fall flavors meet traditional sweets in our new autumn collection.",
    image: "/pumpkin-spice-collection.jpg",
    date: "2024-09-15",
  },
  {
    id: 2,
    title: "Artisan Chocolate Workshop Series",
    description: "Learn to make premium chocolates with our master chocolatier.",
    image: "/chocolate-workshop.jpg",
    date: "2024-09-10",
  },
  {
    id: 3,
    title: "New Vegan Sweet Options Available",
    description: "Delicious plant-based alternatives that don't compromise on taste.",
    image: "/vegan-sweets.jpg",
    date: "2024-09-05",
  },
]

export default function WhatsNew() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            What's New at
            <span className="block text-primary">Our Sweet Shop</span>
          </h2>
          <Button variant="outline" className="hidden md:flex bg-transparent">
            View All News
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newSweets.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="w-4 h-4" />
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                  <h3 className="font-semibold text-lg mb-3 text-balance">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                  <Button variant="ghost" size="sm" className="p-0 h-auto text-primary hover:text-primary/80">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Button variant="outline">
            View All News
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
