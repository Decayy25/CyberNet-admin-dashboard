import { instance} from "@/config/axios";
import { ILogin } from "@/types/Auth";
import endpoint from "./endpoint.constant";

const authService = {
    login: (payload: ILogin) => instance.post(`${endpoint.AUTH}/login`, payload),
}


export default authService;