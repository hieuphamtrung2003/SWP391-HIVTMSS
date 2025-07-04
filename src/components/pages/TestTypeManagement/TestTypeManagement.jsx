import React, { useEffect } from 'react';
import useTestTypeStore from '../../stores/testTypeStore';
import {
    Card, CardHeader, CardTitle, CardContent, CardFooter,
} from 'components/ui/card';
import {
    Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from 'components/ui/table';
import {
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from 'components/ui/dialog';
import {
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from 'components/ui/dropdown-menu';
import {
    Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from 'components/ui/select';
import { Input } from 'components/ui/input';
import { Button } from 'components/ui/button';
import { Textarea } from 'components/ui/textarea';
import { Badge } from 'components/ui/badge';
import {
    Search, PlusCircle, Loader2, Pencil, MoreVertical,
    XCircle, CheckCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
} from 'lucide-react';

const TestTypeManagement = () => {
    const {
        testTypes, filteredTestTypes, loading, currentTestType, formData,
        searchTerm, statusFilter, sortBy, sortDirection, currentPage, itemsPerPage,
        totalPages, isDialogOpen, isSubmitting,
        setSearchTerm, setStatusFilter, setSortBy, setSortDirection,
        setCurrentPage, setFormData, setIsDialogOpen,
        fetchTestTypes, applyFilters, editTestType, submitTestType,
        resetForm, toggleStatus
    } = useTestTypeStore();

    const paginatedData = filteredTestTypes.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        fetchTestTypes();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, statusFilter, sortBy, sortDirection]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitTestType();
    };

    const goToPage = (page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            <div className="flex flex-col space-y-6">
                {/* Header with title and actions */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Quản lý loại xét nghiệm</h1>
                        <p className="text-muted-foreground">
                            Quản lý và xem xét các loại xét nghiệm
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Dialog open={isDialogOpen} onOpenChange={(open) => {
                            if (!open) resetForm();
                            setIsDialogOpen(open);
                        }}>
                            <DialogTrigger asChild>
                                <Button className="gap-2"><PlusCircle className="h-4 w-4" /> Thêm mới</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px] bg-white">
                                <DialogHeader>
                                    <DialogTitle>{currentTestType ? 'Chỉnh sửa loại xét nghiệm' : 'Tạo loại xét nghiệm'}</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <Input name="test_type_name" placeholder="Tên loại xét nghiệm" value={formData.test_type_name} onChange={handleInputChange} required />
                                    <Input name="test_type_code" placeholder="Mã xét nghiệm" value={formData.test_type_code} onChange={handleInputChange} required />
                                    <Input name="applicable" placeholder="Đối tượng áp dụng" value={formData.applicable} onChange={handleInputChange} required />
                                    <Textarea name="test_type_description" placeholder="Mô tả" value={formData.test_type_description} onChange={handleInputChange} rows={3} required />
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Huỷ</Button>
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            {currentTestType ? 'Lưu thay đổi' : 'Tạo mới'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* FILTERS */}
                <Card>
                    <CardHeader>
                        <CardTitle className="">Bộ lọc</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Tìm kiếm</label>
                            <Input
                                placeholder="Tên xét nghiệm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Trạng thái</label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger><SelectValue placeholder="Lọc theo trạng thái" /></SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="ALL">Tất cả</SelectItem>
                                    <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                                    <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Sắp xếp theo</label>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger><SelectValue placeholder="Sort by" /></SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="test_type_id">ID</SelectItem>
                                    <SelectItem value="test_type_name">Tên</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Thứ tự</label>
                            <Select value={sortDirection} onValueChange={setSortDirection}>
                                <SelectTrigger><SelectValue placeholder="Sort direction" /></SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="asc">Tăng dần</SelectItem>
                                    <SelectItem value="desc">Giảm dần</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* TABLE */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className=" ">Danh sách loại xét nghiệm</CardTitle>

                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <div className="rounded-lg border overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-gray-50">
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Tên</TableHead>
                                            <TableHead>Mã</TableHead>
                                            <TableHead>Đối tượng</TableHead>
                                            <TableHead>Trạng thái</TableHead>
                                            <TableHead className="text-right">Thao tác</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedData.length > 0 ? (
                                            paginatedData.map((item) => (
                                                <TableRow key={item.test_type_id} className="hover:bg-gray-50">
                                                    <TableCell>{item.test_type_id}</TableCell>
                                                    <TableCell>{item.test_type_name}</TableCell>
                                                    <TableCell><Badge>{item.test_type_code}</Badge></TableCell>
                                                    <TableCell>{item.applicable}</TableCell>
                                                    <TableCell>
                                                        <Badge className={item.is_active === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                                            {item.is_active === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm"><MoreVertical className="h-4 w-4" /></Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="bg-white">
                                                                <DropdownMenuItem onClick={() => editTestType(item)}>
                                                                    <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => toggleStatus(item.test_type_id, item.is_active)}>
                                                                    {item.is_active === 'ACTIVE' ? (
                                                                        <><XCircle className="mr-2 h-4 w-4" /> Vô hiệu hoá</>
                                                                    ) : (
                                                                        <><CheckCircle className="mr-2 h-4 w-4" /> Kích hoạt</>
                                                                    )}
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                                                    Không có loại xét nghiệm nào
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
                        <div className="text-sm text-muted-foreground">
                            Hiển thị <strong>{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredTestTypes.length)}</strong> trên tổng <strong>{filteredTestTypes.length}</strong> loại xét nghiệm
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => goToPage(1)} disabled={currentPage === 1}><ChevronsLeft className="w-4 h-4" /></Button>
                            <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}><ChevronLeft className="w-4 h-4" /></Button>
                            <div className="text-sm font-medium">Trang {currentPage} / {totalPages}</div>
                            <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}><ChevronRight className="w-4 h-4" /></Button>
                            <Button variant="outline" size="sm" onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}><ChevronsRight className="w-4 h-4" /></Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default TestTypeManagement;
