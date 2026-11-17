export type Reader = {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    isActive?: boolean;
    createAt?: Date;
    updateAt?: Date;
};

export type ReaderFormData = {
    name: string;
    email: string;
    phone: string;
    address: string;
    password: string;
};
