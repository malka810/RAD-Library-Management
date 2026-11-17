export const sendDueDateReminder = async (readerId: string, lendingId: string) => {
  const response = await fetch("http://localhost:3000/api/mail/send-reminder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ readerId, lendingId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to send reminder");
  }

  return response.json();
};

export const sendAllDueDateReminders = async () => {
  const response = await fetch("http://localhost:3000/api/mail/send-bulk-reminders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to send bulk reminders");
  }

  return response.json();
};

