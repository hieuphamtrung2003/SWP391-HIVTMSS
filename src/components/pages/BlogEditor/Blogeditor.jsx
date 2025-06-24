import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Image, Bold, Italic, List, ListOrdered } from 'lucide-react'
import { Button } from '../../ui/button';
import axios from "../../../setup/configAxios";
import { toast } from "react-toastify";
import { decodeToken } from "../../../utils/tokenUtils";

const BlogEditorPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        imageUrl: '', // giữ lại để đúng format payload nhưng không dùng
        featuredImage: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const decodedToken = decodeToken(token);
            if (!decodedToken) {
                toast.error('Token không hợp lệ hoặc đã hết hạn!');
                return;
            }

            const accountId = decodedToken.id;

            const payload = {
                title: formData.title,
                content: formData.content,
                imageUrl: '',
                accountID: accountId
            };

            const res = await axios.post('/api/v1/blogs', payload);

            if (res.http_status === 200) {
                toast.success('Tạo blog thành công!');
                navigate('/blog');
            } else {
                toast.error('Tạo blog thất bại!');
            }
        } catch (error) {
            console.error(error);
            toast.error('Đã xảy ra lỗi khi gửi bài viết.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto p-6"
        >

            <div className="flex justify-between items-center mb-6">
                <Button variant="outline" asChild>
                    <Link to="/blog" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại
                    </Link>
                </Button>
                <Button
                    className="bg-blue-600 hover:bg-blue-700 flex gap-2"
                    onClick={handleSubmit}
                >
                    <Save className="h-4 w-4" />
                    Lưu bài viết
                </Button>
            </div>

            {/* Featured Image */}
            <div className="relative h-48 bg-gray-100">
                {formData.featuredImage ? (
                    <img
                        src={formData.featuredImage}
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
                    id="featuredImage"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files[0]
                        if (file) {
                            const reader = new FileReader()
                            reader.onload = (event) => {
                                setFormData({
                                    ...formData,
                                    featuredImage: event.target.result
                                })
                            }
                            reader.readAsDataURL(file)
                        }
                    }}
                />
                <label
                    htmlFor="featuredImage"
                    className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-800 px-3 py-1 rounded-md text-sm flex items-center gap-1 cursor-pointer shadow"
                >
                    <Image className="h-4 w-4" />
                    {formData.featuredImage ? 'Đổi ảnh' : 'Thêm ảnh'}
                </label>
            </div>
            {/* Editor Form */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Tiêu đề bài viết
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-xl font-medium"
                            placeholder="Nhập tiêu đề bài viết"
                        />
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Nội dung bài viết
                            </label>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="sm">
                                    <Bold className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <Italic className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <List className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <ListOrdered className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows="15"
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none font-sans"
                            placeholder="Viết nội dung bài viết tại đây..."
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default BlogEditorPage;
