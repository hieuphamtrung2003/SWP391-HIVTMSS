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
      case 'CUSTOMER': return 'Patient';
      case 'DOCTOR': return 'Doctor';
      case 'ADMIN': return 'Admin';
      case 'MANAGER': return 'Manager';
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
            <h1 className="text-2xl font-bold tracking-tight">Account Management</h1>
            <p className="text-muted-foreground">
              Manage and review all system accounts
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsCreateOpen(true)}>
              <User className="h-4 w-4 mr-2" />
              Create Staff
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
                    <SelectItem value="ALL">All Roles</SelectItem>
                    <SelectItem value="CUSTOMER">Patients</SelectItem>
                    <SelectItem value="DOCTOR">Doctors</SelectItem>
                    <SelectItem value="MANAGER">Managers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Sort By</label>
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
                <label className="text-sm font-medium text-muted-foreground">Sort Direction</label>
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
                        <span>Ascending</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="desc">
                      <div className="flex items-center gap-2">
                        <ChevronDown className="h-4 w-4" />
                        <span>Descending</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Search</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search by name, email or phone..."
                    value={filters.searchTerm}
                    onChange={(e) => updateFilter('searchTerm', e.target.value)}
                  />
                  <Button type="submit">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Accounts Table Card */}
        <Card>
          <CardHeader>
            <CardTitle>Accounts</CardTitle>
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
                        <TableHead>Phone</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
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
                              <StatusBadge status={account.is_locked ? 'LOCKED' : 'ACTIVE'} />
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
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <div className="flex flex-col items-center gap-2">
                              <Search className="h-8 w-8 text-muted-foreground" />
                              <p className="text-muted-foreground">No accounts found</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleResetFilters}
                              >
                                Reset filters
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
              {isEditMode ? 'Edit Account' : 'Account Details'}
            </DialogTitle>
            <DialogDescription>
              {isEditMode ? (
                'Update the account information'
              ) : (
                `Detailed information about ${selectedAccount?.first_name} ${selectedAccount?.last_name}`
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
                  <h3 className="font-semibold mb-3">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium text-muted-foreground">ID:</span>
                        <span className="ml-2 font-mono">{accountDetails.account_id}</span>
                      </p>
                      <div className="text-sm">
                        <Label className="font-medium text-muted-foreground">Name:</Label>
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
                          <span className="ml-2">
                            {accountDetails.last_name} {accountDetails.first_name}
                          </span>
                        )}
                      </div>
                      <p className="text-sm">
                        <span className="font-medium text-muted-foreground">Email:</span>
                        <span className="ml-2">{accountDetails.email}</span>
                      </p>
                      <div className="text-sm">
                        <Label className="font-medium text-muted-foreground">Address:</Label>
                        {isEditMode ? (
                          <Input
                            name="address"
                            value={editFormData.address}
                            onChange={handleEditFormChange}
                            className="mt-1"
                          />
                        ) : (
                          <span className="ml-2">
                            {accountDetails.address || 'N/A'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <Label className="font-medium text-muted-foreground">Gender:</Label>
                        {isEditMode ? (
                          <Select
                            name="gender"
                            value={editFormData.gender}
                            onValueChange={(value) => setEditFormData({ ...editFormData, gender: value })}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MALE">Male</SelectItem>
                              <SelectItem value="FEMALE">Female</SelectItem>
                              <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="ml-2">{accountDetails.gender || 'N/A'}</span>
                        )}
                      </div>
                      <div className="text-sm">
                        <Label className="font-medium text-muted-foreground">Phone:</Label>
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
                        <Label className="font-medium text-muted-foreground">Role:</Label>
                        {isEditMode ? (
                          <Select
                            value={editFormData.role_id.toString()}
                            onValueChange={handleRoleChange}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Patient</SelectItem>
                              <SelectItem value="2">Doctor</SelectItem>
                              <SelectItem value="3">Manager</SelectItem>
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
                        <Label className="font-medium text-muted-foreground">Date of Birth:</Label>
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
                        Edit
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
            <DialogTitle>Register New Staff</DialogTitle>
            <DialogDescription>
              Create a new Doctor or Manager account. Password will be auto-generated.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleCreateStaff}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  name="first_name"
                  placeholder="First Name"
                  value={formValue.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
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
                <Label>Phone</Label>
                <Input
                  name="phone"
                  placeholder="Phone Number"
                  value={formValue.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Address</Label>
                <Input
                  name="address"
                  placeholder="Address"
                  value={formValue.address}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Role</Label>
                <Select
                  value={formValue.role_name}
                  onValueChange={(value) => setFormValue({ ...formValue, role_name: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DOCTOR">Doctor</SelectItem>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Register
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountManagementPage;