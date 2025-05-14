// components/LandingPage.jsx
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll-area"
import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom";

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
}

const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
}

// Hero carousel images
const carouselImages = [
    {
        id: 1,
        src: "https://static.vecteezy.com/system/resources/previews/016/394/383/large_2x/red-ribbon-hiv-concept-vector.jpg",
    },
    {
        id: 2,
        src: "https://th.bing.com/th/id/OIP.a7sxEyUGu4hP3xSw4L-xHwHaDt?cb=iwc2&rs=1&pid=ImgDetMain",
    },
    {
        id: 3,
        src: "https://wallpapercave.com/wp/wp2789220.jpg",
    },
    {
        id: 4,
        src: "https://th.bing.com/th/id/R.69c4141c56a9cf1e1a9b683994cb8f55?rik=LgUc5ZuTBiFQKg&pid=ImgRaw&r=0",
    }
];

export default function LandingPage() {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const [currentSlide, setCurrentSlide] = useState(0);
    const intervalRef = useRef(null);

    // Auto scroll through carousel
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
        }, 4000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    // Manual navigation functions
    const goToSlide = (index) => {
        setCurrentSlide(index);
        // Reset interval timer when manually changing slide
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
            }, 4000);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-white shadow-sm">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-2xl font-bold text-blue-600"
                        >
                            HIV TMSS
                        </motion.div>
                        <div className="hidden md:flex space-x-8">
                            <Button
                                variant="ghost"
                                onClick={() => scrollToSection('introduction')}
                                className="text-gray-700 hover:text-blue-600"
                            >
                                Giới thiệu
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => scrollToSection('education')}
                                className="text-gray-700 hover:text-blue-600"
                            >
                                Tài liệu giáo dục
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => scrollToSection('blog')}
                                className="text-gray-700 hover:text-blue-600"
                            >
                                Blog
                            </Button>
                        </div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link to="/login">
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    Đăng nhập
                                </Button>
                            </Link>

                        </motion.div>
                    </div>
                </div>
            </nav>

            {/* Main Content - Single Page Sections */}
            <ScrollArea className="flex-1">
                {/* Hero Section with Image Carousel */}
                <motion.section
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="relative bg-blue-50"
                >
                    {/* Hero Carousel with Centered Content */}
                    <div className="relative overflow-hidden h-96">
                        {carouselImages.map((image, index) => (
                            <motion.div
                                key={image.id}
                                className="absolute w-full h-full"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: currentSlide === index ? 1 : 0,
                                    zIndex: currentSlide === index ? 10 : 0
                                }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="w-full h-full relative">
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                                    {/* Centered Hero Content */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-20">
                                        <motion.h1
                                            variants={itemVariants}
                                            className="text-4xl md:text-5xl font-bold text-white mb-6"
                                        >
                                            Hệ thống hỗ trợ điều trị HIV
                                        </motion.h1>
                                        <motion.p
                                            variants={itemVariants}
                                            className="text-xl text-white mb-8 max-w-3xl mx-auto"
                                        >
                                            Cung cấp dịch vụ y tế chất lượng và hỗ trợ toàn diện cho bệnh nhân HIV
                                        </motion.p>
                                        <motion.div
                                            variants={containerVariants}
                                            className="flex flex-col sm:flex-row justify-center gap-4"
                                        >
                                            <motion.div variants={itemVariants}>
                                                <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg">
                                                    Đặt lịch hẹn ngay
                                                </Button>
                                            </motion.div>
                                            <motion.div variants={itemVariants}>
                                                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-800 px-8 py-6 text-lg">
                                                    Tìm hiểu thêm
                                                </Button>
                                            </motion.div>
                                        </motion.div>
                                    </div>

                                    <div className="absolute bottom-8 left-8 text-white">
                                        <p className="text-xl font-medium">{image.caption}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Carousel Navigation Dots */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                            {carouselImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Giới thiệu Section */}
                <SectionWrapper id="introduction" className="py-20">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        className="container mx-auto px-6"
                    >
                        <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-12">
                            Giới thiệu
                        </motion.h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <motion.div variants={itemVariants}>
                                <h3 className="text-2xl font-semibold mb-4">Về chúng tôi</h3>
                                <p className="text-gray-600 mb-4">
                                    Chúng tôi là trung tâm điều trị HIV với hơn 10 năm kinh nghiệm trong lĩnh vực chăm sóc sức khỏe
                                    cho bệnh nhân HIV. Đội ngũ bác sĩ chuyên môn cao cùng hệ thống trang thiết bị hiện đại luôn sẵn sàng
                                    phục vụ nhu cầu điều trị và tư vấn của người bệnh.
                                </p>
                                <p className="text-gray-600 mb-4">
                                    Mục tiêu của chúng tôi là cung cấp dịch vụ y tế chất lượng cao, giảm kỳ thị và phân biệt đối xử
                                    với người nhiễm HIV. Chúng tôi hiểu rằng sức khỏe thể chất và tinh thần đều quan trọng trong quá trình điều trị.
                                </p>
                                <p className="text-gray-600 mb-4">
                                    Hệ thống của chúng tôi không chỉ hỗ trợ về mặt y học mà còn cung cấp các chương trình tư vấn tâm lý,
                                    hỗ trợ xã hội và hướng dẫn bệnh nhân về các quyền lợi y tế và pháp lý. Chúng tôi tin rằng một cộng đồng
                                    được thông tin đầy đủ sẽ giúp người nhiễm HIV sống khỏe mạnh và tự tin hơn.
                                </p>
                                <p className="text-gray-600">
                                    Hãy đồng hành cùng chúng tôi trong hành trình xây dựng một môi trường chăm sóc toàn diện, an toàn và không kỳ thị.
                                </p>
                            </motion.div>
                            <motion.div
                                variants={itemVariants}
                                className="bg-gray-100 rounded-lg h-64 md:h-auto flex items-center justify-center overflow-hidden"
                            >
                                <motion.div
                                    initial={{ scale: 1.1 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                    className="w-full h-full flex items-center justify-center text-gray-400"
                                >
                                    <img
                                        src="https://media.istockphoto.com/photos/medical-center-picture-id183361838?k=6&m=183361838&s=170667a&w=0&h=zGZmRALhH51aVREWsCGGxpko1RY_YF5lSEhsq3SqByg="
                                        alt="Cơ sở y tế"
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </SectionWrapper>

                {/* Tài liệu giáo dục Section */}
                <SectionWrapper id="education" className="py-20 bg-gray-50">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        className="container mx-auto px-6"
                    >
                        <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-12">
                            Tài liệu giáo dục
                        </motion.h2>
                        <motion.div
                            variants={containerVariants}
                            className="grid md:grid-cols-3 gap-6"
                        >
                            {[1, 2, 3].map((item) => (
                                <motion.div key={item} variants={itemVariants}>
                                    <Card className="hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <CardTitle>Tài liệu {item}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-600 mb-4">
                                                Tài liệu hướng dẫn về phòng chống HIV, điều trị ARV và chăm sóc sức khỏe.
                                            </p>
                                            <Button variant="outline" className="w-full">
                                                Xem chi tiết
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </SectionWrapper>

                {/* Blog Section */}
                <SectionWrapper id="blog" className="py-20">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        className="container mx-auto px-6"
                    >
                        <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-12">
                            Blog chia sẻ kinh nghiệm
                        </motion.h2>
                        <motion.div
                            variants={containerVariants}
                            className="grid md:grid-cols-2 gap-8"
                        >
                            {[1, 2].map((post) => (
                                <motion.div key={post} variants={itemVariants}>
                                    <Card className="hover:shadow-lg transition-shadow">
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            className="bg-gray-100 h-48 rounded-t-lg overflow-hidden"
                                        >
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <img
                                                    src="https://th.bing.com/th/id/OIP.wMBXoW5lNOhhpNKstYmJGwHaFj?cb=iwc2&rs=1&pid=ImgDetMain"
                                                    alt="Blog post"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </motion.div>
                                        <CardHeader>
                                            <CardTitle>Kinh nghiệm điều trị HIV hiệu quả</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-600 mb-4">
                                                Chia sẻ từ bệnh nhân đã điều trị thành công và có cuộc sống khỏe mạnh.
                                            </p>
                                            <Button variant="link" className="px-0">
                                                Đọc thêm →
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </SectionWrapper>

                {/* Newsletter Section */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInVariants}
                    className="py-16 bg-blue-600 text-white"
                >
                    <div className="container mx-auto px-6 text-center">
                        <motion.h2
                            variants={itemVariants}
                            className="text-2xl font-bold mb-4"
                        >
                            Đăng ký nhận thông tin mới nhất
                        </motion.h2>
                        <motion.p
                            variants={itemVariants}
                            className="mb-6 max-w-2xl mx-auto"
                        >
                            Nhận các bài viết mới, tài liệu giáo dục và thông báo về các chương trình hỗ trợ.
                        </motion.p>
                        <motion.div
                            variants={containerVariants}
                            className="flex flex-col sm:flex-row justify-center gap-2 max-w-md mx-auto"
                        >
                            <motion.div variants={itemVariants} className="flex-1">
                                <Input
                                    type="email"
                                    placeholder="Email của bạn"
                                    className="bg-white text-gray-900"
                                />
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <Button variant="secondary" className="whitespace-nowrap">
                                    Đăng ký
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.section>
            </ScrollArea>

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-gray-800 text-white py-8"
            >
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <motion.div
                            initial={{ x: -20 }}
                            whileInView={{ x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="mb-4 md:mb-0"
                        >
                            <h3 className="text-xl font-bold">HIV TMSS</h3>
                            <p className="text-gray-400">Hệ thống hỗ trợ điều trị HIV</p>
                        </motion.div>
                        <motion.div
                            initial={{ x: 20 }}
                            whileInView={{ x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="flex space-x-6"
                        >
                            <a href="#" className="hover:text-blue-300">Chính sách bảo mật</a>
                            <a href="#" className="hover:text-blue-300">Điều khoản sử dụng</a>
                            <a href="#" className="hover:text-blue-300">Liên hệ</a>
                        </motion.div>
                    </div>
                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="mt-6 text-center text-gray-400 text-sm"
                    >
                        © {new Date().getFullYear()} HIV TMSS. All rights reserved.
                    </motion.div>
                </div>
            </motion.footer>
        </div>
    );
}

// Reusable animated section wrapper
function SectionWrapper({ id, className, children }) {
    return (
        <motion.section
            id={id}
            className={className}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
        >
            {children}
        </motion.section>
    );
}