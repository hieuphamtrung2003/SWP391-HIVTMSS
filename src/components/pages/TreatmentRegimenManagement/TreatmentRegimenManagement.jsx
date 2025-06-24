import React, { useEffect, useState } from 'react';
import axios from 'setup/configAxios';
import { toast } from 'react-toastify';
import {
    Card, CardContent, CardFooter, CardHeader, CardTitle
} from '../../../components/ui/card';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { PlusCircle, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Pencil, Trash2, MoreVertical, Loader2, Search } from 'lucide-react';

const TreatmentRegimenManagement = () => {

    const [regimens, setRegimens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentRegimen, setCurrentRegimen] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const totalPages = Math.ceil(regimens.length / itemsPerPage);

    //Fetch Data
    const fetchRegimens = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/v1/treatment-regimens/list?pageNo=0&pageSize=20&sortBy=id&sortDir=asc');
            setRegimens(response.data.content);
        } catch (error) {
            toast.error('Không thể tải danh sách phác đồ');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegimens();
    }, []);


    const handleDelete = async () => {
        if (!currentRegimen) return;
        try {
            setIsSubmitting(true);
            await axios.delete(`/api/v1/treatment-regimens/delete?id=${currentRegimen.treatment_regimen_id}`);
            toast.success('Xóa phác đồ thành công');
            fetchRegimens();
            setIsDeleteDialogOpen(false);
        } catch (error) {
            toast.error('Xóa phác đồ thất bại');
        } finally {
            setIsSubmitting(false);
        }
    };


    const paginatedData = regimens.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const goToPage = (page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };


    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="shadow-sm">
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <CardTitle className="text-2xl font-bold">Quản lý phác đồ điều trị</CardTitle>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm kiếm tên phác đồ..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="gap-2">
                                        <PlusCircle className="h-4 w-4" />
                                        Thêm mới
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px] bg-white">
                                    <DialogHeader>
                                        <DialogTitle>Tạo phác đồ điều trị</DialogTitle>
                                    </DialogHeader>
                                    <form className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Tên phác đồ</label>
                                            <Input placeholder="VD: Phác đồ ưu tiên" required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Đối tượng áp dụng</label>
                                            <Input placeholder="VD: Adults, pregnant women, adolescents" required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Tuyến điều trị</label>
                                            <Input placeholder="VD: FIRST_LINE" required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
                                            <Input placeholder="Lưu ý đặc biệt (nếu có)" />
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                                Huỷ
                                            </Button>
                                            <Button type="submit">
                                                Tạo mới
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </CardHeader>

                {/* Table Content */}
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
                                        <TableHead className="w-[100px]">ID</TableHead>
                                        <TableHead>Tên phác đồ</TableHead>
                                        <TableHead>Tuyến điều trị</TableHead>
                                        <TableHead>Đối tượng áp dụng</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead className="text-right">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedData.length > 0 ? (
                                        paginatedData.map((regimen) => (
                                            <TableRow key={regimen.treatment_regimen_id} className="hover:bg-gray-50">
                                                <TableCell className="font-medium">{regimen.treatment_regimen_id}</TableCell>
                                                <TableCell>{regimen.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{regimen.lineLevel}</Badge>
                                                </TableCell>
                                                <TableCell>{regimen.applicable}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={regimen.isActive === 'ACTIVE' ? 'default' : 'secondary'}
                                                        className={regimen.isActive === 'ACTIVE'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'}
                                                    >
                                                        {regimen.isActive === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-white">
                                                            <DropdownMenuItem onClick={() => setCurrentRegimen(regimen)}>
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Chỉnh sửa
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setCurrentRegimen(regimen);
                                                                    setIsDeleteDialogOpen(true);
                                                                }}
                                                                className="text-red-600"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Xoá
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center h-24">
                                                Không có phác đồ điều trị nào
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>

                {/* Pagination */}
                {regimens.length > 0 && (
                    <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
                        <div className="text-sm text-muted-foreground">
                            Hiển thị <strong>{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, regimens.length)}</strong> trong tổng số <strong>{regimens.length}</strong> phác đồ
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => goToPage(1)} disabled={currentPage === 1}>
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" className="h-8 w-8 p-0" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="text-sm font-medium">
                                Trang {currentPage} / {totalPages}
                            </div>
                            <Button variant="outline" className="h-8 w-8 p-0" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardFooter>
                )}
            </Card>

            {/* Delete confirmation dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white">
                    <DialogHeader>
                        <DialogTitle>Xác nhận xoá</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        Bạn có chắc chắn muốn xoá phác đồ <strong>{currentRegimen?.name}</strong>? Hành động này không thể hoàn tác.
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
                            Huỷ
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Xoá
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TreatmentRegimenManagement;
