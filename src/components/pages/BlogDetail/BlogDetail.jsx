import React from "react";
import { Button } from "../../ui/button"
import { Link } from "react-router-dom";
import { motion } from "framer-motion"

const BlogDetail = () => {
    return (
        <div className>
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-2xl font-bold text-blue-600"
                        >

                            <div className="flex items-center">
                                <Link to="/">
                                    <h1 className="text-2xl font-bold text-blue-600">
                                        <span className="text-blue-800">HIV</span>
                                        <span className="text-blue-600">TMSS</span>
                                    </h1>
                                </Link>
                            </div>

                        </motion.div>
                        <div className="hidden md:flex space-x-8">
                            <Button
                                variant="ghost"
                                // onClick={() => scrollToSection('introduction')}
                                className="text-gray-700 hover:text-blue-600"
                            >
                                Giới thiệu
                            </Button>
                            <Button
                                variant="ghost"
                                // onClick={() => scrollToSection('education')}
                                className="text-gray-700 hover:text-blue-600"
                            >
                                Tài liệu giáo dục
                            </Button>
                            <Button
                                variant="ghost"
                                // onClick={() => scrollToSection('faq')}
                                className="text-gray-700 hover:text-blue-600"
                            >
                                Câu hỏi thường gặp
                            </Button>
                            <Button
                                variant="ghost"
                                // onClick={() => scrollToSection('blog')}
                                className="text-gray-700 hover:text-blue-600"
                            >
                                Blog
                            </Button>

                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link to="/login">
                                <Button className="bg-blue-600 hover:bg-blue-700">Đăng nhập</Button>
                            </Link>
                        </motion.div>

                    </div>
                </div>
            </nav>



            <div className="max-h-screen py-10 px-4">
                <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
                    <h1 className="text-3xl font-bold text-[#373E79] mb-4">
                        Kinh nghiệm điều trị HIV hiệu quả
                    </h1>
                    <p className="text-sm text-gray-500 mb-6">Đăng ngày: 24/05/2025</p>
                    <div className="flex items-center justify-center w-full h-full ">
                        <img
                            src="https://www.huggies.com.vn/-/media/Project/be-6-thang-an-duoc-trai-cay-gi-thumb.jpeg"
                            alt="Blog detail"
                            className="max-w-[700px] max-h-[700px] object-cover rounded-md mb-6"
                        />
                    </div>
                    <div className="prose max-w-none text-gray-800 leading-relaxed">
                        <p>
                            Việc điều trị HIV hiệu quả đòi hỏi sự tuân thủ nghiêm ngặt phác đồ điều trị ARV.
                            Quan trọng nhất là phải khám định kỳ, sử dụng thuốc đúng giờ và duy trì lối sống lành mạnh.
                        </p>
                        <p>
                            Những người điều trị thành công thường duy trì tinh thần lạc quan, tham gia các nhóm hỗ trợ
                            và thường xuyên kiểm tra tải lượng virus.
                        </p>
                        <p>
                            Ngoài ra, chế độ ăn uống cân bằng và vận động đều đặn cũng đóng vai trò thiết yếu trong việc cải thiện sức khỏe tổng thể.
                        </p>
                    </div>

                    <div className="mt-10 text-right">
                        <Link to="/" className="text-blue-600 underline hover:text-blue-800">
                            ← Quay lại trang blog
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
