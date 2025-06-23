import React, { useEffect, useState } from 'react';
import axios from '../../..//setup/configAxios';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Loader2, Search, Eye } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "../../../components/ui/pagination";
import { toast } from 'react-toastify';
import { useAccountStore } from '../../stores/accountStore';

const PatientListPage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const {
        accounts,
        loading,
        pagination,
        filters,
        fetchAccounts,
        handlePageChange,
        updateFilter,
        handleResetFilters,
        handleViewDetails
    } = useAccountStore();

    useEffect(() => {
        updateFilter('role', 'CUSTOMER');
        fetchAccounts();
    }, [pagination.pageNo, filters.sortDir, filters.sortBy]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        updateFilter('search', value);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Danh sách bệnh nhân</h1>
                    <p className="text-muted-foreground">Xem danh sách các bệnh nhân trong hệ thống</p>
                </div>

                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Tìm theo tên, email hoặc số điện thoại..."
                        className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-md"
                    />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Bệnh nhân</CardTitle>
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
                                                <TableHead className="w-[200px]">Tên</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Số điện thoại</TableHead>
                                                <TableHead>Trạng thái</TableHead>
                                                <TableHead className="text-right">Chi tiết</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {accounts.length > 0 ? (
                                                accounts.map((account) => (
                                                    <TableRow key={account.account_id}>
                                                        <TableCell className="font-medium">
                                                            <div className="flex flex-col">
                                                                <span>{account.first_name} {account.last_name}</span>
                                                                <span className="text-xs text-muted-foreground">ID: {account.account_id}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{account.email}</TableCell>
                                                        <TableCell>{account.phone || 'N/A'}</TableCell>
                                                        <TableCell>
                                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${account.is_locked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                                {account.is_locked ? 'LOCKED' : 'ACTIVE'}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <button
                                                                onClick={() => handleViewDetails(account)}
                                                                className="text-blue-600 hover:underline text-sm"
                                                            >
                                                                <Eye className="inline-block w-4 h-4 mr-1" />Xem
                                                            </button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center py-8">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Search className="h-8 w-8 text-muted-foreground" />
                                                            <p className="text-muted-foreground">Không tìm thấy bệnh nhân nào</p>
                                                            <button
                                                                onClick={handleResetFilters}
                                                                className="text-blue-600 text-sm hover:underline"
                                                            >
                                                                Đặt lại bộ lọc
                                                            </button>
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
                                                        Trang {pagination.pageNo + 1} / {pagination.totalPages}
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
        </div>
    );
};

export default PatientListPage;
