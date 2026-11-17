export type Book = {
  _id: string;
  title: string;
  author: string;
  description: string;
  publishYear: number;
  totalCopies: number;
  copiesAvailable: number;
  isActive?: boolean;
  createAt?: Date;
  updateAt?: Date;
};

export type BookFormData = {
  title: string;
  author: string;
  description: string;
  publishYear: number;
  totalCopies: number;
  copiesAvailable: number;
};

