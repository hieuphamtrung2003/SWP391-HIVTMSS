import { useState } from "react";
import LoginImage from "../../../assets/loginmiage.jpg";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../setup/configAxios";
import { toast } from "react-toastify";
import { decodeToken } from "../../../utils/tokenUtils";

const LoginForm = () => {

    const navigate = useNavigate();
    const [formValue, setFormValue] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { value, name } = e.target;
        setFormValue((prevFormValue) => ({
            ...prevFormValue,
            [name]: value,
        }));
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        // Chưa điền password
        if (!formValue.password.trim()) {
            toast.error("Bạn chưa điền mật khẩu");
            return;
        }
        // Chưa điền email
        if (!formValue.email.trim()) {
            toast.error("Bạn chưa điền email");
            return;
        }

        try {
            const res = await axios.post("api/v1/auth/login", formValue);
            console.log(res);
            if (res?.http_status === 200) {
                const token = res.data.access_token;
                localStorage.setItem("access_token", token);

                const decodedToken = decodeToken(token);
                if (!decodedToken) {
                    toast.error("Token không hợp lệ hoặc đã hết hạn!");
                    return;
                }

                const role = decodedToken.role;

                // Điều hướng theo phân quyền
                if (role === "ADMIN") {
                    navigate("/admin/dashboard");
                } else if (role === "MANAGER") {
                    navigate("/manager");
                }
                else if (role === "DOCTOR") {
                    try {
                        const degreeRes = await axios.get(`/api/doctor-degrees/account/${decodedToken.id}`);

                        if (degreeRes) {
                            // Nếu đã có bằng cấp
                            navigate("/doctor/patient-request");
                        } else {
                            // Không có bằng cấp
                            navigate("/doctor/degree");
                        }
                    } catch (err) {
                        console.error("Error fetching doctor degree:", err);
                        toast.error("Hãy cập nhật bằng cấp của bạn trước khi tiếp tục!");
                        navigate("/doctor/degree");
                        return;
                    }
                }
                else if (role === "CUSTOMER") {
                    navigate("/schedule");
                } else {
                    toast.error("Vai trò không được hỗ trợ!");
                    return;
                }

                toast.success("Đăng nhập thành công!!");
            } else {
                toast.error("Vui lòng kiểm tra lại email hoặc mật khẩu !!");
            }
        } catch (error) {
            // Password sai
            toast.error("Email hoặc mật khẩu không đúng!");
            console.error("Login failed:", error);
        }
    };
    return (
        <div>
            <div className="w-full h-screen flex items-center justify-center">
                <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">

                    {/* Ảnh */}
                    <div className="w-1/2 hidden md:flex bg-blue-50">
                        <img
                            src={LoginImage}
                            className="w-full h-full object-cover self-stretch"
                            alt="Pet Dog"
                        />
                    </div>
                    {/* Nội dung form login */}
                    <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
                        <Link to="/" className="text-left mb-6 text-xl font-semibold text-[#373E79]">
                            <h1 className="text-2xl font-bold text-blue-600 mb-1">
                                <span className="text-blue-800">HIV</span>
                                <span className="text-blue-600">TMSS</span>
                            </h1>
                            <p className="text-sm">Bệnh viện chữa bệnh HIV tốt nhất</p>
                        </Link>

                        <div className="mb-4">
                            <h3 className="text-3xl font-semibold text-[#373E79] mb-1">Đăng nhập</h3>
                            <p className="text-sm text-[#373E79]">Chào mừng bạn trở lại! Vui lòng điền thông tin.</p>
                        </div>

                        <form className="flex flex-col" onSubmit={handleLogin}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="w-full text-black py-2 my-2 border-b border-black bg-transparent outline-none"
                                autoComplete="email"
                                value={formValue.email}
                                onChange={handleChange}
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="w-full text-black py-2 my-2 border-b border-black bg-transparent outline-none"
                                autoComplete="current-password"
                                value={formValue.password}
                                onChange={handleChange}
                            />

                            <div className="flex justify-between items-center text-sm mt-2">
                                <label className="flex items-center text-[#373E79]">
                                    <input type="checkbox" className="mr-2" />
                                    Nhớ tôi cho lần sau
                                </label>
                                <Link to="/forgot-password">
                                    <p className="underline cursor-pointer text-[#373E79]">Quên mật khẩu?</p>
                                </Link>

                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#4763E6] text-white py-3 rounded-md mt-6 hover:bg-[#3a52c9] transition"
                            >
                                Đăng nhập
                            </button>
                        </form>


                        <div className="w-full my-6">
                            <div className="h-[0.5px] bg-black w-full" />
                        </div>


                        <div className="w-full flex items-center justify-center">
                            <p className="text-sm font-normal text-[#373E79]">
                                Không có tài khoản?{" "}
                                <Link to="/register">
                                    <span className="font-semibold underline underline-offset-2 cursor-pointer text-[#373E79]">
                                        Hãy đăng kí
                                    </span>
                                </Link>
                            </p>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
};

export default LoginForm;
