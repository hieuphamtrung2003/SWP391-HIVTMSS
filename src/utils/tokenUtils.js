import { jwtDecode } from "jwt-decode";

export const decodeToken = (token) => {
    try {
        const decoded = jwtDecode(token);

        // Kiểm tra nếu token đã hết hạn
        const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại (giây)
        if (decoded.exp < currentTime) {
            console.warn("Token đã hết hạn");
            return null;
        }

        return decoded;
    } catch (error) {
        console.error("Token không hợp lệ:", error);
        return null;
    }
};
