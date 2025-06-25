
import Header from "../Header/Header.jsx";
import Navbar from "../AdminLayout/Navbar/Navbar.jsx";
const AdminLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Navbar />
        <main className="flex-1 ml-64 p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  )
}
export default AdminLayout
