// components/LandingPage.jsx
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll-area"
import { AnimatePresence, motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <motion.div
            whileInView="visible"
            variants={itemVariants}
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 text-left flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
            >
                <h3 className="font-medium text-gray-800">{question}</h3>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 pt-0 text-gray-600 bg-gray-50">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

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
        src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        caption: "Chăm sóc toàn diện cho bệnh nhân HIV"
    },
    {
        id: 2,
        src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        caption: "Đội ngũ bác sĩ chuyên môn cao"
    },
    {
        id: 3,
        src: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80",
        caption: "Cơ sở vật chất hiện đại"
    },
    {
        id: 4,
        src: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        caption: "Hỗ trợ tâm lý và xã hội"
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
    const educationScrollRef = useRef(null);

    // Auto scroll through carousel
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
        }, 5000);

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
            }, 5000);
        }
    };

    // Scroll education section horizontally
    const scrollEducation = (direction) => {
        if (educationScrollRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            educationScrollRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="bg-white">
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 backdrop-blur-sm bg-opacity-90">
                <div className="container mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-2xl font-bold text-blue-600"
                        >
                            <div className="flex items-center">
                                <Link to="/">
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                        </svg>
                                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                            HIV TMSS
                                        </h1>
                                    </div>
                                </Link>
                            </div>
                        </motion.div>
                        <div className="hidden md:flex space-x-6">
                            <Button
                                variant="ghost"
                                onClick={() => scrollToSection('introduction')}
                                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium"
                            >
                                Giới thiệu
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => scrollToSection('education')}
                                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium"
                            >
                                Tài liệu
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => scrollToSection('faq')}
                                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium"
                            >
                                Câu hỏi
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => scrollToSection('blog')}
                                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium"
                            >
                                Blog
                            </Button>
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link to="/login">
                                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md px-6 py-2 text-white">
                                    Đăng nhập
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </nav>

            <div className="min-h-screen flex flex-col mx-auto w-full max-w-7xl">

                {/* Main Content - Single Page Sections */}
                <ScrollArea className="flex-1">
                    {/* Hero Section with Image Carousel */}
                    <motion.section
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="relative"
                    >
                        {/* Hero Carousel with Centered Content */}
                        <div className="relative overflow-hidden h-[32rem] rounded-xl mt-4 shadow-xl">
                            {carouselImages.map((image, index) => (
                                <motion.div
                                    key={image.id}
                                    className="absolute w-full h-full"
                                    initial={{ opacity: 0 }}
                                    animate={{
                                        opacity: currentSlide === index ? 1 : 0,
                                        zIndex: currentSlide === index ? 10 : 0
                                    }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                >
                                    <div className="w-full h-full relative">
                                        <img
                                            src={image.src}
                                            alt={image.alt}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

                                        {/* Centered Hero Content */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-20">
                                            <motion.h1
                                                variants={itemVariants}
                                                className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
                                            >
                                                Hệ thống hỗ trợ điều trị HIV <br /> <span className="text-blue-300">chuyên nghiệp & tận tâm</span>
                                            </motion.h1>
                                            <motion.p
                                                variants={itemVariants}
                                                className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto"
                                            >
                                                Cung cấp dịch vụ y tế chất lượng và hỗ trợ toàn diện cho bệnh nhân HIV với đội ngũ chuyên gia hàng đầu
                                            </motion.p>
                                            <motion.div
                                                variants={containerVariants}
                                                className="flex flex-col sm:flex-row justify-center gap-4"
                                            >
                                                <motion.div variants={itemVariants}>
                                                    <Link to="/login">
                                                        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-4 text-lg shadow-lg">
                                                            Đặt lịch hẹn ngay
                                                        </Button>
                                                    </Link>
                                                </motion.div>
                                                <motion.div variants={itemVariants}>
                                                    <Link to="/login">
                                                        <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-800 px-8 py-4 text-lg backdrop-blur-sm">
                                                            Tư vấn trực tuyến
                                                        </Button>
                                                    </Link>
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
                            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
                                {carouselImages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-white w-6' : 'bg-white bg-opacity-50'}`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.section>

                    {/* Stats Section */}
                    <section className="py-12 bg-white">
                        <div className="container mx-auto px-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    viewport={{ once: true }}
                                    className="p-6 bg-blue-50 rounded-xl"
                                >
                                    <h3 className="text-3xl font-bold text-blue-600 mb-2">10+</h3>
                                    <p className="text-gray-600">Năm kinh nghiệm</p>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    viewport={{ once: true }}
                                    className="p-6 bg-blue-50 rounded-xl"
                                >
                                    <h3 className="text-3xl font-bold text-blue-600 mb-2">5,000+</h3>
                                    <p className="text-gray-600">Bệnh nhân điều trị</p>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    viewport={{ once: true }}
                                    className="p-6 bg-blue-50 rounded-xl"
                                >
                                    <h3 className="text-3xl font-bold text-blue-600 mb-2">99%</h3>
                                    <p className="text-gray-600">Hài lòng dịch vụ</p>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    viewport={{ once: true }}
                                    className="p-6 bg-blue-50 rounded-xl"
                                >
                                    <h3 className="text-3xl font-bold text-blue-600 mb-2">24/7</h3>
                                    <p className="text-gray-600">Hỗ trợ trực tuyến</p>
                                </motion.div>
                            </div>
                        </div>
                    </section>

                    {/* Giới thiệu Section */}
                    <SectionWrapper id="introduction" className="py-20 bg-gray-50">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={containerVariants}
                            className="container mx-auto px-6"
                        >
                            <div className="text-center mb-16">
                                <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                    Giới thiệu về chúng tôi
                                </motion.h2>
                                <motion.div variants={itemVariants} className="w-20 h-1 bg-blue-600 mx-auto"></motion.div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-12 items-center">
                                <motion.div variants={itemVariants} className="space-y-6">
                                    <h3 className="text-2xl font-semibold text-gray-800">Chăm sóc toàn diện cho bệnh nhân HIV</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Với hơn 10 năm kinh nghiệm trong lĩnh vực chăm sóc sức khỏe cho bệnh nhân HIV, chúng tôi tự hào là một trong những trung tâm điều trị HIV hàng đầu với đội ngũ bác sĩ chuyên môn cao và hệ thống trang thiết bị hiện đại.
                                    </p>
                                    <p className="text-gray-600 leading-relaxed">
                                        Chúng tôi không chỉ cung cấp dịch vụ y tế chất lượng cao mà còn cam kết giảm thiểu kỳ thị và phân biệt đối xử với người nhiễm HIV, giúp họ có cuộc sống tốt đẹp hơn.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 mt-1">
                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-600">Điều trị ARV hiệu quả</p>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 mt-1">
                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-600">Tư vấn tâm lý chuyên sâu</p>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 mt-1">
                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-600">Hỗ trợ pháp lý</p>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 mt-1">
                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-600">Bảo mật thông tin</p>
                                        </div>
                                    </div>
                                </motion.div>
                                <motion.div
                                    variants={itemVariants}
                                    className="relative rounded-xl overflow-hidden shadow-xl"
                                >
                                    <img
                                        src="https://th.bing.com/th/id/OIP.gOdakF9ijmNPfdGzvuKm-gHaE3?rs=1&pid=ImgDetMain"
                                        alt="Cơ sở y tế"
                                        className="w-full h-auto object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 via-blue-600/10 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent text-white">
                                        <h4 className="text-xl font-semibold">Cơ sở vật chất hiện đại</h4>
                                        <p className="text-blue-200">Đạt tiêu chuẩn quốc tế</p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </SectionWrapper>

                    {/* Tài liệu giáo dục Section with horizontal scroll */}
                    <SectionWrapper id="education" className="py-20 ">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={containerVariants}
                            className="container mx-auto px-6"
                        >
                            <div className="text-center mb-16">
                                <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                    Tài liệu giáo dục
                                </motion.h2>
                                <motion.div variants={itemVariants} className="w-20 h-1 bg-blue-600 mx-auto"></motion.div>
                                <motion.p variants={itemVariants} className="text-gray-600 max-w-2xl mx-auto mt-4">
                                    Các tài liệu hướng dẫn, nghiên cứu và giáo dục về phòng chống, điều trị HIV/AIDS
                                </motion.p>
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() => scrollEducation('left')}
                                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                                >
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <div
                                    ref={educationScrollRef}
                                    className="flex overflow-x-auto scrollbar-hide space-x-6 py-4 px-2"
                                >
                                    {[
                                        {
                                            title: "Hướng dẫn điều trị và chăm sóc HIV/AIDS",
                                            description: "Tài liệu hướng dẫn chi tiết về điều trị và chăm sóc HIV/AIDS",
                                            link: "https://drive.google.com/file/d/1Ww7iPk9P3x5EfOvp6VYRnYEalOBNiiPx/view?usp=drive_link",
                                            icon: (
                                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            )
                                        },
                                        {
                                            title: "Phòng chống lây nhiễm",
                                            description: "Các biện pháp phòng ngừa lây nhiễm HIV hiệu quả",
                                            link: "https://drive.google.com/file/d/1VWOVKD9psSecj_IuUrbSidTjtI_brweS/view?usp=drive_link",
                                            icon: (
                                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
                                                </svg>
                                            )
                                        },
                                        {
                                            title: "Dinh dưỡng cho bệnh nhân",
                                            description: "Chế độ dinh dưỡng tối ưu cho người nhiễm HIV",
                                            link: "https://drive.google.com/file/d/1qJu7mM3Xbkp2o1qrrTFFcyCZJVf9vRfT/view?usp=drive_link",
                                            icon: (
                                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            )
                                        },
                                        {
                                            title: "Biểu hiện trầm cảm",
                                            description: "Trầm cảm và các yếu tố liên quan của người nhiễm HIV",
                                            link: "https://drive.google.com/file/d/1lLJKIU54Qd0KgnnyG5Thuwd76zturxuD/view?usp=drive_link",
                                            icon: (
                                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            )
                                        },
                                        {
                                            title: "Hỗ trợ pháp lý",
                                            description: "Quyền lợi pháp lý của người nhiễm HIV",
                                            link: "https://drive.google.com/file/d/1HMZC9yD0HgVps-k2utR2Xgvue80woAZN/view?usp=drive_link",
                                            icon: (
                                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            )
                                        },
                                        {
                                            title: "Chăm sóc tại nhà",
                                            description: "Hướng dẫn chăm sóc bệnh nhân HIV tại nhà",
                                            link: "https://drive.google.com/file/d/1OPKbDqqG_-RdvkhKJxhU2y4bvKiMjEUx/view?usp=drive_link",
                                            icon: (
                                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                </svg>
                                            )
                                        }
                                    ].map((item, index) => (
                                        <motion.div
                                            key={index}
                                            variants={itemVariants}
                                            className="flex-shrink-0 w-72"
                                        >
                                            <Card className="group bg-white hover:bg-[#00CED1] transition-all duration-300 h-full flex flex-col">
                                                <CardHeader className="pb-0">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="p-3 bg-blue-50 rounded-lg">
                                                            {item.icon}
                                                        </div>

                                                        <CardTitle className="text-lg text-black">{item.title}</CardTitle>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="flex-1 pt-4">

                                                    <p className="text-gray-600 group-hover:text-white transition-colors duration-300 mb-6">
                                                        {item.description}
                                                    </p>
                                                    <div className="mt-auto">

                                                        <a
                                                            href={item.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="block w-full"
                                                        >
                                                            <Button
                                                                variant="outline"
                                                                className="w-full border-blue-600 text-blue-600 transition-all duration-300
               group-hover:bg-blue-50 hover:bg-blue-100"
                                                            >
                                                                Tải xuống
                                                            </Button>
                                                        </a>


                                                    </div>
                                                </CardContent>
                                            </Card>

                                        </motion.div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => scrollEducation('right')}
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                                >
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            <motion.div
                                variants={itemVariants}
                                className="text-center mt-12"
                            >
                            </motion.div>
                        </motion.div>
                    </SectionWrapper>

                    {/* Câu hỏi thường gặp Section */}
                    <SectionWrapper id="faq" className="py-20 bg-gray-50">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={containerVariants}
                            className="container mx-auto px-6"
                        >
                            <div className="text-center mb-16">
                                <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                    Câu hỏi thường gặp
                                </motion.h2>
                                <motion.div variants={itemVariants} className="w-20 h-1 bg-blue-600 mx-auto"></motion.div>
                                <motion.p variants={itemVariants} className="text-gray-600 max-w-2xl mx-auto mt-4">
                                    Những thắc mắc phổ biến về HIV/AIDS và quá trình điều trị
                                </motion.p>
                            </div>

                            <motion.div
                                variants={containerVariants}
                                className="max-w-4xl mx-auto space-y-4"
                            >
                                {/* FAQ Item 1 */}
                                <FAQItem
                                    question="HIV lây truyền qua những đường nào?"
                                    answer="HIV lây truyền qua 3 đường chính: đường máu, đường tình dục không an toàn, và từ mẹ sang con trong quá trình mang thai, sinh đẻ hoặc cho con bú. HIV không lây qua tiếp xúc thông thường như bắt tay, ôm, dùng chung bát đũa..."
                                />

                                {/* FAQ Item 2 */}
                                <FAQItem
                                    question="Triệu chứng nhiễm HIV giai đoạn đầu là gì?"
                                    answer="Trong 2-4 tuần sau khi nhiễm HIV, khoảng 40-90% người có triệu chứng giống cúm như sốt, đau họng, nổi hạch, phát ban. Tuy nhiên, nhiều người không có triệu chứng rõ ràng. Cách duy nhất để xác định là xét nghiệm HIV."
                                />

                                {/* FAQ Item 3 */}
                                <FAQItem
                                    question="Xét nghiệm HIV sau bao lâu thì chính xác?"
                                    answer="Xét nghiệm HIV thế hệ mới có thể phát hiện sau 2-3 tuần phơi nhiễm. Để kết quả chắc chắn, nên xét nghiệm lại sau 3 tháng. Xét nghiệm nhanh tại nhà cần thực hiện đúng hướng dẫn và xét nghiệm lại sau 3 tháng để khẳng định."
                                />

                                {/* FAQ Item 4 */}
                                <FAQItem
                                    question="Điều trị ARV có hiệu quả không?"
                                    answer="Điều trị ARV hiệu quả cao khi tuân thủ đúng phác đồ. Thuốc giúp ức chế virus, bảo vệ hệ miễn dịch, giảm nguy cơ lây truyền. Người điều trị tốt có thể sống khỏe mạnh gần như người bình thường và tuổi thọ gần như không bị ảnh hưởng."
                                />

                                {/* FAQ Item 5 */}
                                <FAQItem
                                    question="Có phải uống thuốc ARV suốt đời không?"
                                    answer="Hiện tại vẫn cần duy trì ARV suốt đời để kiểm soát virus. Tuy nhiên, với phác đồ hiện đại, chỉ cần uống 1 viên/ngày, ít tác dụng phụ. Các nghiên cứu về điều trị khỏi HIV đang được tiến hành nhưng chưa có kết quả chính thức."
                                />

                                {/* FAQ Item 6 */}
                                <FAQItem
                                    question="Làm sao để sống khỏe với HIV?"
                                    answer="Ngoài uống thuốc đều đặn, cần: Ăn uống đủ chất, tập thể dục điều độ, ngủ đủ giấc, tránh stress, không hút thuốc/uống rượu, khám định kỳ. Quan trọng nhất là giữ tinh thần lạc quan và kết nối với cộng đồng hỗ trợ."
                                />

                                {/* FAQ Item 7 */}
                                <FAQItem
                                    question="Tôi có thể sinh con an toàn nếu nhiễm HIV?"
                                    answer="Hoàn toàn có thể. Với điều trị ARV sớm, tỷ lệ lây truyền từ mẹ sang con giảm xuống dưới 1%. Bạn cần: Uống thuốc đúng chỉ định, sinh mổ nếu tải lượng virus cao, không cho con bú và cho bé uống ARV dự phòng sau sinh."
                                />
                            </motion.div>
                        </motion.div>
                    </SectionWrapper>

                    {/* Blog Section with main blog on left and small blogs on right */}
                    <SectionWrapper id="blog" className="py-20 ">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={containerVariants}
                            className="container mx-auto px-6"
                        >
                            <div className="text-center mb-16">
                                <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                    Bài viết mới nhất
                                </motion.h2>
                                <motion.div variants={itemVariants} className="w-20 h-1 bg-blue-600 mx-auto"></motion.div>
                                <motion.p variants={itemVariants} className="text-gray-600 max-w-2xl mx-auto mt-4">
                                    Cập nhật kiến thức, kinh nghiệm và tin tức mới nhất về điều trị HIV
                                </motion.p>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Main Blog (Left) */}
                                <motion.div
                                    variants={itemVariants}
                                    className="lg:w-2/3"
                                >
                                    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow h-full">
                                        <Link to="/blog/1">
                                            <div className="h-64 md:h-80 overflow-hidden">
                                                <img
                                                    src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                                    alt="Main blog"
                                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                                />
                                            </div>
                                            <div className="p-6">
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="text-sm text-blue-600 font-medium">Kinh nghiệm</span>
                                                    <span className="text-sm text-gray-500">15/06/2023</span>
                                                </div>
                                                <h3 className="text-2xl font-bold text-gray-800 mb-4 hover:text-blue-600 transition-colors">
                                                    Kinh nghiệm điều trị HIV hiệu quả từ bệnh nhân lâu năm
                                                </h3>
                                                <p className="text-gray-600 mb-6">
                                                    Chia sẻ từ những bệnh nhân đã điều trị HIV thành công trong nhiều năm, với những kinh nghiệm quý báu về tuân thủ điều trị, chế độ sinh hoạt và cách vượt qua khó khăn tâm lý.
                                                </p>
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0">
                                                        <img className="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80" alt="Author" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-900">Dr. Nguyễn Văn A</p>
                                                        <p className="text-sm text-gray-500">Bác sĩ chuyên khoa</p>
                                                    </div>
                                                    <Button variant="link" className="ml-auto text-blue-600 hover:text-blue-800">
                                                        Đọc thêm →
                                                    </Button>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </motion.div>

                                {/* Small Blogs (Right) */}
                                <motion.div
                                    variants={itemVariants}
                                    className="lg:w-1/3 space-y-6"
                                >
                                    {[
                                        {
                                            title: "Những tiến bộ mới trong điều trị HIV năm 2023",
                                            excerpt: "Cập nhật các phương pháp điều trị mới nhất và hiệu quả nhất hiện nay.",
                                            image: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                                            date: "10/06/2023",
                                            category: "Nghiên cứu"
                                        },
                                        {
                                            title: "Dinh dưỡng cho người nhiễm HIV",
                                            excerpt: "Chế độ ăn uống khoa học giúp tăng cường hệ miễn dịch và sức khỏe tổng thể.",
                                            image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                                            date: "05/06/2023",
                                            category: "Dinh dưỡng"
                                        },
                                        {
                                            title: "Cách vượt qua kỳ thị với người nhiễm HIV",
                                            excerpt: "Chia sẻ từ chuyên gia tâm lý về cách đối mặt và vượt qua định kiến xã hội.",
                                            image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                                            date: "01/06/2023",
                                            category: "Tâm lý"
                                        },
                                        {
                                            title: "Quyền lợi y tế cho người nhiễm HIV",
                                            excerpt: "Hướng dẫn đầy đủ về các chính sách hỗ trợ và quyền lợi của người nhiễm HIV.",
                                            image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                                            date: "28/05/2023",
                                            category: "Pháp lý"
                                        }
                                    ].map((post, index) => (
                                        <div
                                            key={index}
                                            className="bg-white hover:shadow-lg transition-shadow flex gap-4 items-start p-4 rounded-lg border border-gray-200 hover:border-blue-200"
                                        >
                                            <img
                                                src={post.image}
                                                alt={`Blog ${index}`}
                                                className="w-24 h-20 rounded-md object-cover flex-shrink-0"
                                            />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs text-blue-600 font-medium">{post.category}</span>
                                                    <span className="text-xs text-gray-500">{post.date}</span>
                                                </div>
                                                <h3 className="font-semibold text-base text-gray-800 leading-tight hover:text-blue-600 transition-colors line-clamp-2">
                                                    {post.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                                    {post.excerpt}
                                                </p>
                                                <Button variant="link" className="px-0 text-sm mt-1 text-blue-600 hover:text-blue-800">
                                                    Đọc thêm
                                                </Button>
                                            </div>
                                        </div>
                                    ))}

                                    <Button variant="ghost" className="w-full text-blue-600 hover:bg-blue-50">
                                        Xem tất cả bài viết →
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </SectionWrapper>
                </ScrollArea>
            </div>

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-gray-900 text-white py-12"
            >
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <motion.div
                            initial={{ x: -20 }}
                            whileInView={{ x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-xl font-bold mb-4 flex items-center">
                                <svg className="w-6 h-6 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                </svg>
                                HIV TMSS
                            </h3>
                            <p className="text-gray-400 mb-4">
                                Hệ thống hỗ trợ điều trị HIV chuyên nghiệp, tận tâm và bảo mật.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </a>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20 }}
                            whileInView={{ y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <h4 className="text-lg font-semibold mb-4">Liên kết nhanh</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Giới thiệu</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Dịch vụ</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Đội ngũ bác sĩ</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tin tức</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Liên hệ</a></li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20 }}
                            whileInView={{ y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <h4 className="text-lg font-semibold mb-4">Dịch vụ</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tư vấn xét nghiệm</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Điều trị ARV</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tư vấn tâm lý</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Hỗ trợ pháp lý</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Chăm sóc tại nhà</a></li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20 }}
                            whileInView={{ y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
                            <address className="text-gray-400 not-italic">
                                <p className="flex items-start mb-2">
                                    <svg className="w-5 h-5 text-blue-400 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    123 Đường ABC, Quận 1, TP.HCM
                                </p>
                                <p className="flex items-center mb-2">
                                    <svg className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    (028) 1234 5678
                                </p>
                                <p className="flex items-center">
                                    <svg className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    info@hivtmss.vn
                                </p>
                            </address>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        viewport={{ once: true }}
                        className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
                    >
                        <p className="text-gray-400 text-sm mb-4 md:mb-0">
                            © {new Date().getFullYear()} HIV TMSS. All rights reserved.
                        </p>
                        <div className="flex space-x-6">
                            <a href="#" className="text-gray-400 hover:text-white text-sm">Chính sách bảo mật</a>
                            <a href="#" className="text-gray-400 hover:text-white text-sm">Điều khoản sử dụng</a>
                            <a href="#" className="text-gray-400 hover:text-white text-sm">Sơ đồ trang web</a>
                        </div>
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