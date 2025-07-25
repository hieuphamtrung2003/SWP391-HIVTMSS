import React from "react";
import { decodeToken } from "../../utils/tokenUtils";
import { toast } from "react-toastify";

const NotFound = () => {
    const handleRedirectByRole = () => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            // Guest (chưa login)
            window.location.href = "/";
            return;
        }

        const decoded = decodeToken(token);
        if (!decoded) {
            toast.error("Token không hợp lệ hoặc đã hết hạn!");
            window.location.href = "/";
            return;
        }

        const role = decoded.role;
        const userId = decoded.id;

        if (!role) {
            window.location.href = "/";
            return;
        }

        switch (role) {
            case "ADMIN":
                window.location.href = "/admin/profile";
                break;
            case "MANAGER":
                window.location.href = "/manager/profile";
                break;
            case "CUSTOMER":
                window.location.href = "/schedule";
                break;
            case "DOCTOR":
                handleDoctorRedirect(userId);
                break;
            default:
                toast.error("Vai trò không được hỗ trợ!");
                window.location.href = "/";
        }
    };

    const handleDoctorRedirect = async (doctorId) => {
        try {
            const res = await fetch(`/api/doctor-degrees/account/${doctorId}`);
            if (res.ok) {
                window.location.href = "/doctor/patient-request";
            } else {
                window.location.href = "/doctor/degree";
            }
        } catch (error) {
            console.error("Lỗi khi kiểm tra bằng cấp bác sĩ:", error);
            window.location.href = "/doctor/degree";
        }
    };

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-100 px-5">
            <h1 className="text-7xl font-bold text-blue-600">404</h1>
            <p className="text-xl md:text-2xl font-semibold text-gray-800 mt-4">
                Trang không tồn tại
            </p>
            <p className="text-gray-600 mt-2 text-center">
                Rất tiếc! Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.
            </p>
            <button
                onClick={handleRedirectByRole}
                className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
                Quay về trang chủ
            </button>
        </div>
    );
};

export default NotFound;
