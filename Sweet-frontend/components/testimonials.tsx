import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    comment: "The best sweets in town! Their chocolate truffles are absolutely divine.",
    rating: 5,
    image: "/customer-sarah.jpg",
  },
  {
    name: "Mike Chen",
    comment: "Amazing variety and quality. The mithai selection is authentic and delicious.",
    rating: 5,
    image: "/customer-mike.jpg",
  },
  {
    name: "Emily Davis",
    comment: "Perfect for special occasions. Their custom cakes are works of art!",
    rating: 5,
    image: "/customer-emily.jpg",
  },
]

export default function Testimonials() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What People
            <span className="block text-primary">Love About Us</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.comment}"</p>
                <h4 className="font-semibold">{testimonial.name}</h4>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
