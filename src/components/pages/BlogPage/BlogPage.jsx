import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Image, Edit, Trash2, Plus, Calendar, Eye, Clock, Save, X } from 'lucide-react'
import { Button } from '../../ui/button'
import axios from '../../../setup/configAxios'
import { decodeToken } from '../../../utils/tokenUtils'
import { toast } from 'react-toastify'

const BlogListPage = () => {
  const [blogs, setBlogs] = useState([])
  const [editingBlog, setEditingBlog] = useState(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      const token = localStorage.getItem('access_token')
      const decoded = decodeToken(token)
      if (!decoded) return

      const res = await axios.get(`/api/v1/blogs/account?accountId=${decoded.id}`)
      setBlogs(res.data)
    }

    fetchBlogs()
  }, [])

  const handleDelete = async (blogId) => {
    try {
      const blog = blogs.find((b) => b.blog_id === blogId);
      if (!blog) {
        toast.error('Không tìm thấy blog!');
        return;
      }

      await axios.delete(`/api/v1/blogs?id=${blogId}`, {
        data: {
          title: blog.title,
          content: blog.content,
          status: blog.status,
          imageUrl: 'https://upload.wikimedia.org/wikipedia/vi/5/5f/Original_Doge_meme.jpg',
          isHidden: true
        }
      });

      toast.success('Đã xóa blog!');
      setBlogs(blogs.filter((b) => b.blog_id !== blogId));
    } catch (err) {
      toast.error('Xóa thất bại.');
      console.error(err);
    }
  };


  const handleEditSubmit = async () => {
    try {
      const { blog_id, title, content, image_url, is_hidden } = editingBlog
      await axios.put(`/api/v1/blogs?id=${blog_id}`, {
        title,
        content,
        imageUrl: image_url

      })
      toast.success('Cập nhật blog thành công!')
      setEditingBlog(null)
      // Refresh lại danh sách
      const token = localStorage.getItem('access_token')
      const decoded = decodeToken(token)
      const res = await axios.get(`/api/v1/blogs/account?accountId=${decoded.id}`)
      setBlogs(res.data)
    } catch (err) {
      toast.error('Lỗi khi cập nhật blog')
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Blog</h1>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link to="/blogeditor" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Tạo bài viết mới
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b font-medium text-gray-600">
          <div className="col-span-6">Tiêu đề</div>
          <div className="col-span-2">Tác giả</div>
          <div className="col-span-2">Ngày đăng</div>
          <div className="col-span-1">Trạng thái</div>
          <div className="col-span-1">Thao tác</div>
        </div>

        <div className="divide-y">
          {blogs.map((blog) => (
            <motion.div key={blog.blog_id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50">
              <div className="col-span-6">
                <h3 className="font-medium text-gray-800">{blog.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{blog.content.slice(0, 60)}...</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <Clock className="h-3 w-3" />
                  5 phút
                  <Eye className="h-3 w-3 ml-4" />
                  {blog.view_count || 0} lượt xem
                </div>
              </div>
              <div className="col-span-2 text-gray-600">{blog.full_name}</div>
              <div className="col-span-2 text-gray-600 flex items-center gap-1">
                <Calendar className="h-4 w-4 text-gray-400" />
                {new Date(blog.created_date).toLocaleDateString('vi-VN')}
              </div>
              <div className="col-span-1">
                <span className={`px-2 py-1 rounded-full text-xs ${blog.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {blog.status === 'PUBLISHED' ? 'Đã đăng' : 'Bản nháp'}
                </span>
              </div>
              <div className="col-span-1 flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() =>
                  setEditingBlog({
                    ...blog,
                    featuredImage: blog.image_url || null, // thêm dòng này
                  })
                }
                >
                  <Edit className="h-4 w-4 text-blue-600" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(blog.blog_id)}>
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Form chỉnh sửa xuất hiện khi có editingBlog */}
      {editingBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
            <button className="absolute top-4 right-4" onClick={() => setEditingBlog(null)}>
              <X className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-xl font-bold mb-4">Chỉnh sửa Blog</h2>
            <div className="mb-4">
              {/* Featured Image */}
              <div className="relative h-48 bg-gray-100 mb-4">
                {editingBlog.featuredImage ? (
                  <img
                    src={editingBlog.featuredImage}
                    alt="Featured"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <Image className="h-8 w-8 mx-auto mb-2" />
                      <p>Thêm ảnh bìa</p>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  id="popupFeaturedImage"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setEditingBlog({ ...editingBlog, featuredImage: event.target.result, image_url: event.target.result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <label
                  htmlFor="popupFeaturedImage"
                  className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-800 px-3 py-1 rounded-md text-sm flex items-center gap-1 cursor-pointer shadow"
                >
                  <Image className="h-4 w-4" />
                  {editingBlog.featuredImage ? 'Đổi ảnh' : 'Thêm ảnh'}
                </label>
              </div>
              <label className="block text-sm font-medium mb-1">Tiêu đề</label>
              <input
                type="text"
                value={editingBlog.title}
                onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Nội dung</label>
              <textarea
                rows="10"
                value={editingBlog.content}
                onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <Button onClick={handleEditSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="h-4 w-4 mr-2" />
              Lưu bài viết
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default BlogListPage
