import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Clock, Calendar, Check, X, AlertCircle } from 'lucide-react';
import { Button } from '../../ui/button';
import axios from '../../../setup/configAxios';
import { toast } from 'react-toastify';
import { decodeToken } from '../../../utils/tokenUtils';

const BlogApprovalPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchPendingBlogs();
    }, []);

    const fetchPendingBlogs = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get('/api/v1/blogs/all');
            const pendingBlogs = res.data.filter(blog => blog.status === 'PENDING' && blog.is_hidden === true);
            setBlogs(pendingBlogs);
        } catch (err) {
            toast.error('Lỗi khi tải danh sách blog');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const updateBlogStatus = async (blogId, action) => {
        const blog = blogs.find(b => b.blog_id === blogId);
        if (!blog) {
            toast.error('Không tìm thấy blog!');
            return;
        }

        try {
            await axios.put('/api/v1/blogs/updateStatus', null, {
                params: {
                    id: blog.blog_id,
                    accountID: blog.account_id,
                    status: action,
                }
            });

            toast.success(`Đã ${action === 'APPROVED' ? 'duyệt' : 'từ chối'} blog thành công!`);
            setBlogs(prev => prev.filter(b => b.blog_id !== blogId));
            setSelectedBlog(null);
        } catch (err) {
            toast.error(`Lỗi khi ${action === 'APPROVED' ? 'duyệt' : 'từ chối'} blog`);
            console.error(err);
        }
    };

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            // hour: '2-digit',
            // minute: '2-digit'
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
                        <div className="col-span-6">Tiêu đề & Nội dung</div>
                        <div className="col-span-2">Tác giả</div>
                        <div className="col-span-2">Ngày đăng</div>
                        <div className="col-span-1">Trạng thái</div>
                        <div className="col-span-1">Thao tác</div>
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
                                <div className="col-span-6 flex gap-4">
                                    {blog.imageUrls?.[0] && (
                                        <img
                                            src={blog.imageUrls[0]}
                                            alt="Thumbnail"
                                            className="w-20 h-20 rounded-md object-cover flex-shrink-0"
                                        />
                                    )}
                                    <div>
                                        <h3 className="font-medium text-gray-800">{blog.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                            {blog.content.slice(0, 100)}...
                                        </p>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">

                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-2 text-gray-600 flex items-center">{blog.full_name}</div>
                                <div className="col-span-2 text-gray-600 flex items-center gap-1">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{formatDate(blog.created_date)}</span>
                                </div>
                                <div className="col-span-1 flex items-center">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs ${blog.status === 'APPROVED'
                                            ? 'bg-green-100 text-green-800'
                                            : blog.status === 'REJECTED'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                    >
                                        {blog.status === 'APPROVED'
                                            ? 'Đã duyệt'
                                            : blog.status === 'REJECTED'
                                                ? 'Từ chối'
                                                : 'Chờ duyệt'}
                                    </span>
                                </div>
                                <div className="col-span-1 flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedBlog(blog)}
                                        className="text-blue-600 hover:text-blue-700"
                                    >
                                        <Eye className="h-4 w-4 mr-1" />
                                        Xem
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

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
                                    Đóng
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
