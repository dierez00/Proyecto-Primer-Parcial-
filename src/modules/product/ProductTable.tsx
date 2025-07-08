"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, AlertCircle, Package, DollarSign, Hash, FileText, Archive } from "lucide-react"
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

interface ProductsResponse {
  products: Product[]
}

export default function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const url = import.meta.env.VITE_PRODUCTS_URL;

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
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

      const data: ProductsResponse = await response.json()
      setProducts(data.products || [])
    } catch (err) {
      console.error("Error fetching products:", err)
      setError(err instanceof Error ? err.message : "Error al cargar los productos")
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount)
  }

  const getStatusBadge = (status: boolean) => {
    return (
      <Badge variant={status ? "default" : "secondary"} className="text-xs">
        {status ? "Activo" : "Inactivo"}
      </Badge>
    )
  }

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <Badge variant="destructive" className="text-xs">
          Sin stock
        </Badge>
      )
    } else if (stock <= 5) {
      return (
        <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
          Stock bajo
        </Badge>
      )
    } else if (stock <= 10) {
      return (
        <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
          Stock medio
        </Badge>
      )
    } else {
      return (
        <Badge variant="default" className="text-xs bg-green-100 text-green-800">
          Stock alto
        </Badge>
      )
    }
  }

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product._id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

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

  // Calculate statistics
  const totalValue = products.reduce((sum, product) => sum + product.price * product.stock, 0)
  const activeProducts = products.filter((product) => product.status).length
  const lowStockProducts = products.filter((product) => product.stock <= 5 && product.stock > 0).length
  const outOfStockProducts = products.filter((product) => product.stock === 0).length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="mx-auto h-16 w-16 text-green-500 animate-spin mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Cargando productos...</h2>
              <p className="text-gray-500">Por favor espera un momento</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="mt-2">
                <strong>Error al cargar productos:</strong>
                <br />
                {error}
              </AlertDescription>
            </Alert>
            <button
              onClick={fetchProducts}
              className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Reintentar
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Productos</p>
                  <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Valor Inventario</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
                  <p className="text-2xl font-bold text-gray-900">{lowStockProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Archive className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sin Stock</p>
                  <p className="text-2xl font-bold text-gray-900">{outOfStockProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Table Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Package className="h-6 w-6 text-green-600" />
              <CardTitle className="text-2xl font-bold">Inventario de Productos</CardTitle>
            </div>
            <CardDescription>Gestión y control del inventario de productos</CardDescription>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
              <div className="flex items-center space-x-4">
                <p className="text-sm text-gray-600">
                  Activos: <span className="font-semibold text-green-600">{activeProducts}</span> de {products.length}
                </p>
                {searchTerm && (
                  <p className="text-sm text-gray-600">
                    Mostrando: <span className="font-semibold text-blue-600">{filteredProducts.length}</span> resultados
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar por nombre, descripción o ID..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10 w-80"
                  />
                </div>
                <Button onClick={fetchProducts} variant="outline" size="sm">
                  Actualizar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                {searchTerm ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No se encontraron resultados</h3>
                    <p className="text-gray-500 mb-4">No hay productos que coincidan con "{searchTerm}"</p>
                    <Button onClick={() => setSearchTerm("")} variant="outline">
                      Limpiar búsqueda
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay productos registrados</h3>
                    <p className="text-gray-500">
                      Los productos aparecerán aquí una vez que se agreguen al inventario.
                    </p>
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
                            <span>ID</span>
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center space-x-2">
                            <Package className="h-4 w-4" />
                            <span>Producto</span>
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span>Descripción</span>
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4" />
                            <span>Precio</span>
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center space-x-2">
                            <Archive className="h-4 w-4" />
                            <span>Stock</span>
                          </div>
                        </TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Valor Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentProducts.map((product) => (
                        <TableRow key={product._id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            <span className="font-mono text-sm text-gray-900">#{product._id.slice(-8)}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900">{product.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-gray-700 max-w-xs truncate block" title={product.description}>
                              {product.description}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-gray-900">{formatCurrency(product.price)}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col space-y-1">
                              <span className="font-semibold text-gray-900">{product.stock} unidades</span>
                              {getStockBadge(product.stock)}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(product.status)}</TableCell>
                          <TableCell>
                            <span className="font-semibold text-green-600">
                              {formatCurrency(product.price * product.stock)}
                            </span>
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
                      Mostrando {startIndex + 1} a {Math.min(endIndex, filteredProducts.length)} de{" "}
                      {filteredProducts.length} productos
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
