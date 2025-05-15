// components/AppointmentTimetable.jsx
import { Button } from "../../ui/button"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const Schedule = () => {
    // Current date management
    const [currentDate, setCurrentDate] = useState(new Date())
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()
    
    // Define days of the week
    const days = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu'];

    // Define time slots (2-hour intervals from 8:00 to 18:00)
    const timeSlots = [
        '8:00 - 10:00',
        '10:00 - 12:00',
        '12:00 - 14:00',
        '14:00 - 16:00',
        '16:00 - 18:00'
    ];

    // Year selection
    const years = Array.from({length: 5}, (_, i) => currentYear - 2 + i)
    
    // Month names in Vietnamese
    const monthNames = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
        'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
        'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ]

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
    }

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
    }

    const handleYearChange = (year) => {
        setCurrentDate(new Date(year, currentMonth, 1))
    }

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-sm">
            {/* Calendar Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-semibold text-gray-800">Lịch Trình Khám Bệnh</h2>
                
                <div className="flex items-center gap-4">
                    {/* Year Selector */}
                    <div className="flex items-center gap-2">
                        <select 
                            value={currentYear}
                            onChange={(e) => handleYearChange(parseInt(e.target.value))}
                            className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    {/* Month Navigation */}
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={handlePrevMonth}
                            className="h-8 w-8"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        
                        <span className="font-medium text-gray-700 min-w-[100px] text-center">
                            {monthNames[currentMonth]}
                        </span>
                        
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={handleNextMonth}
                            className="h-8 w-8"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Timetable */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-blue-50">
                            <th className="p-3 border border-gray-200 font-medium text-center text-blue-700">
                                Thời Gian
                            </th>
                            {days.map(day => (
                                <th 
                                    key={day} 
                                    className="p-3 border border-gray-200 font-medium text-center text-blue-700"
                                >
                                    {day}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {timeSlots.map((time, index) => (
                            <tr 
                                key={time}
                                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                            >
                                <td className="p-3 border border-gray-200 text-center font-medium text-gray-700">
                                    {time}
                                </td>
                                {days.map(day => (
                                    <td 
                                        key={`${day}-${time}`} 
                                        className="p-4 border border-gray-200 text-center hover:bg-blue-50 transition-colors"
                                    >
                                        <div className="h-8 flex items-center justify-center">
                                            {/* Empty slot - will be filled later */}
                                            <span className="text-gray-400 text-sm"></span>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                <div>
                    <p>Lịch trình từ 8:00 đến 18:00, mỗi khung giờ 2 tiếng</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300"></div>
                    <span>Buổi sáng</span>
                    <div className="w-3 h-3 rounded-full bg-amber-100 border border-amber-300 ml-2"></div>
                    <span>Buổi chiều</span>
                </div>
            </div>
        </div>
    );
}

export default Schedule