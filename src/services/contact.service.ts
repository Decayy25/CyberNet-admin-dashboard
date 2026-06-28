import instance  from "@/config/axios";
import endpoint from "./endpoint.constant";
import { TypeContactForm } from "@/types/package";

const contactService = {
    addClientWithForm: (payload: TypeContactForm) => instance.post(`${endpoint.CONTACT}`, payload),
}

export default contactService;