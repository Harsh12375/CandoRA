"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Mail, Phone, MapPin, Calendar } from "lucide-react"

// Mock customers data
const customersData = [
  {
    id: 1,
    name: "Rajesh Kumar",
    email: "rajesh@email.com",
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    orders: 12,
    totalSpent: 3450,
    lastOrder: "2024-01-15",
    status: "active",
    joinDate: "2023-06-15",
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya@email.com",
    phone: "+91 87654 32109",
    location: "Delhi, NCR",
    orders: 8,
    totalSpent: 2180,
    lastOrder: "2024-01-14",
    status: "active",
    joinDate: "2023-08-22",
  },
  {
    id: 3,
    name: "Amit Patel",
    email: "amit@email.com",
    phone: "+91 76543 21098",
    location: "Bangalore, Karnataka",
    orders: 15,
    totalSpent: 4200,
    lastOrder: "2024-01-13",
    status: "vip",
    joinDate: "2023-04-10",
  },
  {
    id: 4,
    name: "Sunita Gupta",
    email: "sunita@email.com",
    phone: "+91 65432 10987",
    location: "Chennai, Tamil Nadu",
    orders: 3,
    totalSpent: 890,
    lastOrder: "2024-01-10",
    status: "new",
    joinDate: "2024-01-05",
  },
]

export default function CustomersPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [customers, setCustomers] = useState(customersData)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin")
      return
    }
    setIsLoading(false)
  }, [router])

  const getStatusColor = (status) => {
    switch (status) {
      case "vip":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "new":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customers</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your customer relationships</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">456</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Customers</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">389</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">23</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">VIP</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">44</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">New This Month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Customer List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Order</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{customer.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Joined {customer.joinDate}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm flex items-center text-gray-900 dark:text-white">
                            <Mail className="h-3 w-3 mr-2" />
                            {customer.email}
                          </p>
                          <p className="text-sm flex items-center text-gray-600 dark:text-gray-400">
                            <Phone className="h-3 w-3 mr-2" />
                            {customer.phone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm flex items-center text-gray-600 dark:text-gray-400">
                          <MapPin className="h-3 w-3 mr-2" />
                          {customer.location}
                        </p>
                      </TableCell>
                      <TableCell className="font-medium">{customer.orders}</TableCell>
                      <TableCell className="font-medium">₹{customer.totalSpent.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
                      </TableCell>
                      <TableCell>{customer.lastOrder}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            Contact
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
