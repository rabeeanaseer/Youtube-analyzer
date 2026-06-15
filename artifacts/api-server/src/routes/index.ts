import { Router, type IRouter } from "express";
import healthRouter from "./health";
import channelsRouter from "./channels";

const router: IRouter = Router();

router.use(healthRouter);
router.use(channelsRouter);

export default router;
