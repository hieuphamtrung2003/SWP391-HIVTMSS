// components/LandingPage.jsx
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll-area"
import { AnimatePresence, motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom";

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false)


    return (
        <motion.div
            whileInView="visible"
            variants={itemVariants}
            className="border border-gray-200 rounded-lg overflow-hidden"
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
                                onClick={() => scrollToSection('faq')}
                                className="text-gray-700 hover:text-blue-600"
                            >
                                Câu hỏi thường gặp
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => scrollToSection('blog')}
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

            <div className="min-h-screen flex flex-col mx-4 sm:mx-[5%]">

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
                        <div className="relative overflow-hidden h-96 rounded-b-2xl rounded-t-2xl mt-8">
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
                                                className="text-4xl md:text-3xl font-bold text-white mb-6"
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
                                                    <Link to="/login">
                                                        <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg">
                                                            Đặt lịch hẹn ngay
                                                        </Button>
                                                    </Link>
                                                </motion.div>
                                                <motion.div variants={itemVariants}>
                                                    <Link to="/login">
                                                        <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-800 px-8 py-6 text-lg">
                                                            Tìm hiểu thêm
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
                            <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-12">
                                Giới thiệu
                            </motion.h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <motion.div variants={itemVariants}>

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
                                            src="https://~media.istockphoto.com/photos/medical-center-picture-id183361838?k=6&m=183361838&s=170667a&w=0&h=zGZmRALhH51aVREWsCGGxpko1RY_YF5lSEhsq3SqByg="
                                            alt="Cơ sở y tế"
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </SectionWrapper>

                    {/* Tài liệu giáo dục Section */}
                    <SectionWrapper id="education" className="py-20">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={containerVariants}
                            className="container mx-auto px-6"
                        >
                            <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-12">
                                Tài liệu giáo dục
                            </motion.h2>
                            <motion.div
                                variants={containerVariants}
                                className="grid md:grid-cols-3 gap-6"
                            >
                                {[1, 2, 3].map((item) => (
                                    <motion.div key={item} variants={itemVariants}>
                                        <Card className="bg-white hover:shadow-lg transition-shadow">

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
                    {/* Câu hỏi thường gặp Section */}
                    <SectionWrapper id="faq" className="py-25 bg-white-50">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={containerVariants}
                            className="container mx-auto px-6"
                        >
                            <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-10">
                                Câu hỏi thường gặp
                            </motion.h2>

                            <motion.div
                                variants={containerVariants}
                                className="py-3 px-3 bg-blue-50 rounded-3xl mx-4"
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

                    {/* Blog Section */}
                    <SectionWrapper id="blog" className="py-20">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={containerVariants}
                            className="container mx-auto px-6"
                        >
                            <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-12">
                                Blog chia sẻ kinh nghiệm
                            </motion.h2>

                            <div className="grid md:grid-cols-3 gap-8">
                                {/* === Blog lớn === */}
                                <div className="md:col-span-2">

                                    <Card className="bg-white hover:shadow-lg transition-shadow hover:bg-gray-50">
                                        <Link to="/blog/1">
                                            <div className="bg-gray-100 h-64 rounded-t-lg overflow-hidden">
                                                <img
                                                    src="https://www.huggies.com.vn/-/media/Project/be-6-thang-an-duoc-trai-cay-gi-thumb.jpeg"
                                                    alt="Blog nổi bật"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
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
                                        </Link>
                                    </Card>
                                </div>

                                {/* === Blog nhỏ === */}
                                <div className="flex flex-col gap-6">
                                    {[1, 2, 3].map((post) => (
                                        <div key={post} className="bg-white hover:shadow-lg transition-shadow flex gap-4 items-start hover:bg-gray-50 p-3 rounded-lg transition">
                                            <img
                                                src="https://i.ytimg.com/vi/HmIMmFAV4BY/maxresdefault.jpg"
                                                alt={`Blog ${post}`}
                                                className="w-24 h-20 rounded-md object-cover flex-shrink-0"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-base text-gray-800 leading-tight hover:underline cursor-pointer">
                                                    Kinh nghiệm điều trị HIV hiệu quả
                                                </h3>
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    Chia sẻ từ bệnh nhân đã điều trị thành công và có cuộc sống khỏe mạnh.
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <Button variant="link" className="px-0 text-sm mt-2 pr-2 w-full">
                                        <div className="text-right w-full">Đọc thêm bài viết</div>
                                    </Button>

                                </div>
                            </div>

                        </motion.div>
                    </SectionWrapper>
                </ScrollArea>
            </div>
            <div>
                {/* Newsletter Section */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInVariants}
                    className="py-10 bg-blue-600 text-white"
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
                                <a className="hover:text-blue-300">Chính sách bảo mật</a>
                                <a className="hover:text-blue-300">Điều khoản sử dụng</a>
                                <a className="hover:text-blue-300">Liên hệ</a>
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