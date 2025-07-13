import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Image, Edit, Trash2, Plus, Calendar } from 'lucide-react';
import { Button } from '../../ui/button';
import axios from '../../../setup/configAxios';
import { decodeToken } from '../../../utils/tokenUtils';
import { toast } from 'react-toastify';

const BlogManagementPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      const token = localStorage.getItem('access_token');
      const decoded = decodeToken(token);
      if (!decoded) return;

      const res = await axios.get(`/api/v1/blogs/account?accountId=${decoded.id}`);
      const visibleBlogs = res.data.filter(blog => blog.is_hidden === true);
      setBlogs(visibleBlogs);
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    if (filterStatus === 'ALL') {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(blogs.filter(blog => blog.status === filterStatus));
    }
  }, [blogs, filterStatus]);

  const handleDelete = async (blogId) => {
    try {
      await axios.delete(`/api/v1/blogs?id=${blogId}`);
      toast.success('Đã xóa blog!');
      setBlogs(blogs.filter((b) => b.blog_id !== blogId));
    } catch (err) {
      toast.error('Xóa thất bại.');
      console.error(err);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto p-6"
    >
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

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Blog</h1>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link to="/blogeditor" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Tạo bài viết mới
          </Link>
        </Button>
      </div>

      {/* Bộ lọc trạng thái */}
      <div className="mb-4 flex items-center gap-4">
        <label htmlFor="statusFilter" className="text-sm text-gray-700">
          Lọc theo trạng thái:
        </label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">Tất cả</option>
          <option value="PENDING">Chờ duyệt</option>
          <option value="APPROVED">Đã duyệt</option>
          <option value="REJECTED">Từ chối</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b font-medium text-gray-600">
          <div className="col-span-6">Tiêu đề & Nội dung</div>
          <div className="col-span-2">Tác giả</div>
          <div className="col-span-2">Ngày đăng</div>
          <div className="col-span-1">Trạng thái</div>
          <div className="col-span-1">Thao tác</div>
        </div>

        <div className="divide-y">
          {filteredBlogs.map((blog) => (
            <Link
              to={`/my-blog/${blog.blog_id}`}
              key={blog.blog_id}
              className="block hover:bg-gray-50 transition"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-12 gap-4 p-4"
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
                    <div className="text-sm text-gray-500 mt-1 line-clamp-2 blog-content">
                      <div dangerouslySetInnerHTML={{ __html: blog.content.slice(0, 200) + '...' }} />
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
                  {blog.status !== 'REJECTED' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/my-blog/edit/${blog.blog_id}`);
                      }}
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(blog.blog_id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default BlogManagementPage;