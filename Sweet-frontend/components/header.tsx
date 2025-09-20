"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled ? "py-3" : "py-4"
      }`}
    >
      <div
        className={`container mx-auto px-4 transition-all duration-500 ease-in-out ${
          isScrolled ? "max-w-4xl" : "max-w-7xl"
        }`}
      >
        <div
          className={`transition-all duration-500 ease-in-out ${
            isScrolled
              ? "bg-primary/95 backdrop-blur-lg shadow-2xl rounded-full px-6 py-3 mx-auto max-w-fit"
              : "bg-primary shadow-lg rounded-lg px-6 py-4"
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo - hidden when scrolled to make room for navigation */}
            <div
              className={`flex items-center space-x-2 transition-all duration-500 ${isScrolled ? "hidden" : "flex"}`}
            >
              <div className="font-bold text-2xl">🍭</div>
              <span className="font-bold text-primary-foreground text-xl">Sweet Haus</span>
            </div>

            <nav
              className={`hidden md:flex items-center transition-all duration-500 ${
                isScrolled ? "space-x-8 mx-auto" : "space-x-8"
              }`}
            >
              <Link
                href="#"
                className={`hover:text-accent transition-all duration-300 font-medium ${
                  isScrolled
                    ? "text-sm text-primary-foreground/90 hover:text-accent"
                    : "text-base text-primary-foreground"
                }`}
              >
                Menu
              </Link>
              <Link
                href="#explore"
                className={`hover:text-accent transition-all duration-300 font-medium ${
                  isScrolled
                    ? "text-sm text-primary-foreground/90 hover:text-accent"
                    : "text-base text-primary-foreground"
                }`}
              >
                Locations
              </Link>

              {isScrolled && (
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">🍭</span>
                  </div>
                </div>
              )}

              <Link
                href="#about"
                className={`hover:text-accent transition-all duration-300 font-medium ${
                  isScrolled
                    ? "text-sm text-primary-foreground/90 hover:text-accent"
                    : "text-base text-primary-foreground"
                }`}
              >
                About Us
              </Link>
              <Link
                href="#contact"
                className={`hover:text-accent transition-all duration-300 font-medium ${
                  isScrolled
                    ? "text-sm text-primary-foreground/90 hover:text-accent"
                    : "text-base text-primary-foreground"
                }`}
              >
                News
              </Link>
            </nav>

            <div
              className={`hidden md:flex items-center transition-all duration-500 ${
                isScrolled ? "hidden" : "flex space-x-4"
              }`}
            >
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:text-accent">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Cart
              </Button>
              <Link href="/auth">
                <Button variant="secondary" size="sm">
                  Login
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden transition-all duration-300 ${isScrolled ? "scale-90" : "scale-100"}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-primary-foreground/20">
          <nav className="flex flex-col space-y-4 mt-4">
            <Link href="#" className="hover:text-accent transition-colors">
              Menu
            </Link>
            <Link href="#explore" className="hover:text-accent transition-colors">
              Locations
            </Link>
            <Link href="#about" className="hover:text-accent transition-colors">
              About Us
            </Link>
            <Link href="#contact" className="hover:text-accent transition-colors">
              News
            </Link>
            <div className="flex flex-col space-y-2 pt-4">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:text-accent justify-start">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Cart
              </Button>
              <Link href="/auth">
                <Button variant="secondary" size="sm">
                  Login
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
