// src/pages/OverDuePage.tsx
import React, { useEffect, useState } from "react";
import { fetchOverdueLendings } from "../services/lendingService";
import { sendAllDueDateReminders, sendDueDateReminder } from "../services/mailService";
import type { PopulatedLending } from "../services/lendingService";
import { FaRegEnvelope } from "react-icons/fa";

const OverDuePage: React.FC = () => {
  const [lendings, setLendings] = useState<PopulatedLending[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLendings = async () => {
      try {
        setLoading(true);
        const data = await fetchOverdueLendings();
        setLendings(data);
      } catch (err) {
        setError("Failed to load overdue lendings.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadLendings();
  }, []);

  const handleSendAll = async () => {
  try {
    const result = await sendAllDueDateReminders();
    alert(`📧 Bulk reminders processed!\n\n${result.results
      .map((r: any) => `${r.email}: ${r.status}`)
      .join("\n")}`);
  } catch (error) {
    console.error(error);
    alert("❌ Failed to send bulk reminder emails.");
  }
};


  const handleSendReminder = async (lending: PopulatedLending) => {
    try {
      await sendDueDateReminder(lending.readerId._id, lending._id);
      alert("📧 Reminder email sent successfully!");
    } catch (error) {
      alert("❌ Failed to send reminder email");
      console.error(error);
    }
  };

  if (loading)
    return (
      <p className="text-center text-lg text-gray-600 mt-10">Loading overdue lendings...</p>
    );
  if (error)
    return (
      <p className="text-center text-lg text-red-600 mt-10">{error}</p>
    );

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start p-6 pt-10"
      style={{
        background: "linear-gradient(135deg, #1a202c, #edf2f7 50%, #1a202c)",
      }}
    >
      <div className="max-w-7xl w-full bg-white rounded-lg shadow-lg border border-gray-300 p-6">
        <h2 className="text-3xl font-extrabold mb-6 text-purple-800 text-center">
          Overdue Lendings
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed border-collapse border-gray-200">
            <thead className="bg-gradient-to-r from-purple-300 to-purple-400">
              <tr>
                {[
                  "Reader",
                  "Email",
                  "Book",
                  "Author",
                  "Borrowed Date",
                  "Due Date",
                  "Return Date",
                  "Status",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-3 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider select-none"
                    style={{ width: header === "Actions" ? "6rem" : undefined }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {lendings.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center p-8 text-gray-500 italic">
                    No overdue lendings found.
                  </td>
                </tr>
              )}

              {lendings.map((lending, i) => (
                <tr
                  key={lending._id}
                  className={i % 2 === 0 ? "bg-purple-50" : "bg-white"}
                >
                  <td className="px-3 py-2 whitespace-nowrap font-medium text-purple-900">
                    {lending.readerId.name}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-700 truncate max-w-xs">
                    {lending.readerId.email}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-800 font-semibold truncate max-w-xs">
                    {lending.bookId.title}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-600 italic truncate max-w-xs">
                    {lending.bookId.author}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-700">
                    {new Date(lending.barrowedDate).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-700">
                    {new Date(lending.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-700">
                    {lending.returnDate
                      ? new Date(lending.returnDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                        lending.status === "returned"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {lending.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleSendReminder(lending)}
                      className="inline-flex items-center justify-center rounded-full p-2 bg-green-100 text-green-700 hover:bg-green-200 transition"
                      title="Send Reminder Email"
                      aria-label={`Send reminder email to ${lending.readerId.name}`}
                    >
                      <FaRegEnvelope className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div><br></br>
        <button
            onClick={handleSendAll}
              className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow hover:bg-purple-700 transition"
          >
            📤 Send All Reminders
          </button>
      </div>
    </div>
  );
};

export default OverDuePage;
