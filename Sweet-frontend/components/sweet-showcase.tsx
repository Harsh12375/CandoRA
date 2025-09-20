"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, ChevronUp, ChevronDown, X, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

const sweetsData = [
  {
    id: 1,
    name: "Gulab Jamun",
    category: "Traditional",
    price: 12.5,
    stock: 25,
    imageUrl: "https://i.postimg.cc/3J3Pnfsx/Gemini-Generated-Image-gyndi2gyndi2gynd.png",
    bgColor: "#f7e1d3",
  },
  {
    id: 2,
    name: "Rasgulla",
    category: "Bengali",
    price: 10.0,
    stock: 0,
    imageUrl: "https://i.postimg.cc/xT01MRgK/Gemini-Generated-Image-jeutk2jeutk2jeut.png",
    bgColor: "#f5faff",
  },
  {
    id: 3,
    name: "Kaju Katli",
    category: "Premium",
    price: 25.0,
    stock: 15,
    imageUrl: "https://i.postimg.cc/YqT8nV2z/Gemini-Generated-Image-2kd6ga2kd6ga2kd6.png",
    bgColor: "#f7f3e8",
  },
  {
    id: 4,
    name: "Barfi",
    category: "Traditional",
    price: 18.0,
    stock: 30,
    imageUrl: "https://i.postimg.cc/43Ythvh2/Gemini-Generated-Image-jve0tejve0tejve0.png",
    bgColor: "#fdf5f7",
  },
  {
    id: 5,
    name: "Ladoo",
    category: "Festival",
    price: 15.0,
    stock: 20,
    imageUrl: "https://i.postimg.cc/QC8dcsyN/Gemini-Generated-Image-ngz7f5ngz7f5ngz7.png",
    bgColor: "#fff0b3",
  },
  {
    id: 6,
    name: "Jalebi",
    category: "Crispy",
    price: 8.0,
    stock: 40,
    imageUrl: "https://i.postimg.cc/RhhzM0Yt/Gemini-Generated-Image-fkayw1fkayw1fkay.png",
    bgColor: "#ffecd5",
  },
  {
    id: 7,
    name: "Soan Papdi",
    category: "Flaky",
    price: 12.0,
    stock: 12,
    imageUrl: "https://i.postimg.cc/52wDWvtG/Gemini-Generated-Image-43y81l43y81l43y8.png",
    bgColor: "#fff6e5",
  },
  {
    id: 8,
    name: "Peda",
    category: "Milk",
    price: 14.0,
    stock: 18,
    imageUrl: "https://i.postimg.cc/qM8d4Wbj/Gemini-Generated-Image-noymnbnoymnbnoym.png",
    bgColor: "#fce5d0",
  },
  {
    id: 9,
    name: "Chocolate Truffle",
    category: "Western",
    price: 30.0,
    stock: 8,
    imageUrl: "https://i.postimg.cc/Tw9Wzk8w/Gemini-Generated-Image-y3hx76y3hx76y3hx.png",
    bgColor: "#e5d4cf",
  },
  {
    id: 10,
    name: "Cheesecake Slice",
    category: "Western",
    price: 28.0,
    stock: 5,
    imageUrl: "https://i.postimg.cc/X70Yfft1/Gemini-Generated-Image-4c47th4c47th4c47.png",
    bgColor: "#f6f0eb",
  },
]

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  imageUrl: string
}

export default function SweetShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 50])
  const [showFilters, setShowFilters] = useState(false)
  const [filteredSweets, setFilteredSweets] = useState(sweetsData)

  const lastScrollTime = useRef(0)
  const scrollThrottle = 800 // milliseconds

  const currentSweet = filteredSweets.length > 0 ? filteredSweets[currentIndex] || filteredSweets[0] : null

  useEffect(() => {
    const filtered = sweetsData.filter((sweet) => {
      const matchesSearch =
        sweet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sweet.category.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || sweet.category === selectedCategory
      const matchesPrice = sweet.price >= priceRange[0] && sweet.price <= priceRange[1]

      return matchesSearch && matchesCategory && matchesPrice
    })

    setFilteredSweets(filtered)
    if (filtered.length > 0) {
      setCurrentIndex(0)
    }
  }, [searchQuery, selectedCategory, priceRange])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      const now = Date.now()
      if (now - lastScrollTime.current < scrollThrottle) {
        return // Throttle scroll events
      }
      lastScrollTime.current = now

      if (e.deltaY > 0 && currentIndex < filteredSweets.length - 1) {
        setCurrentIndex((prev) => prev + 1)
      } else if (e.deltaY < 0 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" && currentIndex < filteredSweets.length - 1) {
        setCurrentIndex((prev) => prev + 1)
      } else if (e.key === "ArrowUp" && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1)
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [currentIndex, filteredSweets.length])

  const addToCart = (sweet: (typeof sweetsData)[0]) => {
    if (sweet.stock === 0) return

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === sweet.id)
      if (existingItem) {
        return prev.map((item) => (item.id === sweet.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        return [
          ...prev,
          {
            id: sweet.id,
            name: sweet.name,
            price: sweet.price,
            quantity: 1,
            imageUrl: sweet.imageUrl,
          },
        ]
      }
    })
  }

  const updateCartQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id))
    } else {
      setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const navigateToSection = (index: number) => {
    setCurrentIndex(index)
  }

  const nextSection = () => {
    if (currentIndex < filteredSweets.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const prevSection = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const categories = ["all", ...Array.from(new Set(sweetsData.map((sweet) => sweet.category)))]

  return (
    <motion.div
      className="h-screen w-full overflow-hidden relative"
      animate={{ backgroundColor: currentSweet?.bgColor || "#f7e1d3" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Sticky Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-sm bg-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
            <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full"></div>
            <span className="font-display text-xl font-bold text-gray-800">CandoRA</span>
          </motion.div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <Input
                placeholder="Search sweets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 bg-white/50 border-white/30 text-sm"
              />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-32 bg-white/50 border-white/30 text-sm">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="w-32">
                <Slider value={priceRange} onValueChange={setPriceRange} max={50} min={0} step={1} className="w-full" />
                <div className="text-xs text-gray-600 mt-1">
                  ${priceRange[0]} - ${priceRange[1]}
                </div>
              </div>
            </div>

            <motion.button
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="w-6 h-6 text-gray-800" />
              {getTotalItems() > 0 && (
                <motion.span
                  className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {getTotalItems()}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile filters */}
        <div className="md:hidden mt-4 space-y-3">
          <Input
            placeholder="Search sweets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/50 border-white/30"
          />
          <div className="flex space-x-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="flex-1 bg-white/50 border-white/30">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex-1">
              <Slider value={priceRange} onValueChange={setPriceRange} max={50} min={0} step={1} className="w-full" />
              <div className="text-xs text-gray-600 mt-1 text-center">
                ${priceRange[0]} - ${priceRange[1]}
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="h-full flex items-center justify-center px-6">
        {!currentSweet ? (
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">No sweets found</h2>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setPriceRange([0, 50])
              }}
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Sweet Details */}
            <motion.div
              className="space-y-8 text-center lg:text-left"
              key={`details-${currentIndex}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-4">
                <motion.p
                  className="text-sm uppercase tracking-wider text-gray-600 font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {currentSweet.category}
                </motion.p>

                <motion.h1
                  className="font-display text-4xl md:text-6xl font-bold text-gray-800 leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {currentSweet.name}
                </motion.h1>

                <motion.p
                  className="text-3xl md:text-4xl font-bold text-rose-600"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  ${currentSweet.price.toFixed(2)}
                </motion.p>

                <motion.p
                  className={`text-lg font-medium ${currentSweet.stock > 0 ? "text-green-600" : "text-red-500"}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.55 }}
                >
                  {currentSweet.stock > 0 ? `${currentSweet.stock} in stock` : "Out of stock"}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Button
                  onClick={() => addToCart(currentSweet)}
                  disabled={currentSweet.stock === 0}
                  className={`px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                    currentSweet.stock === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
                  }`}
                >
                  {currentSweet.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Side - Sweet Image */}
            <motion.div
              className="flex justify-center lg:justify-end"
              key={`image-${currentIndex}`}
              initial={{ opacity: 0, x: 50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.img
                src={currentSweet.imageUrl}
                alt={currentSweet.name}
                className="w-80 h-80 md:w-96 md:h-96 object-contain drop-shadow-2xl"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </motion.div>
          </div>
        )}
      </div>

      {/* Section Indicators */}
      {filteredSweets.length > 0 && (
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 space-y-3">
          {filteredSweets.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => navigateToSection(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-rose-500 scale-125" : "bg-white/50 hover:bg-white/70"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      )}

      {filteredSweets.length > 0 && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40 flex space-x-4">
          <motion.button
            onClick={prevSection}
            disabled={currentIndex === 0}
            className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
              currentIndex === 0
                ? "bg-white/20 text-gray-400 cursor-not-allowed"
                : "bg-white/30 text-gray-700 hover:bg-white/50"
            }`}
            whileHover={currentIndex > 0 ? { scale: 1.1 } : {}}
            whileTap={currentIndex > 0 ? { scale: 0.95 } : {}}
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>

          <motion.button
            onClick={nextSection}
            disabled={currentIndex === filteredSweets.length - 1}
            className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
              currentIndex === filteredSweets.length - 1
                ? "bg-white/20 text-gray-400 cursor-not-allowed"
                : "bg-white/30 text-gray-700 hover:bg-white/50"
            }`}
            whileHover={currentIndex < filteredSweets.length - 1 ? { scale: 1.1 } : {}}
            whileTap={currentIndex < filteredSweets.length - 1 ? { scale: 0.95 } : {}}
          >
            <ChevronDown className="w-6 h-6" />
          </motion.button>
        </div>
      )}

      {/* Section Counter */}
      {filteredSweets.length > 0 && (
        <motion.div
          className="fixed bottom-6 left-6 z-40 text-gray-700 font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <span className="text-2xl font-bold">{String(currentIndex + 1).padStart(2, "0")}</span>
          <span className="text-lg mx-2">/</span>
          <span className="text-lg">{String(filteredSweets.length).padStart(2, "0")}</span>
        </motion.div>
      )}

      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div
              className="fixed right-0 top-0 h-full w-96 bg-white z-50 shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
                  <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4">
                  {cartItems.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                  ) : (
                    cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 object-contain rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{item.name}</h3>
                          <p className="text-rose-600 font-medium">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cartItems.length > 0 && (
                  <div className="border-t pt-4 space-y-4">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-rose-600">${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-3 text-lg font-semibold">
                      Purchase Now
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
