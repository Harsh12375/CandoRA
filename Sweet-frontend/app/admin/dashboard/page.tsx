"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Package, Users, TrendingUp, AlertTriangle, Star, DollarSign, Activity } from "lucide-react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for dashboard
const dashboardStats = {
  totalOrders: 1247,
  totalProducts: 89,
  totalCustomers: 456,
  revenue: 45670,
  lowStockItems: 12,
  avgRating: 4.8,
  todayOrders: 23,
  monthlyGrowth: 12.5,
}

const recentOrders = [
  { id: "#1234", customer: "John Doe", items: 3, total: 245, status: "completed" },
  { id: "#1235", customer: "Jane Smith", items: 2, total: 180, status: "processing" },
  { id: "#1236", customer: "Mike Johnson", items: 5, total: 320, status: "pending" },
  { id: "#1237", customer: "Sarah Wilson", items: 1, total: 95, status: "completed" },
]

const topProducts = [
  { name: "Gulab Jamun", sales: 234, revenue: 4680 },
  { name: "Rasgulla", sales: 189, revenue: 3780 },
  { name: "Jalebi", sales: 156, revenue: 3120 },
  { name: "Laddu", sales: 143, revenue: 2860 },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [sweets, setSweets] = useState<any[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newSweet, setNewSweet] = useState({ name: "", category: "", price: "", quantity: "", imageUrl: "" })
  const [isRestockOpen, setIsRestockOpen] = useState(false)
  const [restockItem, setRestockItem] = useState<{ id: string; name: string } | null>(null)
  const [restockAmount, setRestockAmount] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userRaw = localStorage.getItem("user")
    const user = userRaw ? JSON.parse(userRaw) : null
    if (!token || !user || user.role !== "admin") {
      router.push("/admin")
      return
    }

    async function load() {
      try {
        const list = await api.sweets.list()
        setSweets(list)
      } catch (e) {
        // keep empty but stay on dashboard
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [router])

  const refresh = async () => {
    try {
      const list = await api.sweets.list()
      setSweets(list)
    } catch {}
  }

  const createSweet = async () => {
    try {
      const price = Number(newSweet.price)
      const quantity = Number(newSweet.quantity)
      if (!newSweet.name.trim() || !newSweet.category.trim() || isNaN(price) || isNaN(quantity)) {
        alert("Please fill all fields correctly")
        return
      }
      await api.sweets.create({
        name: newSweet.name.trim(),
        category: newSweet.category.trim(),
        price,
        quantity,
        imageUrl: newSweet.imageUrl.trim() || undefined,
      })
      setIsCreateOpen(false)
      setNewSweet({ name: "", category: "", price: "", quantity: "", imageUrl: "" })
      await refresh()
    } catch (e: any) {
      alert(e?.message || "Failed to create sweet")
    }
  }

  const openRestock = (id: string, name: string) => {
    setRestockItem({ id, name })
    setRestockAmount("")
    setIsRestockOpen(true)
  }

  const submitRestock = async () => {
    if (!restockItem) return
    const amt = Number(restockAmount)
    if (!amt || amt <= 0) {
      alert("Enter a positive amount")
      return
    }
    try {
      await api.inventory.restock(restockItem.id, amt)
      setIsRestockOpen(false)
      setRestockItem(null)
      setRestockAmount("")
      await refresh()
    } catch (e: any) {
      alert(e?.message || "Failed to restock")
    }
  }

  const deleteSweet = async (id: string) => {
    if (!confirm("Delete this sweet?")) return
    try {
      await api.sweets.delete(id)
      await refresh()
    } catch (e: any) {
      alert(e?.message || "Failed to delete")
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening with your sweet shop.
          </p>
        </div>

        {/* Stats Grid (computed from sweets) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Products</p>
                  <p className="text-3xl font-bold">{sweets.length}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Inventory Value</p>
                  <p className="text-3xl font-bold">₹{sweets.reduce((sum, s: any) => sum + (s.price || 0) * (s.quantity || 0), 0).toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Low Stock Items</p>
                  <p className="text-3xl font-bold">{sweets.filter((s: any) => (s.quantity || 0) <= 20).length}</p>
                </div>
                <Package className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Protected API</p>
                  <p className="text-3xl font-bold">OK</p>
                </div>
                <Users className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Today's Orders</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.todayOrders}</p>
                </div>
                <Activity className="h-6 w-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Growth</p>
                  <p className="text-2xl font-bold text-green-600">+{dashboardStats.monthlyGrowth}%</p>
                </div>
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">{dashboardStats.avgRating}</p>
                </div>
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Low Stock Alert</p>
                  <p className="text-2xl font-bold text-red-600">{dashboardStats.lowStockItems}</p>
                </div>
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Manage Sweets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sweets</CardTitle>
            <Button onClick={() => setIsCreateOpen(true)} className="bg-orange-500 hover:bg-orange-600">Add New Sweet</Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="w-48">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sweets.map((s: any) => (
                    <TableRow key={s._id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.category}</TableCell>
                      <TableCell>₹{(s.price || 0).toFixed(2)}</TableCell>
                      <TableCell>{s.quantity ?? 0}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => openRestock(s._id, s.name)}>Restock</Button>
                          <Button variant="outline" className="text-red-600" onClick={() => deleteSweet(s._id)}>Delete</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders & Top Products (still mock placeholders) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{order.id}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">₹{order.total}</p>
                      <Badge
                        variant={
                          order.status === "completed"
                            ? "default"
                            : order.status === "processing"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={product.name}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{product.sales} sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">₹{product.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Sweet Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Sweet</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Name</Label>
                <Input value={newSweet.name} onChange={(e) => setNewSweet({ ...newSweet, name: e.target.value })} />
              </div>
              <div>
                <Label>Category</Label>
                <Input value={newSweet.category} onChange={(e) => setNewSweet({ ...newSweet, category: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Price</Label>
                  <Input type="number" value={newSweet.price} onChange={(e) => setNewSweet({ ...newSweet, price: e.target.value })} />
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input type="number" value={newSweet.quantity} onChange={(e) => setNewSweet({ ...newSweet, quantity: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Image URL (optional)</Label>
                <Input value={newSweet.imageUrl} onChange={(e) => setNewSweet({ ...newSweet, imageUrl: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={createSweet}>Create</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Restock Dialog */}
        <Dialog open={isRestockOpen} onOpenChange={setIsRestockOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Restock {restockItem?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Amount</Label>
                <Input type="number" value={restockAmount} onChange={(e) => setRestockAmount(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsRestockOpen(false)}>Cancel</Button>
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={submitRestock}>Restock</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
