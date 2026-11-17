// import nodemailer from "nodemailer";
// import dotenv from "dotenv";

// dotenv.config();

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: Number(process.env.EMAIL_PORT),
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// export const sendOverdueEmail = async (
//   to: string,
//   readerName: string,
//   overdueBooks: { title: string; dueDate: string }[]
// ) => {
//   const bookList = overdueBooks
//     .map((book) => `• ${book.title} (Due: ${book.dueDate})`)
//     .join("<br>");

//   const mailOptions = {
//     from: `"Book Club Library" <${process.env.EMAIL_USER}>`,
//     to,
//     subject: "Overdue Book Notification",
//     html: `<p>Dear ${readerName},</p>
//            <p>The following book(s) are overdue:</p>
//            <p>${bookList}</p>
//            <p>Please return them as soon as possible to avoid penalties.</p>
//            <p>Thank you,<br/>Book Club Library</p>`,
//   };

//   await transporter.sendMail(mailOptions);
// };

// export const sendDueDateExtendedEmail = async (
//   to: string,
//   readerName: string,
//   books: { title: string; dueDate: string }[]
// ) => {
//   const bookList = books
//     .map((book) => `• ${book.title} (New Due: ${book.dueDate})`)
//     .join("<br>");

//   const mailOptions = {
//     from: `"Book Club Library" <${process.env.EMAIL_USER}>`,
//     to,
//     subject: "Due Date Extended Notification",
//     html: `<p>Dear ${readerName},</p>
//            <p>The due date for the following book(s) has been extended:</p>
//            <p>${bookList}</p>
//            <p>Thank you,<br/>Book Club Library</p>`,
//   };

//   await transporter.sendMail(mailOptions);
// };

// export const sendEmail = async (to: string, subject: string, html: string) => {
//   const mailOptions = {
//     from: `"Book Club Library" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     html,
//   };

//   await transporter.sendMail(mailOptions);
// };
// utils/mailer.ts
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendOverdueEmail = async (
  to: string,
  readerName: string,
  overdueBooks: { title: string; dueDate: string }[]
) => {
  const bookList = overdueBooks
    .map((book) => `• ${book.title} (Due: ${book.dueDate})`)
    .join("<br>");

  const mailOptions = {
    from: `"Book Club Library" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Overdue Book Notification",
    html: `<p>Dear ${readerName},</p>
           <p>The following book(s) are overdue:</p>
           <p>${bookList}</p>
           <p>Please return them as soon as possible to avoid penalties.</p>
           <p>Thank you,<br/>Book Club Library</p>`,
  };

  await transporter.sendMail(mailOptions);
};
