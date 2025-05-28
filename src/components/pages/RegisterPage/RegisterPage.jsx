
import LoginImage from "../../../assets/loginmiage.jpg";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../setup/configAxios"
import { toast } from "react-toastify";
import { useState } from "react";

const RegisterForm = () => {

    const navigate = useNavigate();
    const [formValue, setFormValue] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone: "",
        address: ""
    });

    const handleChange = (e) => {
        const { value, name } = e.target;
        setFormValue((prevFormValue) => ({
            ...prevFormValue,
            [name]: value,
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const { first_name, last_name, email, password, phone, address } = formValue;

        // Kiểm tra rỗng
        if (!first_name.trim() || !last_name.trim() || !email.trim() || !password.trim()) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
            return;
        }

        try {
            const res = await axios.post("http://103.179.185.77:8080/api/v1/auth/register", formValue);
            if (res?.http_status === 200) {
                toast.success("Đăng ký thành công!");
                navigate("/login");
            } else {
                toast.error("Đăng ký không thành công. Vui lòng thử lại!");
            }
        } catch (error) {
            if (error.response) {
                const { message } = error.response.data;
                toast.error(message || "Lỗi từ máy chủ. Đăng ký thất bại!");
            } else {
                toast.error("Không thể kết nối đến máy chủ!");
            }
            console.error("Đăng ký thất bại:", error);
        }
    };






    return (
        <div>
            <div className="w-full h-screen flex items-center justify-center">
                <div className="flex w-full max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden">

                    {/* Ảnh */}
                    <div className="w-1/2 hidden md:flex bg-blue-50">
                        <img
                            src={LoginImage}
                            className="w-full h-full object-cover self-stretch"
                            alt="Pet Dog"
                        />
                    </div>
                    {/* Nội dung form register */}
                    <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
                        <Link to="/" className="text-left mb-6 text-xl font-semibold text-[#373E79]">
                            <h1 className="text-2xl font-bold text-blue-600 mb-1">
                                <span className="text-blue-800">HIV</span>
                                <span className="text-blue-600">TMSS</span>
                            </h1>
                            <p className="text-sm">Bệnh viện chữa bệnh HIV tốt nhất</p>
                        </Link>

                        <div className="mb-4">
                            <h3 className="text-3xl font-semibold text-[#373E79] mb-1">Đăng kí</h3>
                            <p className="text-sm text-[#373E79]">Bạn chưa có tài khoản !! Vui lòng điền thông tin của bạn để đăng ký.</p>
                        </div>

                        <form className="flex flex-col" onSubmit={handleRegister}>
                            <div className="flex space-x-4">
                                <input
                                    type="text"
                                    name="first_name"
                                    placeholder="Họ"
                                    className="w-1/2 text-black py-2 my-2 border-b border-black bg-transparent outline-none"
                                    value={formValue.first_name}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    name="last_name"
                                    placeholder="Tên"
                                    className="w-1/2 text-black py-2 my-2 border-b border-black bg-transparent outline-none"
                                    value={formValue.last_name}
                                    onChange={handleChange}
                                />
                            </div>
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

                            <input
                                type="tel"
                                name="phone"
                                placeholder="Số điện thoại"
                                className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                                value={formValue.phone}
                                onChange={handleChange}

                            />
                            <input
                                type="text"
                                name="address"
                                placeholder="Địa chỉ"
                                className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                                value={formValue.address}
                                onChange={handleChange}

                            />

                            <button
                                type="submit"
                                className="w-full bg-[#4763E6] text-white py-3 rounded-md mt-6 hover:bg-[#3a52c9] transition"
                            >
                                Đăng kí
                            </button>
                        </form>


                        <div className="w-full my-6">
                            <div className="h-[0.5px] bg-black w-full" />
                        </div>


                        <div className="w-full flex items-center justify-center">
                            <p className="text-sm font-normal text-[#373E79]">
                                Bạn đã có tài khoản?{" "}
                                <Link to="/login">
                                    <span className="font-semibold underline underline-offset-2 cursor-pointer text-[#373E79]">
                                        Hãy đăng nhập
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

export default RegisterForm;
