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
import { motion, AnimatePresence } from "framer-motion";

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
        treatmentRegimenMethods: [{ method: 1, selectedDrugs: [] }] // Thay đổi structure
    });
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        applicable: [],
        note: '',
        treatmentRegimenMethods: [] // Thay đổi structure giống create form
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
            setDrugs(res);
        } catch (err) {
            toast.error('Không thể tải danh sách thuốc');
        }
    };

    useEffect(() => {
        fetchRegimens();
        fetchDrugs();
    }, []);

    // Tạo drug options cho dropdown
    const getDrugOptions = () => {
        if (!Array.isArray(drugs)) return [];
        return drugs
            .filter(drug => drug.is_active === 'ACTIVE')
            .map(drug => ({
                value: drug.drug_id,
                label: `${drug.drug_name} (${drug.short_name})`
            }));
    };

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

    // Xử lý thay đổi thuốc được chọn trong method
    const handleMethodDrugChange = (methodIndex, selectedOptions) => {
        // Giới hạn tối đa 3 thuốc
        const limitedOptions = selectedOptions.slice(0, 3);

        setCreateForm((prev) => {
            const updatedMethods = [...prev.treatmentRegimenMethods];
            updatedMethods[methodIndex].selectedDrugs = limitedOptions;
            return { ...prev, treatmentRegimenMethods: updatedMethods };
        });
    };

    // Thêm phương pháp mới
    const handleAddMethod = () => {
        setCreateForm((prev) => {
            const nextMethodNumber = prev.treatmentRegimenMethods.length + 1;
            return {
                ...prev,
                treatmentRegimenMethods: [
                    ...prev.treatmentRegimenMethods,
                    { method: nextMethodNumber, selectedDrugs: [] }
                ]
            };
        });
    };

    // Xóa phương pháp
    const handleRemoveMethod = (index) => {
        setCreateForm((prev) => {
            const updated = [...prev.treatmentRegimenMethods];
            updated.splice(index, 1);
            // Cập nhật lại số thứ tự method
            updated.forEach((method, idx) => {
                method.method = idx + 1;
            });
            return { ...prev, treatmentRegimenMethods: updated };
        });
    };

    // Xử lý thay đổi thuốc được chọn trong method cho edit form
    const handleEditMethodDrugChange = (methodIndex, selectedOptions) => {
        // Giới hạn tối đa 3 thuốc
        const limitedOptions = selectedOptions.slice(0, 3);

        setEditForm((prev) => {
            const updatedMethods = [...prev.treatmentRegimenMethods];
            updatedMethods[methodIndex].selectedDrugs = limitedOptions;
            return { ...prev, treatmentRegimenMethods: updatedMethods };
        });
    };

    // Thêm phương pháp mới cho edit form
    const handleAddEditMethod = () => {
        setEditForm((prev) => {
            const nextMethodNumber = prev.treatmentRegimenMethods.length + 1;
            return {
                ...prev,
                treatmentRegimenMethods: [
                    ...prev.treatmentRegimenMethods,
                    { method: nextMethodNumber, selectedDrugs: [] }
                ]
            };
        });
    };

    // Xóa phương pháp cho edit form
    const handleRemoveEditMethod = (index) => {
        setEditForm((prev) => {
            const updated = [...prev.treatmentRegimenMethods];
            updated.splice(index, 1);
            // Cập nhật lại số thứ tự method
            updated.forEach((method, idx) => {
                method.method = idx + 1;
            });
            return { ...prev, treatmentRegimenMethods: updated };
        });
    };

    const handleSubmitCreate = async () => {
        if (!createForm.name.trim()) {
            toast.error('Vui lòng nhập tên phác đồ');
            return;
        }

        if (!createForm.applicable || createForm.applicable.length === 0) {
            toast.error('Vui lòng chọn ít nhất một đối tượng');
            return;
        }

        // Chuyển đổi từ treatmentRegimenMethods sang methods theo cấu trúc mới
        const methods = [];

        for (const method of createForm.treatmentRegimenMethods) {
            if (method.selectedDrugs.length === 0) {
                toast.error(`Phương pháp ${method.method}: vui lòng chọn ít nhất một thuốc`);
                return;
            }

            const drugs = method.selectedDrugs.map(drug => ({
                drugId: drug.value,
                method: method.method,
                note: "string"
            }));

            methods.push({
                methodNumber: method.method,
                drugs: drugs
            });
        }

        const payload = {
            name: createForm.name,
            applicable: createForm.applicable.join(','),
            lineLevel: 'FIRST_LINE',
            note: createForm.note,
            numberOfMethods: methods.length,
            methods: methods
        };

        try {
            setIsSubmitting(true);
            await axios.post('/api/v1/treatment-regimens', payload);
            toast.success('Tạo phác đồ thành công');
            setIsCreateDialogOpen(false);
            // Reset form
            setCreateForm({
                name: '',
                applicable: [],
                note: '',
                treatmentRegimenMethods: [{ method: 1, selectedDrugs: [] }]
            });
            fetchRegimens();
        } catch (err) {
            toast.error('Tạo phác đồ thất bại');
            console.error('Create error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (regimen) => {
        setIsViewDialogOpen(false);

        // Chuyển đổi từ cấu trúc mới sang treatmentRegimenMethods
        const treatmentRegimenMethods = [];

        if (regimen.treatment_regimen_drugs && regimen.treatment_regimen_drugs.length > 0) {
            // Xử lý cấu trúc cũ nếu vẫn còn
            const methodsMap = {};

            regimen.treatment_regimen_drugs.forEach(drugSet => {
                drugSet.drugs.forEach(drug => {
                    if (!methodsMap[drugSet.method]) {
                        methodsMap[drugSet.method] = {
                            method: drugSet.method,
                            selectedDrugs: []
                        };
                    }
                    methodsMap[drugSet.method].selectedDrugs.push({
                        value: drug.drug_id,
                        label: `${drug.drug_name} (${drug.short_name})`
                    });
                });
            });

            treatmentRegimenMethods.push(...Object.values(methodsMap).sort((a, b) => a.method - b.method));
        } else if (regimen.methods && regimen.methods.length > 0) {
            // Xử lý cấu trúc mới
            regimen.methods.forEach(method => {
                const selectedDrugs = method.drugs.map(drug => ({
                    value: drug.drugId,
                    label: `${drug.drug_name || 'Unknown'} (${drug.short_name || 'N/A'})`
                }));

                treatmentRegimenMethods.push({
                    method: method.methodNumber,
                    selectedDrugs: selectedDrugs
                });
            });
        }

        setEditForm({
            treatment_regimen_id: regimen.treatment_regimen_id,
            name: regimen.name,
            applicable: regimen.applicable?.split(',') || [],
            note: regimen.note || '',
            treatmentRegimenMethods: treatmentRegimenMethods.length > 0 ? treatmentRegimenMethods : [{ method: 1, selectedDrugs: [] }]
        });
        setIsEditDialogOpen(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleEditDrugChange = (index, field, value) => {
        setEditForm((prev) => {
            const updated = [...prev.treatmentRegimenDrugs];
            updated[index][field] = value;
            return { ...prev, treatmentRegimenDrugs: updated };
        });
    };

    const handleSubmitEdit = async () => {
        if (!editForm.name.trim()) {
            toast.error('Vui lòng nhập tên phác đồ');
            return;
        }

        if (!editForm.applicable || editForm.applicable.length === 0) {
            toast.error('Vui lòng chọn ít nhất một đối tượng');
            return;
        }

        // Chuyển đổi từ treatmentRegimenMethods sang methods theo cấu trúc mới
        const methods = [];

        for (const method of editForm.treatmentRegimenMethods) {
            if (method.selectedDrugs.length === 0) {
                toast.error(`Phương pháp ${method.method}: vui lòng chọn ít nhất một thuốc`);
                return;
            }

            const drugs = method.selectedDrugs.map(drug => ({
                drugId: drug.value,
                method: method.method,
                note: "string" // Có thể thay đổi thành note cụ thể nếu cần
            }));

            methods.push({
                methodNumber: method.method,
                drugs: drugs
            });
        }

        const payload = {
            name: editForm.name,
            applicable: editForm.applicable.join(','),
            lineLevel: 'FIRST_LINE',
            note: editForm.note,
            numberOfMethods: methods.length,
            methods: methods
        };

        try {
            setIsSubmitting(true);
            await axios.put(`/api/v1/treatment-regimens?id=${editForm.treatment_regimen_id}`, payload);
            toast.success('Chỉnh sửa phác đồ thành công');
            setIsEditDialogOpen(false);
            fetchRegimens();
        } catch (err) {
            toast.error('Chỉnh sửa phác đồ thất bại');
            console.error('Edit error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto p-4"
        >
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
                                    <TableHeader>
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
                <AnimatePresence>
                    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                        <DialogContent className="bg-white max-w-lg border border-gray-300 shadow-xl">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold">Chi tiết phác đồ</DialogTitle>
                            </DialogHeader>
                            {currentRegimen && (
                                <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
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
                                    onClick={() => handleEdit(currentRegimen)}
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
                                    Xóa phác đồ
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </AnimatePresence>

                {/* Delete confirmation dialog */}
                <AnimatePresence>
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
                                <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting} className="bg-red-500 hover:bg-red-600">
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Xoá
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </AnimatePresence>

                {/* Create Regimen Dialog - UPDATED */}
                <AnimatePresence>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogContent className="bg-white max-w-xl border border-gray-300">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold">Tạo phác đồ mới</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
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

                                {/* Updated drug selection section */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Thêm danh sách thuốc</span>
                                        <Button type="button" onClick={handleAddMethod} size="sm">
                                            + Thêm phương pháp
                                        </Button>
                                    </div>

                                    {createForm.treatmentRegimenMethods.map((method, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <label className="block font-medium text-gray-700">
                                                    Phương pháp {method.method}
                                                </label>
                                                {createForm.treatmentRegimenMethods.length > 1 && (
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => handleRemoveMethod(index)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm text-gray-600 mb-2">
                                                    Chọn thuốc (tối đa 3 thuốc)
                                                </label>
                                                <Select
                                                    isMulti
                                                    options={getDrugOptions()}
                                                    value={method.selectedDrugs}
                                                    onChange={(selected) => handleMethodDrugChange(index, selected)}
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    placeholder="Chọn thuốc..."
                                                    noOptionsMessage={() => "Không có thuốc nào"}
                                                    isOptionDisabled={() => method.selectedDrugs.length >= 3}
                                                />
                                                {method.selectedDrugs.length >= 3 && (
                                                    <p className="text-sm text-amber-600 mt-1">
                                                        Đã đạt giới hạn tối đa 3 thuốc
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <DialogFooter className="mt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsCreateDialogOpen(false);
                                        // Reset form khi đóng dialog
                                        setCreateForm({
                                            name: '',
                                            applicable: [],
                                            note: '',
                                            treatmentRegimenMethods: [{ method: 1, selectedDrugs: [] }]
                                        });
                                    }}
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
                </AnimatePresence>

                {/* Edit Regimen Dialog - UPDATED */}
                <AnimatePresence>
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogContent className="bg-white max-w-xl border border-gray-300">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold">Chỉnh sửa phác đồ</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                                <div>
                                    <label className="block font-medium mb-1">Tên phác đồ</label>
                                    <Input name="name" value={editForm.name} onChange={handleEditChange} />
                                </div>
                                <div>
                                    <label className="block font-medium mb-1">Đối tượng áp dụng</label>
                                    <Select
                                        isMulti
                                        options={applicableOptions}
                                        value={applicableOptions.filter(opt => editForm.applicable.includes(opt.value))}
                                        onChange={(selected) =>
                                            setEditForm((prev) => ({ ...prev, applicable: selected.map(o => o.value) }))
                                        }
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium mb-1">Lưu ý</label>
                                    <Input name="note" value={editForm.note} onChange={handleEditChange} />
                                </div>

                                {/* Updated drug selection section for edit */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Thêm danh sách thuốc</span>
                                        <Button type="button" onClick={handleAddEditMethod} size="sm">
                                            + Thêm phương pháp
                                        </Button>
                                    </div>

                                    {editForm.treatmentRegimenMethods.map((method, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <label className="block font-medium text-gray-700">
                                                    Phương pháp {method.method}
                                                </label>
                                                {editForm.treatmentRegimenMethods.length > 1 && (
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => handleRemoveEditMethod(index)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm text-gray-600 mb-2">
                                                    Chọn thuốc (tối đa 3 thuốc)
                                                </label>
                                                <Select
                                                    isMulti
                                                    options={getDrugOptions()}
                                                    value={method.selectedDrugs}
                                                    onChange={(selected) => handleEditMethodDrugChange(index, selected)}
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    placeholder="Chọn thuốc..."
                                                    noOptionsMessage={() => "Không có thuốc nào"}
                                                    isOptionDisabled={() => method.selectedDrugs.length >= 3}
                                                />
                                                {method.selectedDrugs.length >= 3 && (
                                                    <p className="text-sm text-amber-600 mt-1">
                                                        Đã đạt giới hạn tối đa 3 thuốc
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
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
                </AnimatePresence>

            </div>
        </motion.div>
    );
};

export default TreatmentRegimenManagement;
