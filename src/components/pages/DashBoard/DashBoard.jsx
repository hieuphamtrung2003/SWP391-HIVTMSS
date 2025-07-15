import { useEffect, useState } from 'react';
import axios from 'setup/configAxios';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '../../ui/card';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Users, Stethoscope, CalendarCheck, Pill, UserCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { format, getWeeksInMonth, eachWeekOfInterval, startOfWeek, endOfWeek } from 'date-fns';

const DashboardContent = () => {
  const [dashboardData, setDashboardData] = useState({
    total_customers: 0,
    total_doctors: 0,
    total_appointments: 0,
    total_blogs: 0,
    start_date: '',
    end_date: ''
  });

  const [weeklyData, setWeeklyData] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [loading, setLoading] = useState({
    dashboard: true,
    weekly: true,
    appointments: true
  });

  // Generate year options
  const yearOptions = [];
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= currentYear - 5; year--) {
    yearOptions.push(year);
  }

  // Month names for the select dropdown
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: format(new Date(selectedYear, i, 1), 'MMMM')
  }));

  // Fetch dashboard summary data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const startDate = new Date(selectedYear, 0, 1); // January 1st of selected year
        const endDate = new Date(selectedYear, 11, 31); // December 31st of selected year

        const params = new URLSearchParams({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        });

        const response = await axios.get(
          `api/v1/appointments/dashboard?${params}`
        );

        setDashboardData(response.data);
        setLoading(prev => ({ ...prev, dashboard: false }));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(prev => ({ ...prev, dashboard: false }));
      }
    };

    fetchDashboardData();
  }, [selectedYear]);

  // Fetch weekly data for selected month
  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        const startDate = new Date(selectedYear, selectedMonth, 1);
        const endDate = new Date(selectedYear, selectedMonth + 1, 0); // Last day of the month

        const params = new URLSearchParams({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        });

        const response = await axios.get(
          `api/v1/appointments/dashboard/monthly?${params}`
        );

        // Create week intervals for the selected month
        const weeks = eachWeekOfInterval({
          start: startDate,
          end: endDate
        }, { weekStartsOn: 1 }); // Monday as first day of week

        // Initialize weekly data structure
        const weeklyStats = weeks.map((weekStart, index) => {
          const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
          return {
            week: `Week ${index + 1}`,
            weekRange: `${format(weekStart, 'MMM dd')} - ${format(weekEnd, 'MMM dd')}`,
            customers: 0,
            appointments: 0,
            blogs: 0
          };
        });

        // Map API data to our weekly structure
        response.data.weekly_dashboard.forEach(week => {
          const weekDate = new Date(week.start_date);
          const weekStart = startOfWeek(weekDate, { weekStartsOn: 1 });

          // Find which week this data belongs to
          const weekIndex = weeks.findIndex(w =>
            startOfWeek(w, { weekStartsOn: 1 }).getTime() === weekStart.getTime()
          );

          if (weekIndex !== -1) {
            weeklyStats[weekIndex].customers += week.total_customers;
            weeklyStats[weekIndex].appointments += week.total_appointments;
            weeklyStats[weekIndex].blogs += week.total_blogs;
          }
        });

        setWeeklyData(weeklyStats);
        setLoading(prev => ({ ...prev, weekly: false }));
      } catch (error) {
        console.error('Error fetching weekly data:', error);
        setLoading(prev => ({ ...prev, weekly: false }));
      }
    };

    fetchWeeklyData();
  }, [selectedYear, selectedMonth]);

  // Fetch recent appointments
  useEffect(() => {
    const fetchRecentAppointments = async () => {
      try {
        const response = await axios.get(
          'api/v1/appointments/all?pageNo=0&pageSize=5&sortBy=createdDate&sortDir=desc'
        );

        setRecentAppointments(response.data.content);
        setLoading(prev => ({ ...prev, appointments: false }));
      } catch (error) {
        console.error('Error fetching recent appointments:', error);
        setLoading(prev => ({ ...prev, appointments: false }));
      }
    };

    fetchRecentAppointments();
  }, []);

  return (
    <div className="space-y-6">
      {/* Year and Month selection */}
      <div className="flex justify-end gap-4">
        <Select
          value={selectedYear.toString()}
          onValueChange={(value) => setSelectedYear(parseInt(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map(year => (
              <SelectItem className="bg-white" key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedMonth.toString()}
          onValueChange={(value) => setSelectedMonth(parseInt(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {monthOptions.map(month => (
              <SelectItem key={month.value} value={month.value.toString()}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng bệnh nhân</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading.dashboard ? (
              <div className="h-8 w-16 animate-pulse bg-gray-200 rounded" />
            ) : (
              <div className="text-2xl font-bold">{dashboardData.total_customers}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng bác sĩ</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading.dashboard ? (
              <div className="h-8 w-16 animate-pulse bg-gray-200 rounded" />
            ) : (
              <div className="text-2xl font-bold">{dashboardData.total_doctors}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng lịch hẹn</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading.dashboard ? (
              <div className="h-8 w-16 animate-pulse bg-gray-200 rounded" />
            ) : (
              <div className="text-2xl font-bold">{dashboardData.total_appointments}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">tổng bài viết</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading.dashboard ? (
              <div className="h-8 w-16 animate-pulse bg-gray-200 rounded" />
            ) : (
              <div className="text-2xl font-bold">{dashboardData.total_blogs}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weekly Chart */}
      <Card>
        <CardHeader>
          <CardTitle>
            báo cáo mỗi tuần - {monthOptions[selectedMonth]?.label} {selectedYear}
          </CardTitle>
          <CardDescription>báo cáo mỗi tuần bệnh nhân, lịch khám, bài viết</CardDescription>
        </CardHeader>
        <CardContent>
          {loading.weekly ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="animate-pulse bg-gray-200 rounded w-full h-full" />
            </div>
          ) : (
            <div className="h-[300px]"> 
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="weekRange"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="customers"
                    name="Bệnh nhân"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="appointments"
                    name="Lịch khám"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="blogs"
                    name="Bài viết"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch khám gần đây</CardTitle>
          <CardDescription>5 lịch khám mới nhất</CardDescription>
        </CardHeader>
        <CardContent>
          {loading.appointments ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-full animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div key={appointment.appointment_id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <UserCircle className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {appointment.is_anonymous ? 'Ẩn danh' : appointment.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.doctor?.full_name ?
                          `với bác sĩ ${appointment.doctor.full_name}` :
                          'No doctor assigned'}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(appointment.created_date), 'MM/dd/yyyy')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardContent;