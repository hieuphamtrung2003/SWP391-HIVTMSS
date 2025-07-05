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
import { PlusCircle, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Eye, Loader2, Search, Trash2 } from 'lucide-react';
import Select from 'react-select';

const DrugListSimple = () => {
    const [drugs, setDrugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchDrugs = async () => {
            try {
                const res = await axios.get('/api/v1/drugs/all');
                setDrugs(res);

            } catch (err) {
                toast.error('Không thể tải danh sách thuốc');
            } finally {
                setLoading(false);
            }
        };

        fetchDrugs();
    }, []);

    const filteredDrugs = (drugs || []).filter(d =>
        d.drug_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <CardTitle className="text-2xl font-bold">Danh sách thuốc</CardTitle>
                    <div className="relative w-full sm:w-1/3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm tên thuốc..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="overflow-x-auto rounded-lg border">
                        <Table>
                            <TableHeader className="bg-gray-50">
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Tên thuốc</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredDrugs.map(drug => (
                                    <TableRow key={drug.drug_id}>
                                        <TableCell>{drug.drug_id}</TableCell>
                                        <TableCell>
                                            {drug.drug_name}
                                            {drug.short_name && ` (${drug.short_name})`}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={drug.isActive === 'ACTIVE' ? 'default' : 'secondary'}
                                                className={drug.isActive === 'ACTIVE'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'}
                                            >
                                                {drug.is_active === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DrugListSimple;