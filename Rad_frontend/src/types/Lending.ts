export type Lending = {
  _id: string;
  readerId: string;
  bookId: string;
  barrowedDate: string;  // change this from borrowedDate
  dueDate: string;
  returnDate?: string;
  status: "borrowed" | "returned" | "overdue";
  createAt?: Date;
  updateAt?: Date;
};

// export type LendingFormData = {
//   readerId: string;
//   bookId: string;
//   barrowedDate: string;  // change this too
//   dueDate: string;
//   returnDate?: string;
//   status: "borrowed" | "returned" | "overdue";
// };

export type LendingFormData = Omit<Lending, "_id">;
