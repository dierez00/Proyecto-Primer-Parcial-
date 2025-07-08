import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, AlertCircle, ShoppingCart, User, Package, Calendar, DollarSign, Hash } from "lucide-react"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  stock: number
  status: boolean
  __v: number
}

interface OrderProduct {
  productId: Product
  quantity: number
  price: number
  _id: string
}

interface OrderUser {
  _id: string
  name: string
  email: string
  password: string
  roles: string[]
  phone: string
  createDate: string
  deleteDate: string | null
  status: boolean
  __v: number
}

interface Order {
  _id: string
  userId: OrderUser
  products: OrderProduct[]
  totalPrice: number
  subtotal: number
  deleteDate: string | null
  status: string
  orderDate: string
  __v: number
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const url = import.meta.env.VITE_ORDERS_URL;

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`${url}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data: Order[] = await response.json()
      setOrders(data || [])
    } catch (err) {
      console.error("Error fetching orders:", err)
      setError(err instanceof Error ? err.message : "Error al cargar las órdenes")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
      completed: { variant: "default" as const, label: "Completada", color: "bg-green-100 text-green-800" },
      cancelled: { variant: "destructive" as const, label: "Cancelada", color: "bg-red-100 text-red-800" },
      processing: { variant: "default" as const, label: "Procesando", color: "bg-blue-100 text-blue-800" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending

    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    )
  }

  const getProductsSummary = (products: OrderProduct[]) => {
    const totalItems = products.reduce((sum, product) => sum + product.quantity, 0)
    const productNames = products.map((p) => p.productId.name).join(", ")

    return (
      <div className="space-y-1">
        <div className="text-sm font-medium text-gray-900">
          {totalItems} {totalItems === 1 ? "producto" : "productos"}
        </div>
        <div className="text-xs text-gray-500 max-w-xs truncate" title={productNames}>
          {productNames}
        </div>
      </div>
    )
  }

  // Filter orders based on search term
  const filteredOrders = orders.filter(
    (order) =>
      order.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.products.some((product) => product.productId.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentOrders = filteredOrders.slice(startIndex, endIndex)

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset to first page when searching
  }

  // Handle pagination
  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="mx-auto h-16 w-16 text-purple-500 animate-spin mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Cargando órdenes...</h2>
              <p className="text-gray-500">Por favor espera un momento</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="mt-2">
                <strong>Error al cargar órdenes:</strong>
                <br />
                {error}
              </AlertDescription>
            </Alert>
            <button
              onClick={fetchOrders}
              className="mt-4 w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Reintentar
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-6 w-6 text-purple-600" />
              <CardTitle className="text-2xl font-bold">Gestión de Órdenes</CardTitle>
            </div>
            <CardDescription>Visualización y seguimiento de todas las órdenes del sistema</CardDescription>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
              <div className="flex items-center space-x-4">
                <p className="text-sm text-gray-600">
                  Total: <span className="font-semibold text-purple-600">{orders.length}</span> órdenes
                </p>
                {searchTerm && (
                  <p className="text-sm text-gray-600">
                    Mostrando: <span className="font-semibold text-green-600">{filteredOrders.length}</span> resultados
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar por cliente, orden o producto..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10 w-80"
                  />
                </div>
                <Button onClick={fetchOrders} variant="outline" size="sm">
                  Actualizar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                {searchTerm ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No se encontraron resultados</h3>
                    <p className="text-gray-500 mb-4">No hay órdenes que coincidan con "{searchTerm}"</p>
                    <Button onClick={() => setSearchTerm("")} variant="outline">
                      Limpiar búsqueda
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay órdenes registradas</h3>
                    <p className="text-gray-500">Las órdenes aparecerán aquí una vez que se realicen compras.</p>
                  </>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">
                          <div className="flex items-center space-x-2">
                            <Hash className="h-4 w-4" />
                            <span>ID Orden</span>
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>Cliente</span>
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center space-x-2">
                            <Package className="h-4 w-4" />
                            <span>Productos</span>
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4" />
                            <span>Total</span>
                          </div>
                        </TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Fecha</span>
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentOrders.map((order) => (
                        <TableRow key={order._id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span className="font-mono text-sm text-gray-900">#{order._id.slice(-8)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900">{order.userId.name}</span>
                              <span className="text-sm text-gray-500">{order.userId.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getProductsSummary(order.products)}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900">{formatCurrency(order.totalPrice)}</span>
                              <span className="text-xs text-gray-500">Subtotal: {formatCurrency(order.subtotal)}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-700">{formatDate(order.orderDate)}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                    <div className="text-sm text-gray-600">
                      Mostrando {startIndex + 1} a {Math.min(endIndex, filteredOrders.length)} de{" "}
                      {filteredOrders.length} órdenes
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button onClick={goToPreviousPage} disabled={currentPage === 1} variant="outline" size="sm">
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                      </Button>

                      <div className="flex items-center space-x-1">
                        {getPageNumbers().map((pageNum) => (
                          <Button
                            key={pageNum}
                            onClick={() => goToPage(pageNum)}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            className="w-10"
                          >
                            {pageNum}
                          </Button>
                        ))}
                      </div>

                      <Button onClick={goToNextPage} disabled={currentPage === totalPages} variant="outline" size="sm">
                        Siguiente
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
