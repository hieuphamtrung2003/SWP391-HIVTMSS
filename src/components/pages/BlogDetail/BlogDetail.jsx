import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "../../ui/button";
import { motion } from "framer-motion";
import axios from "../../../setup/configAxios";
import { toast } from "react-toastify";
import { decodeToken } from '../../../utils/tokenUtils';
import { FaEye, FaEyeSlash, FaUserMd, FaShieldAlt, FaHeartbeat } from "react-icons/fa";

const BlogDetail = () => {
    const { blogId } = useParams();
    const navigate = useNavigate();

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fallbackImage = "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`/api/v1/blogs`, {
                    params: { id: blogId }
                });
                const blogData = res.data;

                if (!blogData) throw new Error("Blog not found");

                setBlog(blogData);
            } catch (error) {
                console.error(error);
                toast.error("Không thể tải thông tin blog.");
                navigate("/blog/:blogId");
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [blogId, navigate]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

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

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <h2 className="text-xl font-semibold">{error || "Bài viết không tồn tại."}</h2>
                    </div>
                    <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Quay lại trang blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-gray-50">

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

            {/* Animated Background - Now covers the entire page */}
            <div className="fixed inset-0 bg-gradient-to-br from-blue-100 via-white to-green-100 z-0">
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

            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4 shadow-2xl">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
                        </div>
                        <p className="text-gray-700 font-medium">Đang tải...</p>
                    </div>
                </div>
            )}

            {/* Navbar và Blog */}
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
                                    <Link to="/blog" className="hover:text-blue-600">Blog</Link>
                                    <span className="mx-2">/</span>
                                    <span className="text-gray-900 truncate">{blog.title}</span>
                                </nav>
                            </div>
                        </div>
                    </>
                )}

                {/* Blog Content */}
                <article className="container mx-auto px-6 py-8 max-w-4xl">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden"
                    >
                        {/* Article Header */}
                        <div className="p-6 md:p-8 lg:p-10">
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
                                        to="/blog"
                                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Quay lại trang blog
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
            </div>
        </div>
    );
};

export default BlogDetail;