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
import { PlusCircle, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Eye, Loader2, Search, Trash2, Edit, Save } from 'lucide-react';
import Select from 'react-select';

const TreatmentRegimenManagement = () => {
    const [regimens, setRegimens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentRegimen, setCurrentRegimen] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState(1);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [drugs, setDrugs] = useState([]);
    const [createForm, setCreateForm] = useState({
        name: '',
        applicable: [],
        note: '',
        treatmentRegimenDrugs: [{ method: 1, drugId: '' }]
    });

    const applicableOptions = [
        { value: 'Infant', label: 'Em bé' },
        { value: 'Adolescents', label: 'Trẻ em' },
        { value: 'Adults', label: 'Người lớn' },
        { value: 'PregnantWomen', label: 'Phụ nữ có thai' }
    ];

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

    const fetchDrugs = async () => {
        try {
            const res = await axios.get('/api/v1/drugs/all');
            setDrugs(res.data);
        } catch (err) {
            toast.error('Không thể tải danh sách thuốc');
        }
    };

    useEffect(() => {
        fetchRegimens();
        fetchDrugs();
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

    const handleCreateChange = (e) => {
        const { name, value } = e.target;
        setCreateForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleDrugChange = (index, field, value) => {
        setCreateForm((prev) => {
            const updatedDrugs = [...prev.treatmentRegimenDrugs];
            updatedDrugs[index][field] = value;
            return { ...prev, treatmentRegimenDrugs: updatedDrugs };
        });
    };

    const handleAddDrug = () => {
        setCreateForm((prev) => ({
            ...prev,
            treatmentRegimenDrugs: [...prev.treatmentRegimenDrugs, { method: 1, drugId: '' }]
        }));
    };

    const handleRemoveDrug = (index) => {
        setCreateForm((prev) => {
            const updated = [...prev.treatmentRegimenDrugs];
            updated.splice(index, 1);
            return { ...prev, treatmentRegimenDrugs: updated };
        });
    };

    const resolveDrugId = (input) => {
        if (!Array.isArray(drugs)) return null;
        const found = drugs.find(d => {
            const normalizedInput = input.trim().toLowerCase();
            return (
                d.drug_id.toString() === normalizedInput ||
                d.drug_name.trim().toLowerCase() === normalizedInput ||
                d.short_name.trim().toLowerCase() === normalizedInput
            );
        });
        return found?.drug_id || null;
    };

    const handleSubmitCreate = async () => {
        const treatmentRegimenDrugs = createForm.treatmentRegimenDrugs
            .map(d => {
                const drugId = resolveDrugId(d.drugId);
                if (!drugId) return null;
                return {
                    drugId,
                    method: d.method || 1,
                    note: 'string'
                };
            })
            .filter(Boolean);

        const payload = {
            name: createForm.name,
            applicable: createForm.applicable.join(','),
            lineLevel: 'FIRST_LINE',
            note: createForm.note,
            treatmentRegimenDrugs
        };

        try {
            setIsSubmitting(true);
            await axios.post('/api/v1/treatment-regimens', payload);
            toast.success('Tạo phác đồ thành công');
            setIsCreateDialogOpen(false);
            fetchRegimens();
        } catch (err) {
            toast.error('Tạo phác đồ thất bại');
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
                            <Button
                                variant="default"
                                onClick={() => setIsCreateDialogOpen(true)}
                                className="hover:bg-blue-700 hover:text-white"
                            >
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Tạo phác đồ
                            </Button>
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
                        <div className="space-y-4 max-h-96 overflow-y-auto">
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
                                        <label className="block font-medium mb-1">Chọn phương pháp điều trị:</label>
                                        <select
                                            value={selectedMethod}
                                            onChange={(e) => setSelectedMethod(parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        >
                                            {currentRegimen.treatment_regimen_drugs.map(drugSet => (
                                                <option key={drugSet.method} value={drugSet.method}>
                                                    Phương pháp {drugSet.method}
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
                        <Button
                            variant="outline"

                            className="text-blue-600 hover:text-blue-700 border-blue-600 hover:border-blue-700"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(true)}
                            className="text-red-600 hover:text-red-700 border-red-600 hover:border-red-700"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
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

            {/* Create Regimen Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="bg-white max-w-xl border border-gray-300">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Tạo phác đồ mới</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="block font-medium mb-1">Tên phác đồ</label>
                            <Input name="name" value={createForm.name} onChange={handleCreateChange} />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Đối tượng áp dụng</label>
                            <Select
                                isMulti
                                options={applicableOptions}
                                value={applicableOptions.filter(option => createForm.applicable.includes(option.value))}
                                onChange={(selected) => {
                                    const values = selected.map(opt => opt.value);
                                    setCreateForm((prev) => ({ ...prev, applicable: values }));
                                }}
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Lưu ý</label>
                            <Input name="note" value={createForm.note} onChange={handleCreateChange} />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Danh sách thuốc</span>
                                <Button type="button" onClick={handleAddDrug} size="sm">+ Thêm thuốc</Button>
                            </div>
                            {createForm.treatmentRegimenDrugs.map((drug, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Input
                                        placeholder="ID, tên hoặc viết tắt"
                                        value={drug.drugId}
                                        onChange={(e) => handleDrugChange(index, 'drugId', e.target.value)}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Phương pháp"
                                        value={drug.method}
                                        onChange={(e) => handleDrugChange(index, 'method', parseInt(e.target.value))}
                                    />
                                    <Button variant="ghost" onClick={() => handleRemoveDrug(index)} className="text-red-600">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isSubmitting}>Huỷ</Button>
                        <Button onClick={handleSubmitCreate} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Tạo
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TreatmentRegimenManagement;
