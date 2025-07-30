import React, { useEffect } from 'react';
import axios from '../../..//setup/configAxios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "../../../components/ui/pagination";
import { toast } from 'react-toastify';
import { Loader2, Search, PlusCircle, RefreshCw, Eye, ChevronDown, ChevronUp, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import { Label } from 'recharts';
import { Link, useNavigate } from "react-router-dom";
import { useAccountStore } from '../../stores/accountStore';

const AccountManagementPage = () => {
  const navigate = useNavigate();
  const {
    accounts,
    selectedAccount,
    accountDetails,
    loading,
    detailsLoading,
    isDetailsOpen,
    isCreateOpen,
    isEditMode,
    pagination,
    filters,
    formValue,
    editFormData,
    fetchAccounts,
    fetchAccountDetails,
    handleViewDetails,
    handlePageChange,
    updateFilter,
    handleResetFilters,
    handleUpdateAccount,
    handleCreateStaff,
    setFormValue,
    setEditFormData,
    setIsEditMode,
    setIsDetailsOpen,
    setIsCreateOpen,
    setFilters
  } = useAccountStore();

  useEffect(() => {
    fetchAccounts();
  }, [pagination.pageNo, filters.role, filters.sortDir, filters.sortBy]);

  const handleRoleFilterChange = (value) => {
    updateFilter('role', value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAccounts();
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleRoleChange = (value) => {
    setEditFormData({
      ...editFormData,
      role_id: parseInt(value),
    });
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  const formatRole = (role) => {
    switch (role) {
      case 'CUSTOMER': return 'Bệnh nhân';
      case 'DOCTOR': return 'Bác sĩ';
      case 'ADMIN': return 'Admin';
      case 'MANAGER': return 'Quản lý';
      default: return role;
    }
  };

  const StatusBadge = ({ status }) => (
    <Badge
      variant={status === 'ACTIVE' ? 'success' : 'destructive'}
      className="text-xs py-1 px-2 rounded-full"
    >
      {status}
    </Badge>
  );

  const RoleBadge = ({ role }) => (
    <Badge
      variant="outline"
      className={`text-xs py-1 px-2 rounded-full ${role === 'ADMIN' ? 'border-purple-500 text-purple-600' :
        role === 'DOCTOR' ? 'border-blue-500 text-blue-600' :
          role === 'CUSTOMER' ? 'border-green-500 text-green-600' :
            'border-gray-500 text-gray-600'
        }`}
    >
      {formatRole(role)}
    </Badge>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Header with title and actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Quản lý tài khoản</h1>
            <p className="text-muted-foreground">
              Quản lý và theo dõi thông tin tài khoản của nhân viên, bác sĩ và bệnh nhân.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsCreateOpen(true)}>
              <User className="h-4 w-4 mr-2" />
              Tạo nhân viên
            </Button>
          </div>
        </div>

        {/* Filters Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Role</label>
                <Select value={filters.role} onValueChange={handleRoleFilterChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="ALL">Vai trò</SelectItem>
                    <SelectItem value="CUSTOMER">Bệnh nhân</SelectItem>
                    <SelectItem value="DOCTOR">Bác sĩ</SelectItem>
                    <SelectItem value="MANAGER">Quản lý</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Sắp xếp theo</label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => updateFilter('sortBy', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="id">ID</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Sắp xếp</label>
                <Select
                  value={filters.sortDir}
                  onValueChange={(value) => updateFilter('sortDir', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select direction" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="asc">
                      <div className="flex items-center gap-2">
                        <ChevronUp className="h-4 w-4" />
                        <span>Tăng dần</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="desc">
                      <div className="flex items-center gap-2">
                        <ChevronDown className="h-4 w-4" />
                        <span>Giảm dần</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Tìm kiếm</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Tìm kiếm email"
                    value={filters.searchTerm}
                    onChange={(e) => updateFilter('searchTerm', e.target.value)}
                  />
                  <Button type="submit">
                    <Search className="h-4 w-4 mr-2" />
                    Tìm kiếm
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Accounts Table Card */}
        <Card>
          <CardHeader>
            <CardTitle>Tài khoản</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="w-[200px]">Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Số điện thoại</TableHead>
                        <TableHead>Vai trò</TableHead>
                        <TableHead>Trang thái</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accounts.length > 0 ? (
                        accounts.map((account) => (
                          <TableRow key={account.account_id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <div className="flex flex-col">
                                  <span>{account.first_name} {account.last_name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    ID: {account.account_id}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{account.email}</TableCell>
                            <TableCell>{account.phone || 'N/A'}</TableCell>
                            <TableCell>
                              <RoleBadge role={account.role_name} />
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={account.is_locked ? 'Bị khóa' : 'Đang hoạt động'} />
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-sm">
                                  {new Date(account.created_date).toLocaleDateString()}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(account.created_date).toLocaleTimeString()}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetails(account)}
                                className="hover:bg-muted"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Xem chi tiết
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <div className="flex flex-col items-center gap-2">
                              <Search className="h-8 w-8 text-muted-foreground" />
                              <p className="text-muted-foreground">Không có tài khoản tìm thất</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleResetFilters}
                              >
                                Xóa lọc
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => handlePageChange(pagination.pageNo - 1)}
                            disabled={pagination.pageNo === 0}
                          />
                        </PaginationItem>

                        <PaginationItem>
                          <span className="text-sm text-muted-foreground">
                            Page {pagination.pageNo + 1} of {pagination.totalPages}
                          </span>
                        </PaginationItem>

                        <PaginationItem>
                          <PaginationNext
                            onClick={() => handlePageChange(pagination.pageNo + 1)}
                            disabled={pagination.pageNo === pagination.totalPages - 1 || pagination.last}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Account Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-3xl bg-white">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Chỉnh sửa tài khoản' : 'Thông tin tài khoản'}
            </DialogTitle>
            <DialogDescription>
              {isEditMode ? (
                'Cập nhật thông tin tài khoản'
              ) : (
                `Thông tin chi tiết về ${selectedAccount?.first_name} ${selectedAccount?.last_name}`
              )}
            </DialogDescription>
          </DialogHeader>
          {detailsLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            accountDetails && (
              <div className="space-y-4">
                {/* Basic Info Section */}
                <div>
                  <h3 className="font-semibold mb-3">Thông tin</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium text-muted-foreground">ID:</span>
                        <span className="ml-2 font-mono">{accountDetails.account_id}</span>
                      </p>
                      <div className="text-sm">
                        <Label className="font-medium text-muted-foreground">Tên:</Label>
                        {isEditMode ? (
                          <div className="flex gap-2">
                            <Input
                              name="last_name"
                              value={editFormData.last_name}
                              onChange={handleEditFormChange}
                              placeholder="Last name"
                              className="mt-1"
                            />
                            <Input
                              name="first_name"
                              value={editFormData.first_name}
                              onChange={handleEditFormChange}
                              placeholder="First name"
                              className="mt-1"
                            />
                          </div>
                        ) : (
                          <p className="text-sm">
                            <span className="font-medium text-muted-foreground">Họ và tên:</span>
                            <span className="ml-2">{accountDetails.last_name} {accountDetails.first_name}</span>
                          </p>
                        )}
                      </div>
                      <p className="text-sm">
                        <span className="font-medium text-muted-foreground">Email:</span>
                        <span className="ml-2">{accountDetails.email}</span>
                      </p>
                      <div className="text-sm">
                        <Label className="font-medium text-muted-foreground">Địa chỉ:</Label>
                        {isEditMode ? (
                          <Input
                            name="address"
                            value={editFormData.address}
                            onChange={handleEditFormChange}
                            className="mt-1"
                          />
                        ) : (
                          <span className="text-sm">
                            <span className="font-medium text-muted-foreground">Địa chỉ: </span>
                            {accountDetails.address || 'N/A'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <Label className="font-medium text-muted-foreground">Giới tính:</Label>
                        {isEditMode ? (
                          <Select
                            name="gender"
                            value={editFormData.gender}
                            onValueChange={(value) => setEditFormData({ ...editFormData, gender: value })}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem value="MALE">Nam</SelectItem>
                              <SelectItem value="FEMALE">Nữ</SelectItem>
                              <SelectItem value="OTHER">Giới tính khác</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="ml-2">{accountDetails.gender || 'N/A'}</span>
                        )}
                      </div>
                      <div className="text-sm">
                        <Label className="font-medium text-muted-foreground">Số điện thoại:</Label>
                        {isEditMode ? (
                          <Input
                            name="phone"
                            value={editFormData.phone}
                            onChange={handleEditFormChange}
                            className="mt-1"
                          />
                        ) : (
                          <span className="ml-2">{accountDetails.phone || 'N/A'}</span>
                        )}
                      </div>
                      <div className="text-sm">
                        <Label className="font-medium text-muted-foreground">Vai trò:</Label>
                        {isEditMode ? (
                          <Select
                            value={editFormData.role_id.toString()}
                            onValueChange={handleRoleChange}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem value="1">Bệnh nhân</SelectItem>
                              <SelectItem value="2">Bác sĩ</SelectItem>
                              <SelectItem value="3">Quản lý</SelectItem>
                              <SelectItem value="4">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="ml-2">
                            <RoleBadge role={accountDetails.role_name} />
                          </span>
                        )}
                      </div>
                      <div className="text-sm">
                        <Label className="font-medium text-muted-foreground">Ngày tháng sinh:</Label>
                        {isEditMode ? (
                          <Input
                            type="date"
                            name="dob"
                            value={editFormData.dob}
                            onChange={handleEditFormChange}
                            className="mt-1"
                          />
                        ) : (
                          <span className="ml-2">
                            {accountDetails.dob ? new Date(accountDetails.dob).toLocaleDateString() : 'N/A'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Section */}
                <div className="flex justify-end gap-2">
                  {isEditMode ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditMode(false)}
                        disabled={detailsLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleUpdateAccount}
                        disabled={detailsLoading}
                      >
                        {detailsLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setIsDetailsOpen(false)}
                      >
                        Close
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setIsEditMode(true);
                          setEditFormData({
                            last_name: accountDetails.last_name,
                            first_name: accountDetails.first_name,
                            gender: accountDetails.gender || '',
                            phone: accountDetails.phone || '',
                            address: accountDetails.address || '',
                            dob: accountDetails.dob || '',
                            role_id: accountDetails.role_id,
                          });
                        }}
                      >
                        Chỉnh sửa
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>

      {/* Create Staff Account Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle>Tạo nhân viên mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin để tạo tài khoản nhân viên mới. Mật khẩu sẽ được tạo tự động.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleCreateStaff}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tên họ</Label>
                <Input
                  name="first_name"
                  placeholder="First Name"
                  value={formValue.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Tên</Label>
                <Input
                  name="last_name"
                  placeholder="Last Name"
                  value={formValue.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formValue.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Số điện thoại</Label>
                <Input
                  name="phone"
                  placeholder="Phone Number"
                  value={formValue.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Thông tin</Label>
                <Input
                  name="address"
                  placeholder="Address"
                  value={formValue.address}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Vai trò</Label>
                <Select
                  value={formValue.role_name}
                  onValueChange={(value) => setFormValue({ ...formValue, role_name: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DOCTOR">Bác sĩ</SelectItem>
                    <SelectItem value="MANAGER">Quản lý</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Hủy
              </Button>
              <Button type="submit">
                Tạo
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountManagementPage;