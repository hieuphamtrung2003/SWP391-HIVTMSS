import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Image, X, Plus, Eye, Edit3 } from 'lucide-react';
import { Button } from '../../ui/button';
import { toast } from "react-toastify";
import { decodeToken } from "../../../utils/tokenUtils";
import axios from '../../../setup/configAxios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const BlogEditorPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        featuredImage: null,
        featuredImagePreview: '',
        additionalImages: [],
        additionalImagePreviews: []
    });

    const [viewMode, setViewMode] = useState('edit'); // 'edit' | 'preview'
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

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

        if (formData.additionalImages.length + files.length > 5) {
            toast.error('Chỉ được phép tải tối đa 5 ảnh bổ sung!');
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

            // Gửi ảnh bìa
            if (formData.featuredImage) {
                formDataToSend.append('files', formData.featuredImage);
            }

            // Gửi các ảnh bổ sung
            formData.additionalImages.forEach(file => {
                formDataToSend.append('files', file);
            });

            // Gửi request
            const res = await axios.post('/api/v1/blogs', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (res.status === 200 || res.http_status === 200) {
                toast.success('Tạo blog thành công!');
                navigate('/my-blog');
            } else {
                toast.error('Tạo blog thất bại!');
            }

        } catch (error) {
            console.error('Error creating blog:', error);
            if (error.response?.data?.error) {
                toast.error(`Lỗi: ${error.response.data.error}`);
            } else {
                toast.error('Đã xảy ra lỗi khi gửi bài viết.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Custom styles for ReactQuill
    const quillStyles = {
        '.ql-container': {
            fontSize: '16px',
            fontFamily: 'inherit'
        },
        '.ql-editor': {
            minHeight: '400px',
            maxHeight: '600px',
            overflowY: 'auto'
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto p-6"
        >
            <style>{`
                .ql-container {
                    font-size: 16px;
                    font-family: inherit;
                }
                .ql-editor {
                    min-height: 400px;
                    max-height: 600px;
                    overflow-y: auto;
                }
                .ql-toolbar {
                    border-top: 1px solid #ccc;
                    border-left: 1px solid #ccc;
                    border-right: 1px solid #ccc;
                }
                .ql-container {
                    border-bottom: 1px solid #ccc;
                    border-left: 1px solid #ccc;
                    border-right: 1px solid #ccc;
                }
                .preview-content {
                    min-height: 400px;
                    max-height: 600px;
                    overflow-y: auto;
                    padding: 12px 15px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    background: white;
                }
                .preview-content h1 { font-size: 2em; font-weight: bold; margin: 0.67em 0; }
                .preview-content h2 { font-size: 1.5em; font-weight: bold; margin: 0.83em 0; }
                .preview-content h3 { font-size: 1.17em; font-weight: bold; margin: 1em 0; }
                .preview-content p { margin: 1em 0; }
                .preview-content ul, .preview-content ol { margin: 1em 0; padding-left: 40px; }
                .preview-content blockquote { margin: 1em 0; padding-left: 15px; border-left: 4px solid #ccc; }
                .preview-content code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
                .preview-content pre { background: #f4f4f4; padding: 10px; border-radius: 4px; overflow-x: auto; }
                .preview-content img { max-width: 100%; height: auto; }
                .preview-content a { color: #0066cc; text-decoration: underline; }
            `}</style>

            <div className="flex justify-between items-center mb-6">
                <Button variant="outline" asChild>
                    <Link to="/my-blog" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại
                    </Link>
                </Button>
                <div className="flex items-center gap-3">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <Button
                            variant={viewMode === 'edit' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('edit')}
                            className="flex items-center gap-1"
                        >
                            <Edit3 className="h-4 w-4" />
                            Chỉnh sửa
                        </Button>
                        <Button
                            variant={viewMode === 'preview' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('preview')}
                            className="flex items-center gap-1"
                        >
                            <Eye className="h-4 w-4" />
                            Xem trước
                        </Button>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nội dung bài viết <span className="text-red-500">*</span>
                        </label>

                        {viewMode === 'edit' ? (
                            <ReactQuill
                                theme="snow"
                                value={formData.content}
                                onChange={handleContentChange}
                                modules={quillModules}
                                formats={quillFormats}
                                placeholder="Viết nội dung bài viết tại đây..."
                            />
                        ) : (
                            <div className="preview-content">
                                <div
                                    dangerouslySetInnerHTML={{ __html: formData.content || '<p>Chưa có nội dung...</p>' }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default BlogEditorPage;