"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Upload } from "lucide-react"

// Mock sweet data
const initialSweets = [
  {
    id: 1,
    name: "Gulab Jamun",
    category: "Indian",
    price: 20,
    stock: 50,
    description: "Soft, spongy balls soaked in rose-flavored sugar syrup",
    image: "/gulab-jamun.png",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Chocolate Truffle",
    category: "Western",
    price: 35,
    stock: 0,
    description: "Rich chocolate ganache covered in cocoa powder",
    image: "/chocolate-truffle.png",
    status: "active",
    createdAt: "2024-01-14",
  },
  {
    id: 3,
    name: "Rasgulla",
    category: "Indian",
    price: 15,
    stock: 30,
    description: "Spongy cottage cheese balls in sugar syrup",
    image: "/rasgulla.png",
    status: "active",
    createdAt: "2024-01-13",
  },
  {
    id: 4,
    name: "Jalebi",
    category: "Indian",
    price: 25,
    stock: 25,
    description: "Crispy spiral-shaped sweet soaked in sugar syrup",
    image: "/jalebi.jpg",
    status: "inactive",
    createdAt: "2024-01-12",
  },
]

export default function ProductsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [sweets, setSweets] = useState(initialSweets)
  const [filteredSweets, setFilteredSweets] = useState(initialSweets)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingSweet, setEditingSweet] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: "",
    status: "active",
  })

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin")
      return
    }
    setIsLoading(false)
  }, [router])

  useEffect(() => {
    let filtered = sweets

    if (searchTerm) {
      filtered = filtered.filter(
        (sweet) =>
          sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sweet.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((sweet) => sweet.category === categoryFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((sweet) => sweet.status === statusFilter)
    }

    setFilteredSweets(filtered)
  }, [sweets, searchTerm, categoryFilter, statusFilter])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingSweet) {
      setSweets(
        sweets.map((sweet) =>
          sweet.id === editingSweet.id
            ? { ...sweet, ...formData, price: Number(formData.price), stock: Number(formData.stock) }
            : sweet,
        ),
      )
    } else {
      const newSweet = {
        id: Date.now(),
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        createdAt: new Date().toISOString().split("T")[0],
      }
      setSweets([...sweets, newSweet])
    }

    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
      image: "",
      status: "active",
    })
    setEditingSweet(null)
    setIsAddDialogOpen(false)
  }

  const handleEdit = (sweet) => {
    setEditingSweet(sweet)
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      stock: sweet.stock.toString(),
      description: sweet.description,
      image: sweet.image,
      status: sweet.status,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this sweet?")) {
      setSweets(sweets.filter((sweet) => sweet.id !== id))
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
      image: "",
      status: "active",
    })
    setEditingSweet(null)
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your sweet inventory</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600" onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Sweet
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingSweet ? "Edit Sweet" : "Add New Sweet"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Indian">Indian</SelectItem>
                        <SelectItem value="Western">Western</SelectItem>
                        <SelectItem value="Fusion">Fusion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="Enter image URL or upload"
                    />
                    <Button type="button" variant="outline">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                    {editingSweet ? "Update Sweet" : "Add Sweet"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search sweets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Indian">Indian</SelectItem>
                  <SelectItem value="Western">Western</SelectItem>
                  <SelectItem value="Fusion">Fusion</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSweets.map((sweet) => (
            <Card key={sweet.id} className="overflow-hidden">
              <div className="aspect-square relative">
                <img src={sweet.image || "/placeholder.svg"} alt={sweet.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2">
                  <Badge variant={sweet.status === "active" ? "default" : "secondary"}>{sweet.status}</Badge>
                </div>
                {sweet.stock === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Badge variant="destructive">Out of Stock</Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{sweet.name}</h3>
                    <Badge variant="outline">{sweet.category}</Badge>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{sweet.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-orange-600">₹{sweet.price}</span>
                    <span className="text-sm text-gray-500">Stock: {sweet.stock}</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(sweet)} className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(sweet.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSweets.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">No sweets found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
