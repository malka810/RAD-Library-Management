import {Router} from "express";
import ReaderRoutes from "./reader.routes";
import BookRoutes from "./book.routes";
import LendingRoutes from "./lending.routes";
import AuthRoutes from "./auth.routes";
import mailRoutes from "./mail.routes"; 


const rootRouter = Router()

rootRouter.use("/readers", ReaderRoutes)
rootRouter.use("/books", BookRoutes)
rootRouter.use("/lendings", LendingRoutes);
rootRouter.use("/auth", AuthRoutes);
rootRouter.use("/mail",mailRoutes );


export default rootRouter