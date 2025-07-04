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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { PlusCircle, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Eye, Loader2, Search } from 'lucide-react';

const TreatmentRegimenManagement = () => {
    const [regimens, setRegimens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentRegimen, setCurrentRegimen] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState(1);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const fetchRegimens = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/v1/treatment-regimens/list?pageNo=0&pageSize=30&sortBy=id&sortDir=asc');
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

    const paginatedData = regimens.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(regimens.length / itemsPerPage);
    const goToPage = (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

    const handleViewDetails = (regimen) => {
        setCurrentRegimen(regimen);
        setSelectedMethod(1);
        setIsViewDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!currentRegimen) return;
        try {
            setIsSubmitting(true);
            await axios.delete(`/api/v1/treatment-regimens?id=${currentRegimen.treatment_regimen_id}`);
            toast.success('Xóa phác đồ thành công');
            setIsDeleteDialogOpen(false);
            setIsViewDialogOpen(false);
            fetchRegimens();
        } catch (error) {
            toast.error('Xóa phác đồ thất bại');
        } finally {
            setIsSubmitting(false);
        }
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
                        </div>
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
                                        <TableHead className="w-[100px]">ID</TableHead>
                                        <TableHead>Tên phác đồ</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead className="text-right">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedData.map((regimen) => (
                                        <TableRow key={regimen.treatment_regimen_id} className="hover:bg-gray-50">
                                            <TableCell className="font-medium">{regimen.treatment_regimen_id}</TableCell>
                                            <TableCell>{regimen.name}</TableCell>
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
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleViewDetails(regimen)}
                                                    className="hover:bg-muted"
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Xem
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
                    <div className="text-sm text-muted-foreground">
                        Hiển thị <strong>{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, regimens.length)}</strong> trong tổng số <strong>{regimens.length}</strong> phác đồ
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" className="h-8 w-8 p-0" onClick={() => goToPage(1)} disabled={currentPage === 1}><ChevronsLeft className="h-4 w-4" /></Button>
                        <Button variant="outline" className="h-8 w-8 p-0" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
                        <div className="text-sm font-medium">Trang {currentPage} / {totalPages}</div>
                        <Button variant="outline" className="h-8 w-8 p-0" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
                        <Button variant="outline" className="h-8 w-8 p-0" onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}><ChevronsRight className="h-4 w-4" /></Button>
                    </div>
                </CardFooter>
            </Card>

            {/* View Detail Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="bg-white max-w-lg border border-gray-300 shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Chi tiết phác đồ</DialogTitle>
                    </DialogHeader>
                    {currentRegimen && (
                        <div className="space-y-4">
                            <p><strong className="text-gray-700">Tên:</strong> {currentRegimen.name}</p>
                            <p><strong className="text-gray-700">Đối tượng áp dụng:</strong> {currentRegimen.applicable}</p>
                            <p><strong className="text-gray-700">Tuyến điều trị:</strong> {currentRegimen.lineLevel}</p>
                            <p><strong className="text-gray-700">Trạng thái:</strong> {currentRegimen.isActive === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}</p>
                            {currentRegimen.note && (
                                <p><strong className="text-gray-700">Lưu ý:</strong> {currentRegimen.note}</p>
                            )}

                            {currentRegimen.treatment_regimen_drugs?.length > 0 && (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block font-medium mb-1">Chọn phương thức điều trị:</label>
                                        <select
                                            value={selectedMethod}
                                            onChange={(e) => setSelectedMethod(parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        >
                                            {currentRegimen.treatment_regimen_drugs.map(drugSet => (
                                                <option key={drugSet.method} value={drugSet.method}>
                                                    Phương thức {drugSet.method}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-2">
                                        <h3 className="font-medium text-blue-800 mb-3">Danh sách thuốc</h3>
                                        <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                                            {currentRegimen.treatment_regimen_drugs.find(d => d.method === selectedMethod)?.drugs.map(drug => (
                                                <li key={drug.drug_id}>{drug.drug_name} ({drug.short_name}) - {drug.drug_type}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="destructive" className="bg-red-600 hover:bg-red-700" onClick={() => setIsDeleteDialogOpen(true)}>
                            Xoá phác đồ
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
                        <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
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
