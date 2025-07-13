import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "../../ui/button";
import { motion } from "framer-motion";
import axios from "../../../setup/configAxios";
import { toast } from "react-toastify";
import { decodeToken } from "../../../utils/tokenUtils";
import { MoreVertical, Edit, Trash2 } from "lucide-react";


const UserBlogDetail = () => {
    const { blogId } = useParams();
    const navigate = useNavigate();

    const [blog, setBlog] = useState(null);
    const [showOptions, setShowOptions] = useState(false);
    const [loading, setLoading] = useState(true);

    const fallbackImage = "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`/api/v1/blogs`, { params: { id: blogId } });
                if (!res.data) throw new Error("Không tìm thấy blog");
                setBlog(res.data);
            } catch (err) {
                toast.error("Không thể tải thông tin blog.");
                navigate("/blog");
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [blogId, navigate]);

    const optionsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/v1/blogs?id=${blog.blog_id}`);
            toast.success("Đã xóa blog!");
            navigate("/blogmanagement");
        } catch (err) {
            toast.error("Xóa thất bại.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải bài viết...</p>
                </div>
            </div>
        );
    }



    return (
        <div className="min-h-screen bg-gray-50">


            {/* Blog */}
            <article className="container mx-auto px-6 py-8 max-w-4xl">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                    <div className="relative p-6 md:p-8 lg:p-10">
                        {/* Nút More Options */}
                        {(blog.status === 'APPROVED' || blog.status === 'PENDING') && (
                            <div className="absolute top-4 right-4" ref={optionsRef}>
                                <Button variant="ghost" size="icon" onClick={() => setShowOptions(!showOptions)}>
                                    <MoreVertical className="w-5 h-5 text-gray-600" />
                                </Button>
                                {showOptions && (
                                    <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg border rounded-md z-10">
                                        <button
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                                            onClick={() => navigate(`/blog/edit/${blog.blog_id}`)}
                                        >
                                            <Edit className="w-4 h-4 text-blue-600" /> Chỉnh sửa
                                        </button>
                                        <button
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                                            onClick={handleDelete}
                                        >
                                            <Trash2 className="w-4 h-4" /> Xóa
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}



                        {/* Article Header */}

                        <header className="mb-8">
                            {/* Author Info */}
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 text-lg">{blog.full_name}</p>
                                    <p className="text-gray-500 text-sm">Tác giả</p>
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                                {blog.title}
                            </h1>

                            {/* Meta Info */}
                            <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600 mb-8">
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{formatDate(blog.created_date)}</span>
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{Math.ceil(blog.content.length / 1000)} phút đọc</span>
                                </div>
                            </div>
                        </header>

                        {/* Article Images */}
                        <div className="mb-8">
                            {blog.imageUrls && blog.imageUrls.length > 0 ? (
                                blog.imageUrls.length === 1 ? (
                                    // Single image
                                    <img
                                        src={blog.imageUrls[0]}
                                        alt={blog.title}
                                        className="w-full h-auto rounded-lg shadow-md"
                                        style={{
                                            maxHeight: '500px',
                                            objectFit: 'contain',
                                            objectPosition: 'center'
                                        }}
                                        onError={(e) => {
                                            e.target.src = fallbackImage;
                                        }}
                                    />
                                ) : (
                                    // Multiple images - Gallery
                                    <div className="space-y-4">
                                        {/* Main image */}
                                        <div className="relative">
                                            <img
                                                src={blog.imageUrls[0]}
                                                alt={`${blog.title} - Hình 1`}
                                                className="w-full h-auto rounded-lg shadow-md"
                                                style={{
                                                    maxHeight: '500px',
                                                    objectFit: 'contain',
                                                    objectPosition: 'center'
                                                }}
                                                onError={(e) => {
                                                    e.target.src = fallbackImage;
                                                }}
                                            />
                                            {blog.imageUrls.length > 1 && (
                                                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                                    1 / {blog.imageUrls.length}
                                                </div>
                                            )}
                                        </div>

                                        {/* Additional images */}
                                        {blog.imageUrls.length > 1 && (
                                            <div className="space-y-6">
                                                {blog.imageUrls.slice(1).map((imageUrl, index) => (
                                                    <div key={index} className="relative">
                                                        <img
                                                            src={imageUrl}
                                                            alt={`${blog.title} - Hình ${index + 2}`}
                                                            className="w-full h-auto rounded-lg shadow-md"
                                                            style={{
                                                                maxHeight: '500px',
                                                                objectFit: 'contain',
                                                                objectPosition: 'center'
                                                            }}
                                                            onError={(e) => {
                                                                e.target.src = fallbackImage;
                                                            }}
                                                        />
                                                        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                                            {index + 2} / {blog.imageUrls.length}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Image count indicator */}
                                        {blog.imageUrls.length > 1 && (
                                            <div className="flex items-center justify-center mt-4">
                                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span>{blog.imageUrls.length} hình ảnh</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            ) : (
                                // Fallback image if no images
                                <img
                                    src={fallbackImage}
                                    alt={blog.title}
                                    className="w-full h-auto rounded-lg shadow-md"
                                    style={{
                                        maxHeight: '500px',
                                        objectFit: 'contain',
                                        objectPosition: 'center'
                                    }}
                                />
                            )}
                        </div>

                        {/* Article Content */}
                        <div className="prose prose-lg max-w-none">
                            <div className="text-gray-800 leading-relaxed space-y-6">
                                {blog.content.split("\n").map((para, idx) => (
                                    para.trim() && (
                                        <p key={idx} className="text-base md:text-lg leading-7 md:leading-8">
                                            {para}
                                        </p>
                                    )
                                ))}
                            </div>
                        </div>

                        {/* Article Footer */}
                        <footer className="mt-12 pt-8 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <Link
                                    to="/my-blog"
                                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Quay lại
                                </Link>

                                {/* Social Share */}
                                {blog.status === 'APPROVED' && (
                                    <div className="flex space-x-4">
                                        <span className="text-sm text-gray-600">Chia sẻ:</span>
                                        {/* Facebook */}
                                        <a href="#" className="text-gray-400 hover:text-blue-600">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M22.675 0h-21.35C.599 0 0 .6 0 1.326v21.348C0 23.4.599 24 1.326 24h11.495v-9.294H9.691V11.41h3.13V8.797c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.797.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.587l-.467 3.296h-3.12V24h6.116C23.4 24 24 23.4 24 22.674V1.326C24 .6 23.4 0 22.675 0z" />
                                            </svg>
                                        </a>

                                        {/* Instagram */}
                                        <a href="#" className="text-gray-400 hover:text-pink-500">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849s-.012 3.584-.069 4.849c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.646.07-4.85.07s-3.584-.012-4.849-.07c-3.225-.149-4.771-1.664-4.919-4.919-.058-1.265-.07-1.645-.07-4.849s.013-3.584.07-4.849c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.048.014 8.329 0 8.738 0 12c0 3.262.014 3.671.073 4.952.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.69.072 4.948.072 3.259 0 3.667-.014 4.948-.072 4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.69.072-4.948s-.014-3.667-.072-4.948c-.2-4.358-2.618-6.78-6.98-6.98C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
                                            </svg>
                                        </a>

                                        {/* LinkedIn / X */}
                                        <a href="#" className="text-gray-400 hover:text-blue-700">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M19 0h-14C2.239 0 0 2.239 0 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5V5c0-2.761-2.238-5-5-5zM7.019 20H3.982V9h3.037v11zM5.5 7.58c-.974 0-1.76-.786-1.76-1.755s.786-1.755 1.76-1.755 1.76.786 1.76 1.755-.786 1.755-1.76 1.755zM20 20h-3.019v-5.471c0-1.305-.023-2.985-1.82-2.985-1.821 0-2.101 1.421-2.101 2.888V20h-3.019V9h2.899v1.507h.041c.404-.766 1.389-1.573 2.858-1.573 3.057 0 3.623 2.013 3.623 4.627V20z" />
                                            </svg>
                                        </a>

                                    </div>
                                )}

                            </div>
                        </footer>

                    </div>
                </motion.div>
            </article>
        </div >
    );
};

export default UserBlogDetail;
