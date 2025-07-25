import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../../setup/configAxios";
import { toast } from "react-toastify";
import { decodeToken } from "../../../utils/tokenUtils";


const DoctorDegree = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        dob: "",
        graduationDate: "",
        classification: "EXCELLENT",
        studyMode: "FULL_TIME",
        issueDate: "",
        schoolName: "",
        regNo: "",
    });
    const [loading, setLoading] = useState(true);
    const [hasDegree, setHasDegree] = useState(false);

    useEffect(() => {
        const checkDegreeInfo = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    navigate("/login");
                    return;
                }

                const decodedToken = decodeToken(token);
                if (!decodedToken || decodedToken.role !== "DOCTOR") {
                    navigate("/login");
                    return;
                }

                const accountId = decodedToken.id;
                const response = await axios.get(`api/v1/doctor-degrees/account?accountId=${accountId}`);

                if (response.data) {
                    setHasDegree(true);
                    navigate("/doctor/patient-request");
                }
            } catch (error) {
                if (error.response?.status === 404) {
                    // No degree info found, allow to fill
                    setHasDegree(false);
                } else {
                    console.error("Error checking degree info:", error);
                    toast.error("Có lỗi xảy ra khi kiểm tra thông tin bằng cấp");
                }
            } finally {
                setLoading(false);
            }
        };

        checkDegreeInfo();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.dob || !formData.graduationDate ||
            !formData.issueDate || !formData.schoolName || !formData.regNo) {
            toast.error("Vui lòng điền đầy đủ thông tin");
            return;
        }

        try {
            const token = localStorage.getItem("access_token");
            const decodedToken = decodeToken(token);
            const accountId = decodedToken.id;

            const payload = {
                ...formData,
                accountId
            };

            // First create the degree record
            const response = await axios.post("/api/v1/doctor-degrees", payload);

            toast.success("Thông tin bằng cấp đã được lưu thành công");
            navigate("/doctor/patient-request");
        } catch (error) {
            console.error("Error submitting degree info:", error);
            toast.error("Có lỗi xảy ra khi lưu thông tin bằng cấp");
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Đang tải...</div>;
    }

    if (hasDegree) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Thông tin bằng cấp bác sĩ</h2>
                    <p className="mt-2 text-gray-600">Vui lòng cung cấp thông tin bằng cấp của bạn để tiếp tục</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Họ và tên
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                                Ngày sinh
                            </label>
                            <input
                                type="date"
                                id="dob"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="graduationDate" className="block text-sm font-medium text-gray-700">
                                Ngày tốt nghiệp
                            </label>
                            <input
                                type="date"
                                id="graduationDate"
                                name="graduationDate"
                                value={formData.graduationDate}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="classification" className="block text-sm font-medium text-gray-700">
                                Xếp loại
                            </label>
                            <select
                                id="classification"
                                name="classification"
                                value={formData.classification}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="EXCELLENT">Xuất sắc</option>
                                <option value="GOOD">Giỏi</option>
                                <option value="FAIR">Khá</option>
                                <option value="AVERAGE">Trung bình</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="studyMode" className="block text-sm font-medium text-gray-700">
                                Hình thức đào tạo
                            </label>
                            <select
                                id="studyMode"
                                name="studyMode"
                                value={formData.studyMode}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="FULL_TIME">Chính quy</option>
                                <option value="PART_TIME">Không chính quy</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">
                                Ngày cấp bằng
                            </label>
                            <input
                                type="date"
                                id="issueDate"
                                name="issueDate"
                                value={formData.issueDate}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700">
                                Tên trường
                            </label>
                            <input
                                type="text"
                                id="schoolName"
                                name="schoolName"
                                value={formData.schoolName}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="regNo" className="block text-sm font-medium text-gray-700">
                                Số hiệu bằng
                            </label>
                            <input
                                type="text"
                                id="regNo"
                                name="regNo"
                                value={formData.regNo}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-5">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Lưu thông tin
                        </button>
                        <Link to={"/login"}>
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Về trang đăng nhập
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorDegree;