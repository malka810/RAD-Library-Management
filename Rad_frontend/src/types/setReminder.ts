import emailjs from "emailjs-com";

export const sendReminderEmail = async ({
  readerEmail,
  readerName,
  bookTitle,
  dueDate,
}: {
  readerEmail: string;
  readerName: string;
  bookTitle: string;
  dueDate: string;
}) => {
  const serviceId = "service_fv2zr5i";       // ✅ from your dashboard
  const templateId = "template_6znmyic";     // ✅ from your template
  const userId = "vqCp25z7sxEoA_VT3";        // ✅ from your EmailJS dashboard

  const templateParams = {
    reader_name: readerName,
    book_title: bookTitle,
    due_date: dueDate,
    to_email: readerEmail,
  };

  try {
    const result = await emailjs.send(serviceId, templateId, templateParams, userId);
    console.log("Email sent successfully", result.status);
    return result;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};
