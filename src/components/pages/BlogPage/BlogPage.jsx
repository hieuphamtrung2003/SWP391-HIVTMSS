import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Edit, Trash2, Plus, Calendar, Eye, Clock } from 'lucide-react'
import { Button } from '../../ui/button'

const BlogListPage = () => {
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: 'Cách quản lý điều trị HIV hiệu quả',
      excerpt: 'Những phương pháp mới nhất trong điều trị HIV giúp bệnh nhân sống khỏe mạnh hơn...',
      author: 'Tịnh',
      date: '15/06/2024',
      status: 'published',
      readTime: '5 phút',
      views: 1245
    },
    {
      id: 2,
      title: 'Dinh dưỡng cho bệnh nhân HIV',
      excerpt: 'Chế độ ăn uống hợp lý giúp tăng cường hệ miễn dịch cho bệnh nhân HIV...',
      author: 'Tịnh',
      date: '10/06/2024',
      status: 'published',
      readTime: '4 phút',
      views: 892
    },
    {
      id: 3,
      title: 'Giảm kỳ thị với người nhiễm HIV',
      excerpt: 'Các biện pháp giúp cộng đồng hiểu đúng về HIV và không phân biệt đối xử...',
      author: 'Tịnh',
      date: '05/06/2024',
      status: 'draft',
      readTime: '6 phút',
      views: 0
    }
  ])

  const deleteBlog = (id) => {
    setBlogs(blogs.filter(blog => blog.id !== id))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto p-6"
    >
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
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b font-medium text-gray-600">
          <div className="col-span-6">Tiêu đề</div>
          <div className="col-span-2">Tác giả</div>
          <div className="col-span-2">Ngày đăng</div>
          <div className="col-span-1">Trạng thái</div>
          <div className="col-span-1">Thao tác</div>
        </div>

        {/* Blog List */}
        <div className="divide-y">
          {blogs.map((blog) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50"
            >
              <div className="col-span-6">
                <h3 className="font-medium text-gray-800">{blog.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{blog.excerpt}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {blog.readTime}
                  </div>
                  {blog.status === 'published' && (
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {blog.views} lượt xem
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-2 text-gray-600">{blog.author}</div>
              <div className="col-span-2 text-gray-600 flex items-center gap-1">
                <Calendar className="h-4 w-4 text-gray-400" />
                {blog.date}
              </div>
              <div className="col-span-1">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  blog.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {blog.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                </span>
              </div>
              <div className="col-span-1 flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/blog/edit/${blog.id}`}>
                    <Edit className="h-4 w-4 text-blue-600" />
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteBlog(blog.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default BlogListPage