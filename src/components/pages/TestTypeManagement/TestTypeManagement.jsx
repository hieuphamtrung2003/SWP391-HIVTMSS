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

const TestTypeManagement = () => {
    const [testTypes, setTestTypes] = useState([]);
    const [filteredTestTypes, setFilteredTestTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentTestType, setCurrentTestType] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const totalPages = Math.ceil(filteredTestTypes.length / itemsPerPage);

    // Form state
    const [formData, setFormData] = useState({
        applicable: '',
        test_type_name: '',
        test_type_description: '',
        test_type_code: '',
    });

    // Fetch all test types
    const fetchTestTypes = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/v1/test-types/all');
            setTestTypes(response.data);
            setFilteredTestTypes(response.data);
        } catch (error) {
            toast.error('Failed to fetch test types');
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
    )}
        
        if (statusFilter !== 'ALL') {
            result = result.filter(item => item.is_active === statusFilter);
        }
        
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

    // Reset form
    const resetForm = () => {
        setFormData({
            applicable: '',
            test_type_name: '',
            test_type_description: '',
            test_type_code: '',
        });
        setCurrentTestType(null);
    };

    // Handle form submission (create/update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (currentTestType) {
                // Update existing test type
                await axios.put(`/api/v1/test-types?id=${currentTestType.test_type_id}`, formData);
                toast.success('Test type updated successfully');
            } else {
                // Create new test type
                await axios.post('/api/v1/test-types', formData);
                toast.success('Test type created successfully');
            }
            fetchTestTypes();
            setIsDialogOpen(false);
            resetForm();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Edit test type
    const handleEdit = (testType) => {
        setCurrentTestType(testType);
        setFormData({
            applicable: testType.applicable,
            test_type_name: testType.test_type_name,
            test_type_description: testType.test_type_description,
            test_type_code: testType.test_type_code,
        });
        setIsDialogOpen(true);
    };

    // // Delete test type
    // const handleDelete = async () => {
    //     try {
    //         setIsSubmitting(true);
    //         await axios.delete(`/api/v1/test-types?id=${currentTestType.test_type_id}`);
    //         toast.success('Test type deleted successfully');
    //         fetchTestTypes();
    //         setIsDeleteDialogOpen(false);
    //         resetForm();
    //     } catch (error) {
    //         toast.error('Failed to delete test type');
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // };

    // Toggle test type status
    const toggleStatus = async (testTypeId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
            await axios.patch(`/api/v1/test-types/status?id=${testTypeId}`, {
                status: newStatus,
            });
            toast.success(`Test type status updated to ${newStatus}`);
            fetchTestTypes();
        } catch (error) {
            toast.error('Failed to update status');
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

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="shadow-sm">
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <CardTitle className="text-2xl font-bold">Test Type Management</CardTitle>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search test types..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="ALL">All Statuses</SelectItem>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                                if (!open) resetForm();
                                setIsDialogOpen(open);
                            }}>
                                <DialogTrigger asChild>
                                    <Button className="gap-2">
                                        <PlusCircle className="h-4 w-4" />
                                        Add New
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[800px] bg-white">
                                    <DialogHeader>
                                        <DialogTitle>
                                            {currentTestType ? 'Edit Test Type' : 'Create New Test Type'}
                                        </DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Test Type Name <span className="text-red-500">*</span>
                                                </label>
                                                <Input
                                                    name="test_type_name"
                                                    value={formData.test_type_name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Test Code <span className="text-red-500">*</span>
                                                </label>
                                                <Input
                                                    name="test_type_code"
                                                    value={formData.test_type_code}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Applicable To <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                name="applicable"
                                                value={formData.applicable}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Adults, pregnant women"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Description <span className="text-red-500">*</span>
                                            </label>
                                            <Textarea
                                                name="test_type_description"
                                                value={formData.test_type_description}
                                                onChange={handleInputChange}
                                                rows={3}
                                                required
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setIsDialogOpen(false)}
                                                disabled={isSubmitting}
                                            >
                                                Cancel
                                            </Button>
                                            <Button type="submit" disabled={isSubmitting}>
                                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                {currentTestType ? 'Save Changes' : 'Create Test Type'}
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
                                        <TableHead>Name</TableHead>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Applicable To</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedData.length > 0 ? (
                                        paginatedData.map((testType) => (
                                            <TableRow key={testType.test_type_id} className="hover:bg-gray-50">
                                                <TableCell className="font-medium">{testType.test_type_id}</TableCell>
                                                <TableCell>{testType.test_type_name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{testType.test_type_code}</Badge>
                                                </TableCell>
                                                <TableCell>{testType.applicable}</TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        variant={testType.is_active === 'ACTIVE' ? 'default' : 'secondary'}
                                                        className={testType.is_active === 'ACTIVE' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'}
                                                    >
                                                        {testType.is_active}
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
                                                            <DropdownMenuItem onClick={() => handleEdit(testType)}>
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem 
                                                                onClick={() => toggleStatus(testType.test_type_id, testType.is_active)} 
                                                                className={testType.is_active === 'ACTIVE' 
                                                                    ? 'text-yellow-600 ' 
                                                                    : 'text-green-600' }
                                                            >
                                                                {testType.is_active === 'ACTIVE' ? (
                                                                    <XCircle className="mr-2 h-4 w-4" />
                                                                ) : (
                                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                                )}
                                                                {testType.is_active === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem 
                                                                onClick={() => {
                                                                    setCurrentTestType(testType);
                                                                    setIsDeleteDialogOpen(true);
                                                                }}
                                                                className="text-red-600"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center h-24">
                                                No test types found
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
                            Showing <strong>{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredTestTypes.length)}</strong> of <strong>{filteredTestTypes.length}</strong> test types
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">Rows per page</span>
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
                                    <SelectContent side="top">
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
                                    <span className="sr-only">Go to first page</span>
                                    <ChevronsLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-8 w-8 p-0"
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <span className="sr-only">Go to previous page</span>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="text-sm font-medium">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <Button
                                    variant="outline"
                                    className="h-8 w-8 p-0"
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    <span className="sr-only">Go to next page</span>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="hidden h-8 w-8 p-0 lg:flex"
                                    onClick={() => goToPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                >
                                    <span className="sr-only">Go to last page</span>
                                    <ChevronsRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardFooter>
                )}
            </Card>

            {/* Delete confirmation dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        Are you sure you want to delete the test type <strong>{currentTestType?.test_type_name}</strong>? This action cannot be undone.
                    </div>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="destructive" 
                            // onClick={handleDelete}
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TestTypeManagement;