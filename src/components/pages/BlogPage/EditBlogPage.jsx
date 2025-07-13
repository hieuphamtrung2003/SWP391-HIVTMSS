import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Image, Bold, Italic, List, ListOrdered, X, Plus, Eye, Edit3 } from 'lucide-react';
import { Button } from '../../ui/button';
import axios from '../../../setup/configAxios';
import { toast } from 'react-toastify';
import { decodeToken } from '../../../utils/tokenUtils';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditBlogPage = () => {
    const { blogId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        featuredImage: null,
        featuredImagePreview: '',
        additionalImages: [],
        additionalImagePreviews: [],
        existingImageUrls: [], // Lưu URLs hình ảnh hiện tại từ server
        status: '',
        isHidden: false
    });
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [viewMode, setViewMode] = useState('edit'); // 'edit' | 'preview'

    // ReactQuill configuration
    const quillModules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                ['blockquote', 'code-block'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'align': [] }],
                ['link', 'image', 'video'],
                ['clean']
            ],
        },
        clipboard: {
            matchVisual: false,
        }
    }), []);

    const quillFormats = [
        'header', 'bold', 'italic', 'underline', 'strike',
        'color', 'background', 'script', 'blockquote', 'code-block',
        'list', 'bullet', 'indent', 'align', 'link', 'image', 'video'
    ];

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`/api/v1/blogs?id=${blogId}`);
                const blog = res.data;

                if (!blog) throw new Error('Blog not found');

                setFormData({
                    title: blog.title,
                    content: blog.content,
                    featuredImage: null,
                    featuredImagePreview: blog.imageUrls && blog.imageUrls.length > 0 ? blog.imageUrls[0] : '',
                    additionalImages: [],
                    additionalImagePreviews: blog.imageUrls && blog.imageUrls.length > 1 ? blog.imageUrls.slice(1) : [],
                    existingImageUrls: blog.imageUrls || [],
                    status: blog.status,
                    isHidden: blog.isHidden
                });
                setLoading(false);
            } catch (error) {
                console.error(error);
                toast.error('Không thể tải thông tin blog.');
                navigate('/my-blog');
            }
        };

        fetchBlog();
    }, [blogId, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (content) => {
        setFormData(prev => ({ ...prev, content }));
    };

    // Xử lý chọn ảnh bìa
    const handleFeaturedImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Vui lòng chọn file ảnh hợp lệ!');
                return;
            }

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
        const currentTotalImages = formData.additionalImages.length + formData.additionalImagePreviews.length;

        if (currentTotalImages + files.length > 5) {
            toast.error('Chỉ được phép có tối đa 5 ảnh bổ sung!');
            return;
        }

        files.forEach(file => {
            if (!file.type.startsWith('image/')) {
                toast.error(`File ${file.name} không phải là ảnh hợp lệ!`);
                return;
            }

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

    // Xóa ảnh bổ sung mới
    const removeAdditionalImage = (index) => {
        setFormData(prev => ({
            ...prev,
            additionalImages: prev.additionalImages.filter((_, i) => i !== index),
            additionalImagePreviews: prev.additionalImagePreviews.filter((_, i) => i !== index)
        }));
    };

    // Xóa ảnh bổ sung hiện tại (từ server)
    const removeExistingAdditionalImage = (index) => {
        setFormData(prev => {
            const newExistingUrls = [...prev.existingImageUrls];
            newExistingUrls.splice(index + 1, 1); // +1 vì index 0 là ảnh bìa
            return {
                ...prev,
                existingImageUrls: newExistingUrls
            };
        });
    };

    // Xóa ảnh bìa hiện tại
    const removeFeaturedImage = () => {
        setFormData(prev => ({
            ...prev,
            featuredImage: null,
            featuredImagePreview: '',
            existingImageUrls: prev.existingImageUrls.length > 0 ? prev.existingImageUrls.slice(1) : []
        }));
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            // Kiểm tra dữ liệu
            if (!formData.title.trim()) {
                toast.error('Vui lòng nhập tiêu đề bài viết!');
                return;
            }

            if (!formData.content.trim() || formData.content === '<p><br></p>') {
                toast.error('Vui lòng nhập nội dung bài viết!');
                return;
            }

            const token = localStorage.getItem('access_token');
            if (!token) {
                toast.error('Bạn chưa đăng nhập!');
                return;
            }

            const decodedToken = decodeToken(token);
            if (!decodedToken || !decodedToken.id) {
                toast.error('Token không hợp lệ hoặc đã hết hạn!');
                return;
            }

            const accountId = decodedToken.id;

            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('content', formData.content);
            formDataToSend.append('accountID', accountId);
            formDataToSend.append('status', formData.status);
            formDataToSend.append('isHidden', formData.isHidden);

            // Gửi ảnh bìa nếu có thay đổi
            if (formData.featuredImage) {
                formDataToSend.append('files', formData.featuredImage);
            }

            // Gửi các ảnh bổ sung mới
            formData.additionalImages.forEach(file => {
                formDataToSend.append('files', file);
            });

            // Gửi thông tin về ảnh hiện tại (để server biết ảnh nào cần giữ lại)
            if (formData.existingImageUrls.length > 0) {
                formDataToSend.append('existingImageUrls', JSON.stringify(formData.existingImageUrls));
            }

            // Gửi request PUT
            const res = await axios.put(`/api/v1/blogs?id=${blogId}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (res.status === 200 || res.http_status === 200) {
                toast.success('Cập nhật blog thành công!');
                navigate('/my-blog');
            } else {
                toast.error('Cập nhật blog thất bại!');
            }

        } catch (error) {
            console.error('Error updating blog:', error);
            if (error.response?.data?.error) {
                toast.error(`Lỗi: ${error.response.data.error}`);
            } else {
                toast.error('Đã xảy ra lỗi khi cập nhật bài viết.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải thông tin bài viết...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" asChild>
                        <Link to="/my-blog" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Quay lại
                        </Link>
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button
                            variant={viewMode === 'edit' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('edit')}
                        >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                        </Button>
                        <Button
                            variant={viewMode === 'preview' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('preview')}
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            Xem trước
                        </Button>
                    </div>
                </div>
                <Button
                    className="bg-blue-600 hover:bg-blue-700 flex gap-2"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    <Save className="h-4 w-4" />
                    {isSubmitting ? 'Đang lưu...' : 'Lưu bài viết'}
                </Button>
            </div>

            {viewMode === 'edit' ? (
                <div className="space-y-6">
                    {/* Featured Image Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold mb-4">Ảnh bìa</h3>
                        <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
                            {formData.featuredImagePreview ? (
                                <>
                                    <img
                                        src={formData.featuredImagePreview}
                                        alt="Featured"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={removeFeaturedImage}
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </>
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
                                className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-800 px-3 py-1 rounded-md text-sm flex items-center gap-1 cursor-pointer shadow"
                            >
                                <Image className="h-4 w-4" />
                                {formData.featuredImagePreview ? 'Đổi ảnh' : 'Thêm ảnh'}
                            </label>
                        </div>
                    </div>

                    {/* Additional Images Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Ảnh bổ sung (tối đa 5 ảnh)</h3>
                            <div className="flex items-center gap-2">
                                <input
                                    type="file"
                                    id="additionalImages"
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                    onChange={handleAdditionalImagesChange}
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => document.getElementById('additionalImages').click()}
                                    disabled={formData.additionalImages.length + formData.additionalImagePreviews.length >= 5}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Thêm ảnh
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {/* Hiển thị ảnh hiện tại từ server (trừ ảnh bìa) */}
                            {formData.existingImageUrls.slice(1).map((url, index) => (
                                <div key={`existing-${index}`} className="relative group">
                                    <img
                                        src={url}
                                        alt={`Existing ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <button
                                        onClick={() => removeExistingAdditionalImage(index)}
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                    <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                                        Hiện tại
                                    </div>
                                </div>
                            ))}

                            {/* Hiển thị ảnh mới được thêm */}
                            {formData.additionalImagePreviews.map((preview, index) => (
                                <div key={`new-${index}`} className="relative group">
                                    <img
                                        src={preview}
                                        alt={`New ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <button
                                        onClick={() => removeAdditionalImage(index)}
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                    <div className="absolute bottom-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs">
                                        Mới
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Title Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Tiêu đề bài viết
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xl font-medium"
                            placeholder="Nhập tiêu đề bài viết"
                        />
                    </div>

                    {/* Content Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nội dung bài viết
                        </label>
                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                            <ReactQuill
                                value={formData.content}
                                onChange={handleContentChange}
                                modules={quillModules}
                                formats={quillFormats}
                                theme="snow"
                                style={{
                                    height: '400px',
                                    marginBottom: '50px'
                                }}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                /* Preview Mode */
                <div className="bg-white rounded-lg shadow-sm p-8">
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
                        .blog-content img { 
                            max-width: 100%; 
                            height: auto; 
                            border-radius: 8px;
                            margin: 1.5em 0;
                            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                        }
                        .blog-content strong { 
                            font-weight: 600; 
                            color: #111827;
                        }
                    `}</style>

                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        {formData.title || 'Tiêu đề bài viết'}
                    </h1>

                    {/* Preview Images */}
                    {formData.featuredImagePreview && (
                        <div className="mb-6">
                            <img
                                src={formData.featuredImagePreview}
                                alt="Featured"
                                className="w-full max-h-96 object-cover rounded-lg shadow-md"
                            />
                        </div>
                    )}

                    {/* Additional Images Preview */}
                    {(formData.existingImageUrls.length > 1 || formData.additionalImagePreviews.length > 0) && (
                        <div className="mb-6 space-y-4">
                            {formData.existingImageUrls.slice(1).map((url, index) => (
                                <img
                                    key={`preview-existing-${index}`}
                                    src={url}
                                    alt={`Additional ${index + 1}`}
                                    className="w-full max-h-96 object-cover rounded-lg shadow-md"
                                />
                            ))}
                            {formData.additionalImagePreviews.map((preview, index) => (
                                <img
                                    key={`preview-new-${index}`}
                                    src={preview}
                                    alt={`New Additional ${index + 1}`}
                                    className="w-full max-h-96 object-cover rounded-lg shadow-md"
                                />
                            ))}
                        </div>
                    )}

                    <div className="blog-content">
                        <div dangerouslySetInnerHTML={{ __html: formData.content || '<p>Nội dung bài viết sẽ hiển thị ở đây...</p>' }} />
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default EditBlogPage;