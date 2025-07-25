import React, { useState, useEffect } from 'react';
import axios from 'setup/configAxios';
import { toast } from "react-toastify";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../../components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '../../../components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import {
    PlusCircle,
    Pencil,
    Trash2,
    Loader2,
    MoreVertical,
    CheckCircle,
    XCircle,
    Search,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight
} from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import ReactSelect from 'react-select';

const TestTypeManagement = () => {
    const [testTypes, setTestTypes] = useState([]);
    const [filteredTestTypes, setFilteredTestTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
    const [currentTestType, setCurrentTestType] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const totalPages = Math.ceil(filteredTestTypes.length / itemsPerPage);

    // Dropdown options cho đối tượng áp dụng
    const applicableOptions = [
        { value: 'infant', label: 'Em bé' },
        { value: 'adolescents', label: 'Trẻ em' },
        { value: 'Adults', label: 'Người lớn' },
        { value: 'pregnant woman', label: 'Phụ nữ có thai' }
    ];

    // Form state - Thay đổi applicable thành array
    const [formData, setFormData] = useState({
        applicable: [],
        test_type_name: '',
        test_type_id: '1',
        test_type_description: '',
        test_type_code: '',
    });

    // Hàm lấy label tiếng Việt cho applicable - Cập nhật để xử lý array
    const getApplicableLabel = (value) => {
        if (!value) return '';

        // Nếu value là string, chuyển thành array
        const applicableArray = Array.isArray(value) ? value : value.split(',');

        return applicableArray.map(item => {
            const option = applicableOptions.find(opt => opt.value === item.trim());
            return option ? option.label : item.trim();
        }).join(', ');
    };

    // Hàm sắp xếp theo ID
    const sortByIdAsc = (data) => {
        return data.sort((a, b) => {
            const idA = parseInt(a.test_type_id) || 0;
            const idB = parseInt(b.test_type_id) || 0;
            return idA - idB;
        });
    };

    // Fetch all test types
    const fetchTestTypes = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/v1/test-types/all');

            // Sắp xếp theo ID ngay khi fetch
            const sortedData = sortByIdAsc(response.data);

            setTestTypes(sortedData);
            setFilteredTestTypes(sortedData);
        } catch (error) {
            toast.error('Không thể tải danh sách loại xét nghiệm');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestTypes();
    }, []);

    // Apply filters
    useEffect(() => {
        let result = testTypes;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(item =>
                item.test_type_name.toLowerCase().includes(term) ||
                item.test_type_code.toLowerCase().includes(term) ||
                item.applicable.toLowerCase().includes(term)
            )
        }

        if (statusFilter !== 'ALL') {
            result = result.filter(item => item.is_active === statusFilter);
        }

        // Sắp xếp theo test_type_id tăng dần
        result = sortByIdAsc(result);

        setFilteredTestTypes(result);
        setCurrentPage(1); // Reset to first page when filters change
    }, [searchTerm, statusFilter, testTypes]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle select changes
    const handleSelectChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            applicable: [],
            test_type_name: '',
            test_type_description: '',
            test_type_code: '',
        });
        setCurrentTestType(null);
    };

    // Handle form submission (create/update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Validation
        if (!formData.test_type_name.trim()) {
            toast.error('Vui lòng nhập tên loại xét nghiệm');
            return;
        }

        if (!formData.test_type_code.trim()) {
            toast.error('Vui lòng nhập mã xét nghiệm');
            return;
        }

        if (!formData.applicable || formData.applicable.length === 0) {
            toast.error('Vui lòng chọn ít nhất một đối tượng áp dụng');
            return;
        }

        if (!formData.test_type_description.trim()) {
            toast.error('Vui lòng nhập mô tả');
            return;
        }

        setIsSubmitting(true);

        try {
            // Chuẩn bị data để gửi - chuyển array thành string
            const submitData = {
                ...formData,
                applicable: formData.applicable.join(',')
            };

            if (currentTestType) {
                // Update existing test type
                await axios.put(`/api/v1/test-types?id=${currentTestType.test_type_id}`, submitData);
                toast.success('Loại xét nghiệm đã được cập nhật thành công');
            } else {
                // Create new test type
                await axios.post('/api/v1/test-types', submitData);
                toast.success('Loại xét nghiệm đã được tạo thành công');
            }
            fetchTestTypes();
            setIsDialogOpen(false);
            resetForm();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Thao tác thất bại');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Edit test type - Cập nhật để xử lý applicable như array
    const handleEdit = (testType) => {
        setCurrentTestType(testType);

        // Chuyển applicable từ string thành array
        const applicableArray = testType.applicable ? testType.applicable.split(',').map(item => item.trim()) : [];

        setFormData({
            applicable: applicableArray,
            test_type_id: testType.test_type_id,
            test_type_name: testType.test_type_name,
            test_type_description: testType.test_type_description,
            test_type_code: testType.test_type_code,
        });
        setIsDialogOpen(true);
    };

    // Deactivate test type
    const handleDeactivate = async () => {
        try {
            setIsSubmitting(true);
            // Gửi request body với thông tin test type hiện tại
            await axios.delete(`/api/v1/test-types?id=${currentTestType.test_type_id}`, {
                data: {
                    applicable: currentTestType.applicable,
                    test_type_name: currentTestType.test_type_name,
                    test_type_id: currentTestType.test_type_id,
                    test_type_description: currentTestType.test_type_description,
                    test_type_code: currentTestType.test_type_code,
                }
            });
            toast.success('Loại xét nghiệm đã được vô hiệu hóa thành công');
            fetchTestTypes();
            setIsDeactivateDialogOpen(false);
            resetForm();
        } catch (error) {
            toast.error('Không thể vô hiệu hóa loại xét nghiệm');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Toggle test type status
    const toggleStatus = async (testTypeId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
            await axios.patch(`/api/v1/test-types/status?id=${testTypeId}`, {
                status: newStatus,
            });
            toast.success(`Trạng thái loại xét nghiệm đã được cập nhật thành ${newStatus === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}`);
            fetchTestTypes();
        } catch (error) {
            toast.error('Không thể cập nhật trạng thái');
        }
    };

    // Pagination functions
    const goToPage = (page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const paginatedData = filteredTestTypes.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Handle dialog close
    const handleDialogClose = (open) => {
        if (!open) {
            resetForm();
        }
        setIsDialogOpen(open);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="shadow-sm">
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <CardTitle className="text-2xl font-bold">Quản lý loại xét nghiệm</CardTitle>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm kiếm loại xét nghiệm..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Lọc theo trạng thái" />
                                </SelectTrigger>
                                <SelectContent className="bg-white z-[60]">
                                    <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                                    <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                                    <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                                </SelectContent>
                            </Select>
                            <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                                <DialogTrigger asChild>
                                    <Button className="gap-2">
                                        <PlusCircle className="h-4 w-4" />
                                        Thêm mới
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[800px] bg-white z-[100] max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>
                                            {currentTestType ? 'Chỉnh sửa loại xét nghiệm' : 'Tạo loại xét nghiệm mới'}
                                        </DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Tên loại xét nghiệm <span className="text-red-500">*</span>
                                                </label>
                                                <Input
                                                    name="test_type_name"
                                                    value={formData.test_type_name}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="relative z-[101]"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Mã xét nghiệm <span className="text-red-500">*</span>
                                                </label>
                                                <Input
                                                    name="test_type_code"
                                                    value={formData.test_type_code}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="relative z-[101]"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Đối tượng áp dụng <span className="text-red-500">*</span>
                                            </label>
                                            <ReactSelect
                                                isMulti
                                                options={applicableOptions}
                                                value={applicableOptions.filter(option => formData.applicable.includes(option.value))}
                                                onChange={(selected) => {
                                                    const values = selected ? selected.map(opt => opt.value) : [];
                                                    setFormData((prev) => ({ ...prev, applicable: values }));
                                                }}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                placeholder="Chọn đối tượng áp dụng..."
                                                noOptionsMessage={() => "Không có tùy chọn nào"}
                                                menuPortalTarget={null}
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                    menu: (base) => ({ ...base, zIndex: 9999 }),
                                                    control: (base) => ({ ...base, zIndex: 1 })
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Mô tả <span className="text-red-500">*</span>
                                            </label>
                                            <Textarea
                                                name="test_type_description"
                                                value={formData.test_type_description}
                                                onChange={handleInputChange}
                                                rows={3}
                                                required
                                                className="relative z-[101]"
                                            />
                                        </div>
                                        <DialogFooter className="relative z-[101]">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setIsDialogOpen(false)}
                                                disabled={isSubmitting}
                                            >
                                                Hủy
                                            </Button>
                                            <Button type="submit" disabled={isSubmitting}>
                                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                {currentTestType ? 'Lưu thay đổi' : 'Tạo loại xét nghiệm'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
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
                                        <TableHead>Tên</TableHead>
                                        <TableHead>Mã</TableHead>
                                        <TableHead>Áp dụng cho</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead className="text-right">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedData.length > 0 ? (
                                        paginatedData.map((testType, index) => (
                                            <TableRow key={testType.test_type_id} className="hover:bg-gray-50">
                                                <TableCell className="font-medium">
                                                    {testType.test_type_id}
                                                </TableCell>
                                                <TableCell>{testType.test_type_name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{testType.test_type_code}</Badge>
                                                </TableCell>
                                                <TableCell>{getApplicableLabel(testType.applicable)}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={testType.is_active === 'ACTIVE' ? 'default' : 'secondary'}
                                                        className={testType.is_active === 'ACTIVE'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'}
                                                    >
                                                        {testType.is_active === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-white z-[50]">
                                                            <DropdownMenuItem onClick={() => handleEdit(testType)}>
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Chỉnh sửa
                                                            </DropdownMenuItem>
                                                            {testType.is_active === 'ACTIVE' && (
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setCurrentTestType(testType);
                                                                        setIsDeactivateDialogOpen(true);
                                                                    }}
                                                                    className="text-red-600"
                                                                >
                                                                    <XCircle className="mr-2 h-4 w-4" />
                                                                    Vô hiệu hóa
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center h-24">
                                                Không tìm thấy loại xét nghiệm nào
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
                {filteredTestTypes.length > 0 && (
                    <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
                        <div className="text-sm text-muted-foreground">
                            Hiển thị <strong>{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredTestTypes.length)}</strong> trong tổng số <strong>{filteredTestTypes.length}</strong> loại xét nghiệm
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">Số dòng mỗi trang</span>
                                <Select
                                    value={`${itemsPerPage}`}
                                    onValueChange={(value) => {
                                        setItemsPerPage(Number(value));
                                        setCurrentPage(1);
                                    }}
                                >
                                    <SelectTrigger className="h-8 w-[70px]">
                                        <SelectValue placeholder={itemsPerPage} />
                                    </SelectTrigger>
                                    <SelectContent side="top" className="bg-white z-[50]">
                                        {[5, 10, 20, 50].map((pageSize) => (
                                            <SelectItem key={pageSize} value={`${pageSize}`}>
                                                {pageSize}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    className="hidden h-8 w-8 p-0 lg:flex"
                                    onClick={() => goToPage(1)}
                                    disabled={currentPage === 1}
                                >
                                    <span className="sr-only">Đi đến trang đầu</span>
                                    <ChevronsLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-8 w-8 p-0"
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <span className="sr-only">Đi đến trang trước</span>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="text-sm font-medium">
                                    Trang {currentPage} / {totalPages}
                                </div>
                                <Button
                                    variant="outline"
                                    className="h-8 w-8 p-0"
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    <span className="sr-only">Đi đến trang tiếp theo</span>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="hidden h-8 w-8 p-0 lg:flex"
                                    onClick={() => goToPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                >
                                    <span className="sr-only">Đi đến trang cuối</span>
                                    <ChevronsRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardFooter>
                )}
            </Card>

            {/* Dialog xác nhận vô hiệu hóa */}
            <Dialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white z-[100]">
                    <DialogHeader>
                        <DialogTitle>Xác nhận vô hiệu hóa</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        Bạn có chắc chắn muốn vô hiệu hóa loại xét nghiệm <strong>{currentTestType?.test_type_name}</strong>? Hành động này sẽ chuyển trạng thái sang không hoạt động.
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeactivateDialogOpen(false)}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeactivate}
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Vô hiệu hóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TestTypeManagement;