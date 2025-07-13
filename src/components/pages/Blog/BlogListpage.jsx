import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Button } from "../../ui/button";
import axios from '../../../setup/configAxios';
import { toast } from 'react-toastify';
import { decodeToken } from '../../../utils/tokenUtils';
import { FaEye, FaEyeSlash, FaUserMd, FaShieldAlt, FaHeartbeat } from "react-icons/fa";

const BlogListPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch approved blogs
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setIsLoading(true);
                const result = await axios.get('/api/v1/blogs/all');
                const rawBlogs = result?.data || [];

                const approvedBlogs = rawBlogs
                    .filter(blog => blog.status === 'APPROVED')
                    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

                setBlogs(approvedBlogs);
                setError(null);
            } catch (error) {
                console.error('Lỗi khi tải danh sách blog:', error);
                toast.error('Không thể tải danh sách blog. Vui lòng thử lại sau.');
                setError('Lỗi khi tải blog');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });

    //kiểm tra guest
    const [isGuest, setIsGuest] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        try {
            const decoded = decodeToken(token);
            if (decoded && decoded.role) {
                setIsGuest(false); // đã đăng nhập
            }
        } catch (e) {
            setIsGuest(true);
        }
    }, []);

    return (

        <div className="relative min-h-screen">
            <style>{`
        .blog-content {
          font-size: 16px;
          line-height: 1.7;
          color: #374151;
        }
        .blog-content h1 { 
          font-size: 2em; 
          font-weight: bold; 
          margin: 1.5em 0 0.5em 0; 
          color: #111827;
          line-height: 1.2;
        }
        .blog-content h2 { 
          font-size: 1.5em; 
          font-weight: bold; 
          margin: 1.3em 0 0.5em 0; 
          color: #111827;
          line-height: 1.3;
        }
        .blog-content h3 { 
          font-size: 1.25em; 
          font-weight: bold; 
          margin: 1.2em 0 0.5em 0; 
          color: #111827;
          line-height: 1.4;
        }
        .blog-content h4 { 
          font-size: 1.1em; 
          font-weight: bold; 
          margin: 1.1em 0 0.5em 0; 
          color: #111827;
          line-height: 1.4;
        }
        .blog-content h5 { 
          font-size: 1em; 
          font-weight: bold; 
          margin: 1em 0 0.5em 0; 
          color: #111827;
          line-height: 1.4;
        }
        .blog-content h6 { 
          font-size: 0.9em; 
          font-weight: bold; 
          margin: 1em 0 0.5em 0; 
          color: #111827;
          line-height: 1.4;
        }
        .blog-content p { 
          margin: 1em 0; 
          line-height: 1.7;
        }
        .blog-content ul, .blog-content ol { 
          margin: 1em 0; 
          padding-left: 2em; 
        }
        .blog-content li { 
          margin: 0.5em 0; 
          line-height: 1.6;
        }
        .blog-content blockquote { 
          margin: 1.5em 0; 
          padding: 1em 1.5em; 
          border-left: 4px solid #3b82f6; 
          background-color: #f8fafc;
          font-style: italic;
          color: #475569;
        }
        .blog-content code { 
          background-color: #f1f5f9; 
          padding: 2px 6px; 
          border-radius: 4px; 
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
          color: #dc2626;
        }
        .blog-content pre { 
          background-color: #1e293b; 
          color: #e2e8f0;
          padding: 1.5em; 
          border-radius: 8px; 
          overflow-x: auto; 
          margin: 1.5em 0;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
          line-height: 1.5;
        }
        .blog-content pre code {
          background: none;
          padding: 0;
          color: inherit;
          font-size: inherit;
        }
        .blog-content img { 
          max-width: 100%; 
          height: auto; 
          border-radius: 8px;
          margin: 1.5em 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .blog-content a { 
          color: #3b82f6; 
          text-decoration: underline; 
          transition: color 0.2s;
        }
        .blog-content a:hover { 
          color: #1d4ed8; 
        }
        .blog-content strong { 
          font-weight: 600; 
          color: #111827;
        }
        .blog-content em { 
          font-style: italic; 
        }
        .blog-content u { 
          text-decoration: underline; 
        }
        .blog-content s { 
          text-decoration: line-through; 
        }
        .blog-content table {
          border-collapse: collapse;
          margin: 1.5em 0;
          width: 100%;
        }
        .blog-content table th,
        .blog-content table td {
          border: 1px solid #d1d5db;
          padding: 0.75em 1em;
          text-align: left;
        }
        .blog-content table th {
          background-color: #f9fafb;
          font-weight: 600;
          color: #111827;
        }
        .blog-content hr {
          border: none;
          height: 1px;
          background-color: #e5e7eb;
          margin: 2em 0;
        }
        .blog-content .ql-align-center {
          text-align: center;
        }
        .blog-content .ql-align-right {
          text-align: right;
        }
        .blog-content .ql-align-justify {
          text-align: justify;
        }
        .blog-content .ql-indent-1 {
          padding-left: 2em;
        }
        .blog-content .ql-indent-2 {
          padding-left: 4em;
        }
        .blog-content .ql-indent-3 {
          padding-left: 6em;
        }
        .blog-content .ql-indent-4 {
          padding-left: 8em;
        }
        .blog-content .ql-indent-5 {
          padding-left: 10em;
        }
        .blog-content .ql-indent-6 {
          padding-left: 12em;
        }
        .blog-content .ql-indent-7 {
          padding-left: 14em;
        }
        .blog-content .ql-indent-8 {
          padding-left: 16em;
        }
        .blog-content sub {
          vertical-align: sub;
          font-size: 0.8em;
        }
        .blog-content sup {
          vertical-align: super;
          font-size: 0.8em;
        }
      `}</style>
            {/* Animated Background - Fixed positioning with proper z-index */}
            <div className="fixed inset-0 bg-gradient-to-br from-blue-100 via-white to-green-100 z-[-1]">
                {/* Floating medical icons */}
                <div className="absolute top-20 left-10 text-blue-200 opacity-70 animate-pulse">
                    <FaHeartbeat className="w-16 h-16" />
                </div>
                <div className="absolute top-40 right-20 text-green-200 opacity-70 animate-pulse delay-1000">
                    <FaShieldAlt className="w-12 h-12" />
                </div>
                <div className="absolute bottom-32 left-20 text-blue-200 opacity-70 animate-pulse delay-500">
                    <FaUserMd className="w-14 h-14" />
                </div>
                <div className="absolute bottom-20 right-10 text-green-200 opacity-70 animate-pulse delay-700">
                    <FaHeartbeat className="w-10 h-10" />
                </div>
                <div className="absolute top-1/2 left-1/4 text-blue-200 opacity-70 animate-pulse delay-300">
                    <FaShieldAlt className="w-8 h-8" />
                </div>
                <div className="absolute top-1/3 right-1/4 text-green-200 opacity-70 animate-pulse delay-800">
                    <FaUserMd className="w-10 h-10" />
                </div>

                {/* Abstract medical pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-100 to-transparent transform rotate-12"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-green-100 to-transparent transform -rotate-12"></div>
                </div>

                {/* Floating circles */}
                <div className="absolute top-10 right-1/4 w-32 h-32 bg-blue-100 rounded-full opacity-70 animate-pulse"></div>
                <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-green-100 rounded-full opacity-70 animate-pulse delay-500"></div>
                <div className="absolute top-1/2 right-10 w-16 h-16 bg-blue-100 rounded-full opacity-70 animate-pulse delay-1000"></div>
            </div>

            {/* Navbar và Blog List */}
            <div className="relative z-10">
                {isGuest && (
                    <>
                        {/* Navigation Bar */}
                        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100">
                            <div className="container mx-auto px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                        className="text-2xl font-bold text-blue-600"
                                    >
                                        <Link to="/">
                                            <h1 className="text-2xl font-bold text-blue-600">
                                                <span className="text-blue-800">HIV</span>
                                                <span className="text-blue-600">TMSS</span>
                                            </h1>
                                        </Link>
                                    </motion.div>
                                    <div className="hidden md:flex space-x-8">
                                        <Button variant="ghost" className="text-gray-700 hover:text-blue-600">Giới thiệu</Button>
                                        <Button variant="ghost" className="text-gray-700 hover:text-blue-600">Tài liệu</Button>
                                        <Button variant="ghost" className="text-gray-700 hover:text-blue-600">Câu hỏi</Button>
                                        <Button variant="ghost" className="text-gray-700 hover:text-blue-600">Blog</Button>
                                    </div>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Link to="/login">
                                            <Button className="bg-blue-600 hover:bg-blue-700">Đăng nhập</Button>
                                        </Link>
                                    </motion.div>
                                </div>
                            </div>
                        </nav>

                        {/* Breadcrumb */}
                        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
                            <div className="container mx-auto px-6 py-3">
                                <nav className="flex text-sm text-gray-500">
                                    <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
                                    <span className="mx-2">/</span>
                                    <span className="text-gray-900">Blog</span>
                                </nav>
                            </div>
                        </div>
                    </>
                )}

                {/* Main Content Container */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-6xl mx-auto p-6"
                >
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Bài viết Blog</h1>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-600">{error}</div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="grid grid-cols-10 gap-4 p-4 bg-gray-50 border-b font-medium text-gray-600">
                                <div className="col-span-6">Tiêu đề & Nội dung</div>
                                <div className="col-span-2">Tác giả</div>
                                <div className="col-span-2">Ngày đăng</div>
                            </div>

                            <div className="divide-y">
                                {blogs.map((blog) => (
                                    <Link
                                        to={`/blog/${blog.blog_id}`}
                                        key={blog.blog_id}
                                        className="block hover:bg-gray-50 transition"
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="grid grid-cols-10 gap-4 p-4"
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
                                                        <div dangerouslySetInnerHTML={{ __html: blog.content.slice(0, 200) + '...' }} />
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="col-span-2 text-gray-600 flex items-center">
                                                {blog.full_name}
                                            </div>
                                            <div className="col-span-2 text-gray-600 flex items-center gap-1">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm">{formatDate(blog.created_date)}</span>
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default BlogListPage;