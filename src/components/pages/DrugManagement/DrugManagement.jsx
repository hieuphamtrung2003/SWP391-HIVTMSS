// File: DrugManagement.jsx
import React, { useEffect, useState } from 'react';
import axios from 'setup/configAxios';
import { toast } from 'react-toastify';
import Select from 'react-select';
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
import { PlusCircle, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Eye, Loader2, Search, Trash2, Edit, Save } from 'lucide-react';

const DrugManagement = () => {
    const [drugs, setDrugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentDrug, setCurrentDrug] = useState(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createForm, setCreateForm] = useState({
        drug_id: '',
        name: '',
        short_name: '',
        type: '',
        is_active: 'ACTIVE',
        create_date: ''
    });
    const [editForm, setEditForm] = useState({
        drug_id: '',
        name: '',
        short_name: '',
        type: '',
        is_active: 'ACTIVE',
        create_date: ''
    });

    // Drug type options
    const drugTypeOptions = [
        { value: 'NRTIs', label: 'NRTIs (Ức chế men sao chép ngược Nucleoside)' },
        { value: 'NtRTIs', label: 'NtRTIs (Ức chế men sao chép ngược Nucleotide)' },
        { value: 'NNRTIs', label: 'NNRTIs (Ức chế men sao chép ngược không Nucleoside)' },
        { value: 'PIs', label: 'PIs (Ức chế Protease)' },
        { value: 'INSTIs', label: 'INSTIs (Ức chế men tích hợp)' }
    ];

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        fetchDrugs();
    }, []);

    const fetchDrugs = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/v1/drugs/all');
            setDrugs(res || []);
        } catch {
            toast.error('Không thể tải danh sách thuốc');
        } finally {
            setLoading(false);
        }
    };

    const filteredDrugs = drugs.filter(d =>
        d.drug_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalPages = Math.ceil(filteredDrugs.length / itemsPerPage);
    const paginatedData = filteredDrugs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const goToPage = (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

    const handleViewDetails = (drug) => {
        setCurrentDrug(drug);
        setIsViewDialogOpen(true);
    };

    const handleCreateChange = (e) => {
        const { name, value } = e.target;
        setCreateForm(prev => ({ ...prev, [name]: value }));
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitCreate = async () => {
        if (!createForm.name.trim() || !createForm.short_name.trim() || !createForm.type.trim()) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        const payload = {
            drug_id: "",
            name: createForm.name,
            short_name: createForm.short_name,
            type: createForm.type,
            is_active: 'ACTIVE',
            create_date: new Date().toISOString()
        };

        try {
            setIsSubmitting(true);
            await axios.post('/api/v1/drugs', payload);
            toast.success('Tạo thuốc mới thành công');
            setIsCreateDialogOpen(false);
            setCreateForm({
                drug_id: '',
                name: '',
                short_name: '',
                type: '',
                is_active: 'ACTIVE',
                create_date: ''
            });
            fetchDrugs();
        } catch {
            toast.error('Tạo thuốc thất bại');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (drug) => {
        setIsViewDialogOpen(false);
        setEditForm({
            drug_id: drug.drug_id,
            name: drug.drug_name,
            short_name: drug.short_name,
            type: drug.drug_type || '',
            is_active: drug.is_active || 'ACTIVE',
            create_date: drug.created_date || new Date().toISOString()
        });
        setIsEditDialogOpen(true);
    };

    const handleSubmitEdit = async () => {
        if (!editForm.name.trim() || !editForm.short_name.trim() || !editForm.type.trim()) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        const payload = {
            drug_id: editForm.drug_id,
            name: editForm.name,
            short_name: editForm.short_name,
            type: editForm.type,
            is_active: editForm.is_active || 'ACTIVE',
            create_date: editForm.create_date
        };

        try {
            setIsSubmitting(true);
            await axios.put(`/api/v1/drugs?id=${editForm.drug_id}`, payload);
            toast.success('Cập nhật thuốc thành công');
            setIsEditDialogOpen(false);
            fetchDrugs();
        } catch {
            toast.error('Cập nhật thuốc thất bại');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteDrug = async () => {
        try {
            setIsSubmitting(true);
            await axios.delete(`/api/v1/drugs?id=${currentDrug.drug_id}`, {
                data: {
                    drug_id: currentDrug.drug_id,
                    name: currentDrug.drug_name,
                    short_name: currentDrug.short_name,
                    type: currentDrug.drug_type || 'NRTIs',
                    is_active: 'INACTIVE',
                    create_date: currentDrug.create_date
                }
            });
            toast.success('Đã vô hiệu hoá thuốc');
            setIsViewDialogOpen(false);
            fetchDrugs();
        } catch {
            toast.error('Vô hiệu hoá thất bại');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getDrugTypeLabel = (type) => {
        const option = drugTypeOptions.find(opt => opt.value === type);
        return option ? option.label : type;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <CardTitle className="text-2xl font-bold">Quản lý thuốc</CardTitle>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm tên thuốc..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button onClick={() => setIsCreateDialogOpen(true)} className="hover:bg-blue-700 hover:text-white">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Thêm thuốc
                        </Button>
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
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">ID</TableHead>
                                        <TableHead>Tên thuốc</TableHead>
                                        <TableHead>Loại thuốc</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead className="text-right">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedData.map(drug => (
                                        <TableRow key={drug.drug_id}>
                                            <TableCell>{drug.drug_id}</TableCell>
                                            <TableCell>
                                                {drug.drug_name}{drug.short_name && ` (${drug.short_name})`}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-xs">
                                                    {drug.drug_type || 'Chưa phân loại'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={drug.is_active === 'ACTIVE' ? 'default' : 'secondary'}
                                                    className={drug.is_active === 'ACTIVE'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'}
                                                >
                                                    {drug.is_active === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleViewDetails(drug)}
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
                        Hiển thị <strong>{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, drugs.length)}</strong> trong tổng số <strong>{drugs.length}</strong> thuốc
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
                        <DialogTitle className="text-lg font-bold">Chi tiết thuốc</DialogTitle>
                    </DialogHeader>
                    {currentDrug && (
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            <p><strong className="text-gray-700">Tên:</strong> {currentDrug.drug_name}</p>
                            <p><strong className="text-gray-700">Viết tắt:</strong> {currentDrug.short_name}</p>
                            <p><strong className="text-gray-700">Loại:</strong> {getDrugTypeLabel(currentDrug.drug_type)}</p>
                            <p><strong className="text-gray-700">Ngày tạo:</strong> {new Date(currentDrug.created_date).toLocaleString()}</p>
                            <p><strong className="text-gray-700">Trạng thái:</strong> {currentDrug.is_active === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}</p>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => handleEdit(currentDrug)}
                            className="text-blue-600 hover:text-blue-700 border-blue-600 hover:border-blue-700"
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleDeleteDrug} disabled={isSubmitting}
                            className="text-red-600 hover:text-red-700 border-red-600 hover:border-red-700"
                        >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Vô hiệu hóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="bg-white max-w-xl border border-gray-300">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Thêm thuốc mới</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="block font-medium mb-1">Tên thuốc</label>
                            <Input name="name" placeholder="Tên thuốc" value={createForm.name} onChange={handleCreateChange} />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Tên viết tắt</label>
                            <Input name="short_name" placeholder="Tên viết tắt" value={createForm.short_name} onChange={handleCreateChange} />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Loại thuốc</label>
                            <Select
                                options={drugTypeOptions}
                                value={drugTypeOptions.find(option => option.value === createForm.type)}
                                onChange={(selected) => {
                                    setCreateForm(prev => ({ ...prev, type: selected ? selected.value : '' }));
                                }}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                placeholder="Chọn loại thuốc..."
                                isClearable
                            />
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsCreateDialogOpen(false)}
                            disabled={isSubmitting}
                        >
                            Huỷ
                        </Button>
                        <Button
                            onClick={handleSubmitCreate}
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white">
                            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Tạo
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="bg-white max-w-xl border border-gray-300">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Chỉnh sửa thuốc</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="block font-medium mb-1">Tên thuốc</label>
                            <Input name="name" placeholder="Tên thuốc" value={editForm.name} onChange={handleEditChange} />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Tên viết tắt</label>
                            <Input name="short_name" placeholder="Tên viết tắt" value={editForm.short_name} onChange={handleEditChange} />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Loại thuốc</label>
                            <Select
                                options={drugTypeOptions}
                                value={drugTypeOptions.find(option => option.value === editForm.type)}
                                onChange={(selected) => {
                                    setEditForm(prev => ({ ...prev, type: selected ? selected.value : '' }));
                                }}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                placeholder="Chọn loại thuốc..."
                                isClearable
                            />
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                            disabled={isSubmitting}
                        >
                            Huỷ
                        </Button>
                        <Button
                            onClick={handleSubmitEdit}
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white">
                            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Lưu
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DrugManagement;