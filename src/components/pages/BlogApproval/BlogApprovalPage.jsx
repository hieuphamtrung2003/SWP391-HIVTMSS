import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Clock, Calendar, Check, X, AlertCircle } from 'lucide-react';
import { Button } from '../../ui/button';
import axios from '../../../setup/configAxios';
import { toast } from 'react-toastify';
import { decodeToken } from '../../../utils/tokenUtils'

const BlogApprovalPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchPendingBlogs();
    }, []);

    const fetchPendingBlogs = async () => {
        try {
            setIsLoading(true)
            const res = await axios.get('/api/v1/blogs/all')
            const pendingBlogs = res.data.filter(blog => blog.status === 'PENDING' && blog.is_hidden === true)
            setBlogs(pendingBlogs)
        } catch (err) {
            toast.error('Lỗi khi tải danh sách blog')
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const updateBlogStatus = async (blogId, action) => {
        const blog = blogs.find(b => b.blog_id === blogId);
        if (!blog) {
            toast.error('Không tìm thấy blog!');
            return;
        }

        const getManagerInfo = () => {
            const token = localStorage.getItem("access_token")
            if (!token) return {}
            const decoded = decodeToken(token)
            return {
                account_id: decoded?.id || '',
                role_id: decoded?.roleId || '',
                role_name: decoded?.roleName || ''
            }
        }

        try {
            if (action === 'APPROVED') {
                // Lấy thông tin manager
                const managerInfo = getManagerInfo();

                await axios.put('/api/v1/blogs/approved', {
                    blog_id: blog.blog_id,
                    title: blog.title,
                    content: blog.content,
                    status: 'APPROVED',
                    image_url: blog.imageUrls?.[0] || '',
                    account_id: managerInfo.account_id,
                    role_id: managerInfo.role_id,
                    role_name: managerInfo.role_name,
                    is_hidden: true,
                    created_date: blog.created_date,
                    lastModifiedDate: new Date().toISOString(),
                });
                toast.success('Đã duyệt blog thành công!');

            } else if (action === 'REJECTED') {
                await axios.put(`/api/v1/blogs/rejected?id=${blogId}`);
                toast.success('Đã từ chối blog!');
            }

            setBlogs(prev => prev.filter(b => b.blog_id !== blogId));
            setSelectedBlog(null);
        } catch (err) {
            console.log('Sending approve request for blog:', blog);
            toast.error(`Lỗi khi ${action === 'APPROVED' ? 'duyệt' : 'từ chối'} blog`);
            console.error(err);
        }
    };

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto p-6"
        >
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Duyệt Blog</h1>
                    <p className="text-gray-600 mt-1">Quản lý và duyệt các bài viết chờ phê duyệt</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <AlertCircle className="h-4 w-4" />
                    {blogs.length} bài viết chờ duyệt
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : blogs.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">Không có bài viết nào chờ duyệt</h3>
                    <p className="text-gray-500">Tất cả bài viết đã được xử lý</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b font-medium text-gray-600">
                        <div className="col-span-5">Tiêu đề & Nội dung</div>
                        <div className="col-span-2">Tác giả</div>
                        <div className="col-span-2">Ngày tạo</div>
                        <div className="col-span-1">Trạng thái</div>
                        <div className="col-span-2">Thao tác</div>
                    </div>

                    <div className="divide-y">
                        {blogs.map((blog) => (
                            <motion.div
                                key={blog.blog_id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50"
                            >
                                <div className="col-span-5">
                                    <div className="flex gap-3">
                                        {blog.imageUrls?.[0] && (
                                            <img
                                                src={blog.imageUrls[0]}
                                                alt="Blog thumbnail"
                                                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-800 mb-1">{blog.title}</h3>
                                            <p className="text-sm text-gray-500 line-clamp-2">
                                                {blog.content.slice(0, 100)}...
                                            </p>
                                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                                <Clock className="h-3 w-3" />
                                                5 phút đọc
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-2 text-gray-600 flex items-center">
                                    {blog.full_name}
                                </div>
                                <div className="col-span-2 text-gray-600 flex items-center gap-1">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{formatDate(blog.created_date)}</span>
                                </div>
                                <div className="col-span-1 flex items-center">
                                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                                        Chờ duyệt
                                    </span>
                                </div>
                                <div className="col-span-2 flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedBlog(blog)}
                                        className="text-blue-600 hover:text-blue-700"
                                    >
                                        <Eye className="h-4 w-4 mr-1" />
                                        Xem chi tiết
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal */}
            {selectedBlog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
                            <h2 className="text-xl font-bold">Chi tiết bài viết</h2>
                            <button onClick={() => setSelectedBlog(null)}>
                                <X className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="p-6">
                            {selectedBlog.imageUrls?.[0] && (
                                <div className="mb-6">
                                    <img
                                        src={selectedBlog.imageUrls[0]}
                                        alt="Blog featured"
                                        className="w-full h-64 object-cover rounded-lg"
                                    />
                                </div>
                            )}
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold mb-4">{selectedBlog.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                    <span>Tác giả: <strong>{selectedBlog.full_name}</strong></span>
                                    <span>Ngày tạo: {formatDate(selectedBlog.created_date)}</span>
                                    <span>Chỉnh sửa lần cuối: {formatDate(selectedBlog.lastModifiedDate)}</span>
                                </div>
                                <p className="text-gray-700 whitespace-pre-wrap">{selectedBlog.content}</p>
                            </div>

                            <div className="flex gap-4 pt-6 border-t">
                                <Button
                                    onClick={() => updateBlogStatus(selectedBlog.blog_id, 'APPROVED')}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <Check className="h-4 w-4 mr-2" />
                                    Duyệt bài viết
                                </Button>

                                <Button
                                    onClick={() => updateBlogStatus(selectedBlog.blog_id, 'REJECTED')}
                                    variant="outline"
                                    className="border-red-600 text-red-600 hover:bg-red-50"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Từ chối
                                </Button>

                                <Button onClick={() => setSelectedBlog(null)} variant="outline">
                                    Hủy
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default BlogApprovalPage;