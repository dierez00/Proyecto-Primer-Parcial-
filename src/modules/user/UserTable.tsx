import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Users, Mail, Phone, Calendar, Shield, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import EditModal from "@/components/edit-modal"

interface Role {
  _id: string
  type: string
  __v: number
}

interface User {
  _id: string
  name: string
  email: string
  password: string
  roles: Role[]
  phone: string
  createDate: string
  deleteDate: string | null
  status: boolean
  __v: number
}

interface UsersResponse {
  userList: User[]
}

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const url = import.meta.env.VITE_USERS_URL;
  const saveUrl = import.meta.env.VITE_SAVE_USERS_URL;

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
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

      const data: UsersResponse = await response.json()
      setUsers(data.userList || [])
    } catch (err) {
      console.error("Error fetching users:", err)
      setError(err instanceof Error ? err.message : "Error al cargar los usuarios")
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

  const formatRoles = (roles: Role[]) => {
    if (!roles || roles.length === 0) {
      return <Badge variant="secondary">Sin roles</Badge>
    }

    return (
      <div className="flex flex-wrap gap-1">
        {roles.map((role) => (
          <Badge key={role._id} variant="default" className="text-xs">
            {role.type}
          </Badge>
        ))}
      </div>
    )
  }

  const getStatusBadge = (status: boolean) => {
    return (
      <Badge variant={status ? "default" : "destructive"} className="text-xs">
        {status ? "Activo" : "Inactivo"}
      </Badge>
    )
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setEditModalOpen(true)
  }

  const handleSaveUser = async (formData: any) => {
    if (!selectedUser) return

    try {
      const response = await fetch(
        `${saveUrl}/${selectedUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      )

      if (!response.ok) {
        throw new Error("Error al actualizar el usuario")
      }

      // Refresh the users list
      await fetchUsers()
    } catch (error) {
      throw error
    }
  }

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="mx-auto h-16 w-16 text-blue-500 animate-spin mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Cargando usuarios...</h2>
              <p className="text-gray-500">Por favor espera un momento</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="mt-2">
                <strong>Error al cargar usuarios:</strong>
                <br />
                {error}
              </AlertDescription>
            </Alert>
            <button
              onClick={fetchUsers}
              className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const availableRoles = [{ _id: "1", type: "admin", __v: 0 }]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-2xl font-bold">Lista de Usuarios</CardTitle>
            </div>
            <CardDescription>Gestión y visualización de todos los usuarios registrados en el sistema</CardDescription>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
              <div className="flex items-center space-x-4">
                <p className="text-sm text-gray-600">
                  Total: <span className="font-semibold text-blue-600">{users.length}</span> usuarios
                </p>
                {searchTerm && (
                  <p className="text-sm text-gray-600">
                    Mostrando: <span className="font-semibold text-green-600">{filteredUsers.length}</span> resultados
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar por nombre o correo..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10 w-64"
                  />
                </div>
                <Button onClick={fetchUsers} variant="outline" size="sm">
                  Actualizar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                {searchTerm ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No se encontraron resultados</h3>
                    <p className="text-gray-500 mb-4">No hay usuarios que coincidan con "{searchTerm}"</p>
                    <Button onClick={() => setSearchTerm("")} variant="outline">
                      Limpiar búsqueda
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay usuarios registrados</h3>
                    <p className="text-gray-500">
                      Los usuarios aparecerán aquí una vez que se registren en el sistema.
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
                        <TableHead className="w-[200px]">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>Nombre</span>
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>Correo</span>
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>Teléfono</span>
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4" />
                            <span>Roles</span>
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Fecha de Registro</span>
                          </div>
                        </TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentUsers.map((user) => (
                        <TableRow key={user._id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900">{user.name}</span>
                              <span className="text-xs text-gray-500">ID: {user._id.slice(-8)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-700">{user.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-gray-700">{user.phone}</span>
                          </TableCell>
                          <TableCell>{formatRoles(user.roles)}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-700">{formatDate(user.createDate)}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>
                            <Button
                              onClick={() => handleEditUser(user)}
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
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
                      Mostrando {startIndex + 1} a {Math.min(endIndex, filteredUsers.length)} de {filteredUsers.length}{" "}
                      usuarios
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
      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveUser}
        data={selectedUser}
        type="user"
        availableRoles={availableRoles}
      />
    </div>
  )
}
