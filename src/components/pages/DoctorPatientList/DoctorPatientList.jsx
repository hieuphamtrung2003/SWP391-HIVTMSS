import React, { useEffect } from 'react';
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
import { Loader2, Search, Eye, ChevronDown, ChevronUp, Users, ChevronFirst, ChevronLast, Info } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import { useAccountStore } from '../../stores/accountStore';

const PatientListPage = () => {
    const {
        accounts,
        selectedAccount,
        accountDetails,
        loading,
        detailsLoading,
        isDetailsOpen,
        pagination,
        filters,
        fetchAccounts,
        handleViewDetails,
        handlePageChange,
        updateFilter,
        handleResetFilters,
        setIsDetailsOpen,
        setFilters,
        setPagination
    } = useAccountStore();

    // Filter to show only patients (customers)
    const patients = accounts.filter(account =>
        account.role_name === 'CUSTOMER' || account.role_name === 'customer'
    );

    // Calculate patient statistics
    const getPatientStats = () => {
        const active = patients.filter(p => !p.is_locked).length;
        const locked = patients.filter(p => p.is_locked).length;
        return { active, locked };
    };

    // Get page information
    const getPageInfo = () => {
        const start = pagination.pageNo * pagination.pageSize + 1;
        const end = Math.min((pagination.pageNo + 1) * pagination.pageSize, pagination.totalElements);
        return {
            start,
            end,
            total: pagination.totalElements,
            currentPage: pagination.pageNo + 1,
            totalPages: pagination.totalPages
        };
    };

    // Navigation functions
    const canGoPrevious = () => pagination.pageNo > 0;
    const canGoNext = () => pagination.pageNo < pagination.totalPages - 1;

    const goToFirstPage = () => {
        if (canGoPrevious()) {
            handlePageChange(0);
        }
    };

    const goToLastPage = () => {
        if (canGoNext()) {
            handlePageChange(pagination.totalPages - 1);
        }
    };

    // Initialize with customer filter
    useEffect(() => {
        // Set filter to show only customers (patients)
        setFilters({
            ...filters,
            role: 'CUSTOMER'
        });
        fetchAccounts();
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchAccounts();
    };

    // Override updateFilter to maintain customer role filter
    const handleUpdateFilter = (key, value) => {
        if (key === 'role') {
            // Don't allow changing role filter - always keep it as CUSTOMER
            return;
        }
        updateFilter(key, value);
    };

    // Override reset filters to maintain customer role
    const handleResetPatientFilters = () => {
        setFilters({
            role: 'CUSTOMER', // Always keep customer role
            searchTerm: '',
            sortDir: 'asc',
            sortBy: 'id',
        });
        setPagination({
            pageNo: 0,
            pageSize: 10,
            totalPages: 1,
            totalElements: 0,
            last: false,
        });
        fetchAccounts();
    };

    const pageInfo = getPageInfo();
    const patientStats = getPatientStats();

    const StatusBadge = ({ status }) => (
        <Badge
            variant={status === 'ACTIVE' ? 'success' : 'destructive'}
            className="text-xs py-1 px-2 rounded-full"
        >
            {status === 'ACTIVE' ? 'Hoạt động' : 'Khóa'}
        </Badge>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col space-y-6">
                {/* Header with title and stats */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Danh sách bệnh nhân</h1>
                        <p className="text-muted-foreground">
                            Quản lý thông tin {pagination.totalElements} bệnh nhân trong hệ thống
                        </p>
                    </div>
                    {/* <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Info className="h-4 w-4" />
                            <span>Hoạt động: {patientStats.active}</span>
                            <span>•</span>
                            <span>Khóa: {patientStats.locked}</span>
                        </div>
                    </div> */}
                </div>

                {/* Filters Card */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Bộ lọc và tìm kiếm</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Sắp xếp theo</label>
                                <Select
                                    value={filters.sortBy}
                                    onValueChange={(value) => handleUpdateFilter('sortBy', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trường" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        <SelectItem value="id">ID</SelectItem>

                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Thứ tự</label>
                                <Select
                                    value={filters.sortDir}
                                    onValueChange={(value) => handleUpdateFilter('sortDir', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn thứ tự" />
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
                                        placeholder="Tìm theo tên, email, số điện thoại..."
                                        value={filters.searchTerm}
                                        onChange={(e) => handleUpdateFilter('searchTerm', e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button type="submit" disabled={loading}>
                                        <Search className="h-4 w-4 mr-2" />
                                        Tìm
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Patients Table Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Danh sách bệnh nhân
                            </CardTitle>
                            <div className="text-sm text-muted-foreground">
                                {pageInfo.total > 0 ? (
                                    `Hiển thị ${pageInfo.start}-${pageInfo.end} trong ${pageInfo.total} bệnh nhân`
                                ) : (
                                    'Không có bệnh nhân nào'
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="h-8 w-8 animate-spin" />
                                <span className="ml-2">Đang tải...</span>
                            </div>
                        ) : (
                            <>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead className="w-[200px]">Tên</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Số điện thoại</TableHead>
                                                <TableHead>Trạng thái</TableHead>
                                                <TableHead>Ngày tạo</TableHead>
                                                <TableHead className="text-right">Thao tác</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {accounts.length > 0 ? (
                                                accounts.map((patient) => (
                                                    <TableRow key={patient.account_id}>
                                                        <TableCell className="font-medium">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex flex-col">
                                                                    <span>{patient.first_name} {patient.last_name}</span>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        ID: {patient.account_id}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{patient.email}</TableCell>
                                                        <TableCell>{patient.phone || 'N/A'}</TableCell>
                                                        <TableCell>
                                                            <StatusBadge status={patient.is_locked ? 'LOCKED' : 'ACTIVE'} />
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm">
                                                                    {new Date(patient.created_date).toLocaleDateString('vi-VN')}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {new Date(patient.created_date).toLocaleTimeString('vi-VN')}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleViewDetails(patient)}
                                                                className="hover:bg-muted"
                                                            >
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Xem
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-8">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Search className="h-8 w-8 text-muted-foreground" />
                                                            <p className="text-muted-foreground">Không tìm thấy bệnh nhân nào</p>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={handleResetPatientFilters}
                                                            >
                                                                Đặt lại bộ lọc
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Enhanced Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="text-sm text-muted-foreground">
                                            Trang {pageInfo.currentPage} / {pageInfo.totalPages}
                                            ({pageInfo.total} bản ghi)
                                        </div>

                                        <Pagination>
                                            <PaginationContent>
                                                {/* First Page */}
                                                <PaginationItem>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={goToFirstPage}
                                                        disabled={!canGoPrevious()}
                                                    >
                                                        <ChevronFirst className="h-4 w-4" />
                                                    </Button>
                                                </PaginationItem>

                                                {/* Previous Page */}
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        onClick={() => handlePageChange(pagination.pageNo - 1)}
                                                        disabled={!canGoPrevious()}
                                                    />
                                                </PaginationItem>

                                                {/* Page Numbers */}
                                                {(() => {
                                                    const currentPage = pagination.pageNo;
                                                    const totalPages = pagination.totalPages;
                                                    const pages = [];

                                                    // Show max 5 pages around current page
                                                    let start = Math.max(0, currentPage - 2);
                                                    let end = Math.min(totalPages - 1, currentPage + 2);

                                                    // Adjust if we're near the beginning or end
                                                    if (end - start < 4) {
                                                        if (start === 0) {
                                                            end = Math.min(totalPages - 1, 4);
                                                        } else if (end === totalPages - 1) {
                                                            start = Math.max(0, totalPages - 5);
                                                        }
                                                    }

                                                    for (let i = start; i <= end; i++) {
                                                        pages.push(
                                                            <PaginationItem key={i}>
                                                                <Button
                                                                    variant={i === currentPage ? "default" : "outline"}
                                                                    size="sm"
                                                                    onClick={() => handlePageChange(i)}
                                                                    className="min-w-[40px]"
                                                                >
                                                                    {i + 1}
                                                                </Button>
                                                            </PaginationItem>
                                                        );
                                                    }

                                                    return pages;
                                                })()}

                                                {/* Next Page */}
                                                <PaginationItem>
                                                    <PaginationNext
                                                        onClick={() => handlePageChange(pagination.pageNo + 1)}
                                                        disabled={!canGoNext()}
                                                    />
                                                </PaginationItem>

                                                {/* Last Page */}
                                                <PaginationItem>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={goToLastPage}
                                                        disabled={!canGoNext()}
                                                    >
                                                        <ChevronLast className="h-4 w-4" />
                                                    </Button>
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

            {/* Patient Details Dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-3xl bg-white">
                    <DialogHeader>
                        <DialogTitle>Thông tin bệnh nhân</DialogTitle>
                        <DialogDescription>
                            Chi tiết thông tin của bệnh nhân {selectedAccount?.first_name} {selectedAccount?.last_name}
                        </DialogDescription>
                    </DialogHeader>
                    {detailsLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <span className="ml-2">Đang tải thông tin...</span>
                        </div>
                    ) : (
                        accountDetails && (
                            <div className="space-y-4">
                                {/* Basic Info Section */}
                                <div>
                                    <h3 className="font-semibold mb-3">Thông tin cơ bản</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <p className="text-sm">
                                                <span className="font-medium text-muted-foreground">ID:</span>
                                                <span className="ml-2 font-mono">{accountDetails.account_id}</span>
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium text-muted-foreground">Họ tên:</span>
                                                <span className="ml-2">
                                                    {accountDetails.last_name} {accountDetails.first_name}
                                                </span>
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium text-muted-foreground">Email:</span>
                                                <span className="ml-2">{accountDetails.email}</span>
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium text-muted-foreground">Địa chỉ:</span>
                                                <span className="ml-2">{accountDetails.address || 'Chưa cập nhật'}</span>
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm">
                                                <span className="font-medium text-muted-foreground">Giới tính:</span>
                                                <span className="ml-2">
                                                    {accountDetails.gender === 'MALE' ? 'Nam' :
                                                        accountDetails.gender === 'FEMALE' ? 'Nữ' :
                                                            accountDetails.gender === 'OTHER' ? 'Khác' : 'Chưa cập nhật'}
                                                </span>
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium text-muted-foreground">Số điện thoại:</span>
                                                <span className="ml-2">{accountDetails.phone || 'Chưa cập nhật'}</span>
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium text-muted-foreground">Ngày sinh:</span>
                                                <span className="ml-2">
                                                    {accountDetails.dob ? new Date(accountDetails.dob).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                                                </span>
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium text-muted-foreground">Trạng thái:</span>
                                                <span className="ml-2">
                                                    <StatusBadge status={accountDetails.is_locked ? 'LOCKED' : 'ACTIVE'} />
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Account Info Section */}
                                <div>
                                    <h3 className="font-semibold mb-3">Thông tin tài khoản</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <p className="text-sm">
                                                <span className="font-medium text-muted-foreground">Ngày tạo:</span>
                                                <span className="ml-2">
                                                    {new Date(accountDetails.created_date).toLocaleDateString('vi-VN')} {new Date(accountDetails.created_date).toLocaleTimeString('vi-VN')}
                                                </span>
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium text-muted-foreground">Cập nhật lần cuối:</span>
                                                <span className="ml-2">
                                                    {accountDetails.updated_date ?
                                                        `${new Date(accountDetails.updated_date).toLocaleDateString('vi-VN')} ${new Date(accountDetails.updated_date).toLocaleTimeString('vi-VN')}` :
                                                        'Chưa cập nhật'
                                                    }
                                                </span>
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm">
                                                <span className="font-medium text-muted-foreground">Vai trò:</span>
                                                <span className="ml-2">
                                                    <Badge variant="outline" className="border-green-500 text-green-600">
                                                        Bệnh nhân
                                                    </Badge>
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Section */}
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsDetailsOpen(false)}
                                    >
                                        Đóng
                                    </Button>
                                </div>
                            </div>
                        )
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PatientListPage;