import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("This Week");

  const summaryCards = [
    { label: "Total Books", value: 4200, icon: "📚" },
    { label: "Total Readers", value: 1210, icon: "🧑‍🤝‍🧑" },
    { label: "Books Issued", value: 680, icon: "📖" },
    { label: "Overdue Returns", value: 95, icon: "⏰" },
  ];

  const barData = [
    { name: "Mon", borrowed: 24 },
    { name: "Tue", borrowed: 18 },
    { name: "Wed", borrowed: 32 },
    { name: "Thu", borrowed: 45 },
    { name: "Fri", borrowed: 20 },
    { name: "Sat", borrowed: 15 },
    { name: "Sun", borrowed: 10 },
  ];

  const growthData = [
    { name: "Mon", readers: 5 },
    { name: "Tue", readers: 8 },
    { name: "Wed", readers: 4 },
    { name: "Thu", readers: 10 },
    { name: "Fri", readers: 2 },
    { name: "Sat", readers: 6 },
    { name: "Sun", readers: 3 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white p-2 rounded shadow">
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-xs">
            {payload[0].name}: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  const recentActivity = [
    { user: "Nimal", book: "Atomic Habits", time: "2 hours ago" },
    { user: "Kevin", book: "Harry Potter", time: "5 hours ago" },
    { user: "Kamal", book: "Rich Dad Poor Dad", time: "Yesterday" },
  ];

  return (
    <div
      className="min-h-screen p-6 md:p-8 text-gray-900"
      style={{
        background:
          "linear-gradient(135deg, #2e0854 0%, #ffffff 50%, #2e0854 100%)",
      }}
    >
      <h1 className="text-3xl font-bold mb-8 text-white drop-shadow-lg">
        📊 Library Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {summaryCards.map((card, i) => (
          <div
            key={i}
            className="bg-white/80 rounded-2xl p-6 shadow-md border border-purple-800 flex flex-col items-start"
          >
            <div className="text-3xl mb-2">{card.icon}</div>
            <h2 className="text-lg font-semibold text-purple-900">{card.label}</h2>
            <p className="text-2xl font-bold text-purple-700 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Bar Chart */}
        <div className="bg-white/80 rounded-2xl p-6 shadow-md border border-purple-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-purple-900">📈 Borrowing Activity</h3>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-white border border-purple-700 rounded px-3 py-1 text-sm text-purple-900 transition-all duration-200"
            >
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5b21b6" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#5b21b6" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#7c3aed" />
              <XAxis dataKey="name" stroke="#6d28d9" />
              <YAxis stroke="#6d28d9" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="borrowed"
                fill="url(#colorBar)"
                radius={[6, 6, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="bg-white/80 rounded-2xl p-6 shadow-md border border-purple-800">
          <h3 className="text-lg font-bold mb-4 text-purple-900">📈 New Readers Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#7c3aed" />
              <XAxis dataKey="name" stroke="#6d28d9" />
              <YAxis stroke="#6d28d9" />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="readers"
                stroke="#5b21b6"
                strokeWidth={3}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white/80 rounded-2xl p-6 shadow-md border border-purple-800">
        <h3 className="text-lg font-bold mb-4 text-purple-900">🕒 Recent Activity</h3>
        <table className="w-full text-sm text-left text-purple-900">
          <thead className="border-b border-purple-700">
            <tr>
              <th className="py-2">User</th>
              <th className="py-2">Book</th>
              <th className="py-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {recentActivity.map((item, i) => (
              <tr
                key={i}
                className="border-b border-purple-700 hover:bg-purple-200 transition-colors duration-200"
              >
                <td className="py-2">{item.user}</td>
                <td className="py-2">{item.book}</td>
                <td className="py-2">{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
