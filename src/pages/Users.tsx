import React, { useEffect, useState } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Card,
  CardBody,
  Select,
  SelectItem,
  Avatar
} from '@heroui/react'
import {
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { useAppStore } from '../store/appStore'
import { UserProfile } from '../types'
import { toast } from 'sonner'

const statusColorMap = {
  active: 'success',
  inactive: 'danger',
  pending: 'warning'
} as const

const statusOptions = [
  { key: 'all', label: 'Todos' },
  { key: 'active', label: 'Ativo' },
  { key: 'inactive', label: 'Inativo' },
  { key: 'pending', label: 'Pendente' }
]

const roleOptions = [
  { key: 'all', label: 'Todas' },
  { key: 'admin', label: 'Administrador' },
  { key: 'user', label: 'Usuário' },
  { key: 'moderator', label: 'Moderador' }
]

export default function Users() {
  const {
    users,
    usersLoading: isLoading,
    usersError: error,
    createUser,
    updateUser,
    deleteUser,
    fetchUsers
  } = useAppStore()
  
  const [filterValue, setFilterValue] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { 
    isOpen: isDeleteOpen, 
    onOpen: onDeleteOpen, 
    onClose: onDeleteClose 
  } = useDisclosure()
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: 'user',
    status: 'active'
  })
  
  const rowsPerPage = 10
  
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])
  
  const filteredUsers = React.useMemo(() => {
    let filtered = users
    
    if (filterValue) {
      filtered = filtered.filter(user => 
        user.full_name?.toLowerCase().includes(filterValue.toLowerCase()) ||
        user.email.toLowerCase().includes(filterValue.toLowerCase())
      )
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter)
    }
    
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }
    
    return filtered
  }, [users, filterValue, statusFilter, roleFilter])
  
  const pages = Math.ceil(filteredUsers.length / rowsPerPage)
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage
    return filteredUsers.slice(start, end)
  }, [page, filteredUsers])
  
  const handleOpenModal = (user?: UserProfile) => {
    if (user) {
      setSelectedUser(user)
      setFormData({
        full_name: user.full_name || '',
        email: user.email,
        role: user.role,
        status: user.status
      })
      setIsEditing(true)
    } else {
      setSelectedUser(null)
      setFormData({
        full_name: '',
        email: '',
        role: 'user',
        status: 'active'
      })
      setIsEditing(false)
    }
    onOpen()
  }
  
  const handleEdit = (user: UserProfile) => {
    handleOpenModal(user)
  }
  
  const handleSaveUser = async () => {
    try {
      const userData = {
        full_name: formData.full_name,
        email: formData.email,
        role: formData.role as 'user' | 'admin' | 'moderator',
        status: formData.status as 'active' | 'inactive' | 'pending'
      }
      
      if (isEditing && selectedUser) {
        await updateUser(selectedUser.id, userData)
      } else {
        await createUser(userData)
      }
      onClose()
      setFormData({ full_name: '', email: '', role: 'user', status: 'active' })
      fetchUsers()
      toast.success(isEditing ? 'Usuário atualizado!' : 'Usuário criado!')
    } catch (error) {
      toast.error('Erro ao salvar usuário')
    }
  }
  
  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        await deleteUser(selectedUser.id)
        toast.success('Usuário excluído com sucesso!')
        onDeleteClose()
        fetchUsers()
      } catch (error) {
        toast.error('Erro ao excluir usuário')
      }
    }
  }
  
  const handleOpenDeleteModal = (user: UserProfile) => {
    setSelectedUser(user)
    onDeleteOpen()
  }
  
  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por nome ou email..."
            startContent={<MagnifyingGlassIcon className="h-4 w-4" />}
            value={filterValue}
            onClear={() => setFilterValue('')}
            onValueChange={setFilterValue}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button 
                  endContent={<FunnelIcon className="h-4 w-4" />} 
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Filtro de status"
                closeOnSelect={false}
                selectedKeys={[statusFilter]}
                selectionMode="single"
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string
                  setStatusFilter(selected)
                }}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.key}>
                    {status.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button 
                  endContent={<FunnelIcon className="h-4 w-4" />} 
                  variant="flat"
                >
                  Função
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Filtro de função"
                closeOnSelect={false}
                selectedKeys={[roleFilter]}
                selectionMode="single"
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string
                  setRoleFilter(selected)
                }}
              >
                {roleOptions.map((role) => (
                  <DropdownItem key={role.key}>
                    {role.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            
            <Button 
              color="primary" 
              endContent={<PlusIcon className="h-4 w-4" />}
              onPress={() => handleOpenModal()}
            >
              Adicionar Usuário
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total: {filteredUsers.length} usuários
          </span>
        </div>
      </div>
    )
  }, [filterValue, statusFilter, roleFilter, filteredUsers.length])
  
  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {filteredUsers.length > 0 
            ? `${(page - 1) * rowsPerPage + 1}-${Math.min(page * rowsPerPage, filteredUsers.length)} de ${filteredUsers.length}`
            : '0 usuários'
          }
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    )
  }, [page, pages, filteredUsers.length])
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Usuários</h1>
          <p className="text-gray-600 mt-1">Gerencie usuários do sistema</p>
        </div>
      </div>
      
      <Card>
        <CardBody className="p-0">
          <Table
            aria-label="Tabela de usuários"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
              wrapper: "max-h-[382px]",
            }}
            topContent={topContent}
            topContentPlacement="outside"
          >
            <TableHeader>
              <TableColumn key="user">USUÁRIO</TableColumn>
              <TableColumn key="role">FUNÇÃO</TableColumn>
              <TableColumn key="status">STATUS</TableColumn>
              <TableColumn key="created">CRIADO EM</TableColumn>
              <TableColumn key="actions">AÇÕES</TableColumn>
            </TableHeader>
            <TableBody 
              items={items}
              isLoading={isLoading}
              loadingContent={<div>Carregando...</div>}
              emptyContent={"Nenhum usuário encontrado"}
            >
              {(item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <User
                      avatarProps={{
                        radius: "lg",
                        src: item.avatar_url || undefined,
                        name: item.full_name || item.email
                      }}
                      description={item.email}
                      name={item.full_name || 'Sem nome'}
                    >
                      {item.email}
                    </User>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <p className="text-bold text-sm capitalize">{item.role}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      className="capitalize" 
                      color={statusColorMap[item.status as keyof typeof statusColorMap]} 
                      size="sm" 
                      variant="flat"
                    >
                      {item.status === 'active' ? 'Ativo' : 
                       item.status === 'inactive' ? 'Inativo' : 'Pendente'}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {new Date(item.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="relative flex justify-end items-center gap-2">
                      <Dropdown>
                        <DropdownTrigger>
                          <Button isIconOnly size="sm" variant="light">
                            <EllipsisVerticalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                          <DropdownItem
                            key="view"
                            startContent={<EyeIcon className="h-4 w-4" />}
                          >
                            Visualizar
                          </DropdownItem>
                          <DropdownItem
                            key="edit"
                            startContent={<PencilIcon className="h-4 w-4" />}
                            onPress={() => handleEdit(item)}
                          >
                            Editar
                          </DropdownItem>
                          <DropdownItem
                            key="delete"
                            className="text-danger"
                            color="danger"
                            startContent={<TrashIcon className="h-4 w-4" />}
                            onPress={() => handleOpenDeleteModal(item)}
                          >
                            Excluir
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
      
      {/* Modal de Criação/Edição */}
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Nome Completo"
                  placeholder="Digite o nome completo"
                  variant="bordered"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                />
                <Input
                  label="Email"
                  placeholder="Digite o email"
                  type="email"
                  variant="bordered"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <Select
                  label="Função"
                  placeholder="Selecione a função"
                  variant="bordered"
                  selectedKeys={[formData.role]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string
                    setFormData({...formData, role: selected})
                  }}
                >
                  <SelectItem key="user">Usuário</SelectItem>
                <SelectItem key="admin">Administrador</SelectItem>
                <SelectItem key="moderator">Moderador</SelectItem>
                </Select>
                <Select
                  label="Status"
                  placeholder="Selecione o status"
                  variant="bordered"
                  selectedKeys={[formData.status]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string
                    setFormData({...formData, status: selected})
                  }}
                >
                  <SelectItem key="active">Ativo</SelectItem>
                  <SelectItem key="inactive">Inativo</SelectItem>
                  <SelectItem key="pending">Pendente</SelectItem>
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={handleSaveUser}>
                  {isEditing ? 'Atualizar' : 'Criar'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      
      {/* Modal de Confirmação de Exclusão */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirmar Exclusão
              </ModalHeader>
              <ModalBody>
                <p>
                  Tem certeza que deseja excluir o usuário{' '}
                  <strong>{selectedUser?.full_name || selectedUser?.email}</strong>?
                </p>
                <p className="text-small text-danger">
                  Esta ação não pode ser desfeita.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="flat" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="danger" onPress={handleDeleteUser}>
                  Excluir
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}