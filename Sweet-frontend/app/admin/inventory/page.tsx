"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"
import {
  Search,
  Download,
  Upload,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Edit,
  Plus,
  Minus,
} from "lucide-react"

// Types
type StockStatus = "In Stock" | "Low Stock" | "Out of Stock"
type Movement = "up" | "down"
type SortField = "name" | "currentStock" | "unitPrice" | "totalValue"

interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  unitPrice: number
  totalValue: number
  supplier: string
  lastRestocked: string
  status: StockStatus
  movement: Movement
  weeklyChange: number
}

// Mock inventory data
const inventoryData: InventoryItem[] = [
  {
    id: "1",
    name: "Gulab Jamun",
    sku: "GJ001",
    category: "Indian",
    currentStock: 50,
    minStock: 20,
    maxStock: 100,
    unitPrice: 20,
    totalValue: 1000,
    supplier: "Sweet Suppliers Ltd",
    lastRestocked: "2024-01-15",
    status: "In Stock",
    movement: "up",
    weeklyChange: 12,
  },
  {
    id: "2",
    name: "Chocolate Truffle",
    sku: "CT002",
    category: "Western",
    currentStock: 0,
    minStock: 15,
    maxStock: 80,
    unitPrice: 35,
    totalValue: 0,
    supplier: "Chocolate Co.",
    lastRestocked: "2024-01-10",
    status: "Out of Stock",
    movement: "down",
    weeklyChange: -100,
  },
  {
    id: "3",
    name: "Rasgulla",
    sku: "RG003",
    category: "Indian",
    currentStock: 30,
    minStock: 25,
    maxStock: 75,
    unitPrice: 15,
    totalValue: 450,
    supplier: "Bengal Sweets",
    lastRestocked: "2024-01-13",
    status: "In Stock",
    movement: "up",
    weeklyChange: 8,
  },
  {
    id: "4",
    name: "Jalebi",
    sku: "JL004",
    category: "Indian",
    currentStock: 18,
    minStock: 20,
    maxStock: 60,
    unitPrice: 25,
    totalValue: 450,
    supplier: "Traditional Sweets",
    lastRestocked: "2024-01-12",
    status: "Low Stock",
    movement: "down",
    weeklyChange: -15,
  },
  {
    id: "5",
    name: "Laddu",
    sku: "LD005",
    category: "Indian",
    currentStock: 45,
    minStock: 30,
    maxStock: 90,
    unitPrice: 18,
    totalValue: 810,
    supplier: "Sweet Suppliers Ltd",
    lastRestocked: "2024-01-14",
    status: "In Stock",
    movement: "up",
    weeklyChange: 5,
  },
  {
    id: "6",
    name: "Barfi",
    sku: "BF006",
    category: "Indian",
    currentStock: 22,
    minStock: 25,
    maxStock: 70,
    unitPrice: 30,
    totalValue: 660,
    supplier: "Premium Sweets",
    lastRestocked: "2024-01-11",
    status: "Low Stock",
    movement: "down",
    weeklyChange: -8,
  },
]

export default function InventoryPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const demoInventory: InventoryItem[] = inventoryData
  const [inventory, setInventory] = useState<InventoryItem[]>(demoInventory)
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>(demoInventory)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isStockUpdateOpen, setIsStockUpdateOpen] = useState(false)
  const [stockUpdateItem, setStockUpdateItem] = useState<InventoryItem | null>(null)
  const [stockUpdateValue, setStockUpdateValue] = useState("")

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
        const sweets = await api.sweets.list()
        const mapped: InventoryItem[] = sweets.map((s: any) => {
          const qty = s.quantity ?? 0
          const price = s.price ?? 0
          const status = qty === 0 ? "Out of Stock" : qty <= 20 ? "Low Stock" : "In Stock"
          return {
            id: s._id as string,
            name: s.name as string,
            sku: (s.name as string)?.toUpperCase().slice(0, 2) + String(s._id).slice(-4),
            category: s.category as string,
            currentStock: qty as number,
            minStock: 20,
            maxStock: 100,
            unitPrice: price as number,
            totalValue: price * qty,
            supplier: "—",
            lastRestocked: (s.updatedAt || s.createdAt || new Date()).toString().split("T")[0],
            status,
            movement: "up",
            weeklyChange: 0,
          } as InventoryItem
        })
        setInventory(mapped)
        setFilteredInventory(mapped)
      } catch (e) {
        // Fallback to mock data if API fails
        setInventory(demoInventory)
        setFilteredInventory(demoInventory)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [router])

  useEffect(() => {
    let filtered = inventory

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.supplier.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    // Sort (avoid mutating state arrays)
    const sorted = [...filtered].sort((a, b) => {
      let aValue: any = (a as any)[sortField]
      let bValue: any = (b as any)[sortField]

      // Handle undefined/null safely
      const aU = aValue === undefined || aValue === null
      const bU = bValue === undefined || bValue === null
      if (aU && bU) return 0
      if (aU) return sortDirection === "asc" ? 1 : -1
      if (bU) return sortDirection === "asc" ? -1 : 1

      if (typeof aValue === "string" || typeof bValue === "string") {
        aValue = String(aValue).toLowerCase()
        bValue = String(bValue).toLowerCase()
      } else {
        aValue = Number(aValue)
        bValue = Number(bValue)
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      }
    })

    setFilteredInventory(sorted)
    setCurrentPage(1)
  }, [inventory, searchTerm, categoryFilter, statusFilter, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(paginatedItems.map((item) => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId])
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId))
    }
  }

  const handleStockUpdate = (item: InventoryItem, type: "update" | "add" | "remove") => {
    setStockUpdateItem(item)
    setStockUpdateValue("")
    setIsStockUpdateOpen(true)
  }

  const handleStockSubmit = async () => {
    if (stockUpdateItem && stockUpdateValue !== "") {
      const newStock = Number.parseInt(stockUpdateValue)
      try {
        if (typeof stockUpdateItem.id === "string") {
          await api.sweets.update(stockUpdateItem.id, { quantity: newStock })
        }
        setInventory(
          inventory.map((item) =>
            item.id === stockUpdateItem.id
              ? {
                  ...item,
                  currentStock: newStock,
                  totalValue: newStock * item.unitPrice,
                  status: newStock === 0 ? "Out of Stock" : newStock <= item.minStock ? "Low Stock" : "In Stock",
                  lastRestocked: new Date().toISOString().split("T")[0],
                }
              : item,
          ),
        )
        setIsStockUpdateOpen(false)
        setStockUpdateItem(null)
        setStockUpdateValue("")
      } catch (e: any) {
        if (typeof window !== "undefined") alert(e?.message || "Failed to update stock")
      }
    }
  }

  const getStatusColor = (status: StockStatus) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800"
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800"
      case "Out of Stock":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Pagination
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedItems = filteredInventory.slice(startIndex, startIndex + itemsPerPage)

  // Summary stats
  const totalValue = inventory.reduce((sum, item) => sum + item.totalValue, 0)
  const lowStockItems = inventory.filter((item) => item.status === "Low Stock").length
  const outOfStockItems = inventory.filter((item) => item.status === "Out of Stock").length

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Track and manage your sweet inventory</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{totalValue.toLocaleString()}</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{inventory.length}</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-600">{lowStockItems}</p>
                </div>
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-600">{outOfStockItems}</p>
                </div>
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, SKU, or supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full lg:w-40">
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
                <SelectTrigger className="w-full lg:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="In Stock">In Stock</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(Number.parseInt(value))}
              >
                <SelectTrigger className="w-full lg:w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Inventory Items</span>
              {selectedItems.length > 0 && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Bulk Update Stock
                  </Button>
                  <Button size="sm" variant="outline">
                    Export Selected
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedItems.length === paginatedItems.length && paginatedItems.length > 0}
                        onCheckedChange={(checked) => handleSelectAll(checked === true)}
                      />
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("name")} className="h-auto p-0 font-semibold">
                        Product <ArrowUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("currentStock")}
                        className="h-auto p-0 font-semibold"
                      >
                        Stock <ArrowUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("unitPrice")}
                        className="h-auto p-0 font-semibold"
                      >
                        Unit Price <ArrowUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("totalValue")}
                        className="h-auto p-0 font-semibold"
                      >
                        Total Value <ArrowUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Last Restocked</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={(checked) => handleSelectItem(item.id, checked === true)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          {item.movement === "up" ? (
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                          )}
                          {item.weeklyChange > 0 ? "+" : ""}
                          {item.weeklyChange}% this week
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.currentStock}</span>
                          <div className="text-xs text-gray-500">
                            Min: {item.minStock} | Max: {item.maxStock}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>₹{item.unitPrice}</TableCell>
                      <TableCell className="font-medium">₹{item.totalValue.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{item.supplier}</TableCell>
                      <TableCell className="text-sm">{item.lastRestocked}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => handleStockUpdate(item, "update")}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleStockUpdate(item, "add")}>
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleStockUpdate(item, "remove")}>
                            <Minus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredInventory.length)} of{" "}
                {filteredInventory.length} items
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock Update Dialog */}
        <Dialog open={isStockUpdateOpen} onOpenChange={setIsStockUpdateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Stock - {stockUpdateItem?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentStock">Current Stock: {stockUpdateItem?.currentStock}</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newStock">New Stock Level</Label>
                <Input
                  id="newStock"
                  type="number"
                  value={stockUpdateValue}
                  onChange={(e) => setStockUpdateValue(e.target.value)}
                  placeholder="Enter new stock level"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleStockSubmit} className="bg-orange-500 hover:bg-orange-600">
                  Update Stock
                </Button>
                <Button variant="outline" onClick={() => setIsStockUpdateOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
