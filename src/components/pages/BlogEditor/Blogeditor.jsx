import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Image, Bold, Italic, List, ListOrdered, X, Plus } from 'lucide-react'
import { Button } from '../../ui/button';
import { toast } from "react-toastify";
import { decodeToken } from "../../../utils/tokenUtils";
import axios from '../../../setup/configAxios';

const BlogEditorPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        featuredImage: null, // File object cho ảnh bìa
        featuredImagePreview: '', // URL preview
        additionalImages: [], // Array các file ảnh bổ sung
        additionalImagePreviews: [] // Array các URL preview
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý chọn ảnh bìa
    const handleFeaturedImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Kiểm tra định dạng file
            if (!file.type.startsWith('image/')) {
                toast.error('Vui lòng chọn file ảnh hợp lệ!');
                return;
            }

            // Kiểm tra kích thước file (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error('Kích thước file không được vượt quá 10MB!');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData(prev => ({
                    ...prev,
                    featuredImage: file,
                    featuredImagePreview: event.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Xử lý thêm ảnh bổ sung
    const handleAdditionalImagesChange = (e) => {
        const files = Array.from(e.target.files);

        // Kiểm tra số lượng ảnh (max 5 ảnh bổ sung)
        if (formData.additionalImages.length + files.length > 5) {
            toast.error('Chỉ được phép tải tối đa 5 ảnh bổ sung!');
            return;
        }

        files.forEach(file => {
            // Kiểm tra định dạng file
            if (!file.type.startsWith('image/')) {
                toast.error(`File ${file.name} không phải là ảnh hợp lệ!`);
                return;
            }

            // Kiểm tra kích thước file (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error(`File ${file.name} vượt quá 10MB!`);
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData(prev => ({
                    ...prev,
                    additionalImages: [...prev.additionalImages, file],
                    additionalImagePreviews: [...prev.additionalImagePreviews, event.target.result]
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    // Xóa ảnh bổ sung
    const removeAdditionalImage = (index) => {
        setFormData(prev => ({
            ...prev,
            additionalImages: prev.additionalImages.filter((_, i) => i !== index),
            additionalImagePreviews: prev.additionalImagePreviews.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async () => {
        try {
            // Validate form
            if (!formData.title.trim()) {
                toast.error('Vui lòng nhập tiêu đề bài viết!');
                return;
            }

            if (!formData.content.trim()) {
                toast.error('Vui lòng nhập nội dung bài viết!');
                return;
            }

            const token = localStorage.getItem('access_token');
            const decodedToken = decodeToken(token);
            if (!decodedToken) {
                toast.error('Token không hợp lệ hoặc đã hết hạn!');
                return;
            }

            const accountId = decodedToken.id;

            // Tạo FormData cho multipart/form-data
            const formDataToSend = new FormData();

            // Tạo blogRequest object
            const blogRequest = {
                title: formData.title,
                content: formData.content,
                accountID: accountId
            };

            // Append blogRequest as JSON string
            formDataToSend.append('blogRequest', JSON.stringify(blogRequest));

            // Append files
            const allFiles = [];

            // Thêm ảnh bìa nếu có
            if (formData.featuredImage) {
                allFiles.push(formData.featuredImage);
            }

            // Thêm các ảnh bổ sung
            formData.additionalImages.forEach(file => {
                allFiles.push(file);
            });

            // Append tất cả files vào FormData
            allFiles.forEach(file => {
                formDataToSend.append('files', file);
            });

            // Gửi request với Content-Type multipart/form-data
            const res = await axios.post('/api/v1/blogs', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (res.status === 200 || res.data.http_status === 200) {
                toast.success('Tạo blog thành công!');
                navigate('/blog');
            } else {
                toast.error('Tạo blog thất bại!');
            }
        } catch (error) {
            console.error('Error creating blog:', error);
            if (error.response) {
                toast.error(`Lỗi: ${error.response.data.message || 'Không thể tạo blog'}`);
            } else {
                toast.error('Đã xảy ra lỗi khi gửi bài viết.');
            }
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
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ảnh bìa
                </label>
                <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
                    {formData.featuredImagePreview ? (
                        <img
                            src={formData.featuredImagePreview}
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
                        accept="image/*"
                        onChange={handleFeaturedImageChange}
                    />
                    <label
                        htmlFor="featuredImage"
                        className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-800 px-3 py-1 rounded-md text-sm flex items-center gap-1 cursor-pointer shadow transition-colors"
                    >
                        <Image className="h-4 w-4" />
                        {formData.featuredImagePreview ? 'Đổi ảnh' : 'Thêm ảnh'}
                    </label>
                </div>
            </div>

            {/* Additional Images */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ảnh bổ sung (tối đa 5 ảnh)
                </label>
                <div className="grid grid-cols-3 gap-4 mb-4">
                    {formData.additionalImagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={preview}
                                alt={`Additional ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => removeAdditionalImage(index)}
                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}

                    {formData.additionalImages.length < 5 && (
                        <div className="relative">
                            <input
                                type="file"
                                id="additionalImages"
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={handleAdditionalImagesChange}
                            />
                            <label
                                htmlFor="additionalImages"
                                className="flex items-center justify-center h-32 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors border-2 border-dashed border-gray-300"
                            >
                                <div className="text-center text-gray-500">
                                    <Plus className="h-6 w-6 mx-auto mb-1" />
                                    <span className="text-sm">Thêm ảnh</span>
                                </div>
                            </label>
                        </div>
                    )}
                </div>
            </div>

            {/* Editor Form */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-6">
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Tiêu đề bài viết <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-xl font-medium"
                            placeholder="Nhập tiêu đề bài viết"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Nội dung bài viết <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="sm" type="button">
                                    <Bold className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" type="button">
                                    <Italic className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" type="button">
                                    <List className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" type="button">
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
                            required
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default BlogEditorPage;