import { useState } from "react";
import axios from "../../../setup/configAxios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginImage from "../../../assets/loginmiage.jpg";
import { Link, useNavigate } from "react-router-dom";

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Vui lòng nhập email của bạn", {
                position: "top-right",
                autoClose: 5000,
            });
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                "api/v1/auth/forgot-password",
                null,
                {
                    params: {
                        email: email
                    }
                }
            );

            if (response.http_status === 200) {
                toast.success("Liên kết đặt lại mật khẩu đã được gửi đến email của bạn!", {
                    position: "top-right",
                    autoClose: 5000,
                });
                setEmail("");
                // Navigate to reset password page after successful request
                navigate("/reset-password");
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";

            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
                {/* Hình ảnh */}
                <div className="hidden md:block bg-blue-100">
                    <img
                        src={LoginImage}
                        alt="Forgot Password Illustration"
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* Nội dung form */}
                <div className="p-8 md:p-10 flex flex-col justify-center">
                    {/* Logo */}
                    <Link to="/" className="font-semibold text-[#373E79]">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-blue-700">
                                <span className="text-blue-800">HIV</span>
                                <span className="text-blue-500">TMSS</span>
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Bệnh viện chữa trị HIV hàng đầu
                            </p>
                        </div>
                    </Link>

                    {/* Tiêu đề */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Quên mật khẩu?</h2>
                        <p className="text-sm text-gray-500">
                            Nhập email của bạn để nhận liên kết đặt lại mật khẩu
                        </p>
                    </div>

                    {/* Form */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            autoComplete="email"
                            required
                        />

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Đang xử lý..." : "Gửi liên kết"}
                        </button>
                    </form>

                    {/* Kẻ ngang */}
                    <div className="my-6">
                        <div className="h-px bg-gray-200 w-full" />
                    </div>

                    {/* Link quay về login */}
                    <p className="text-center text-sm text-gray-600">
                        <Link to="/login" className="text-blue-600 hover:underline font-medium">
                            Quay về trang đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );

};

export default ForgotPasswordForm;