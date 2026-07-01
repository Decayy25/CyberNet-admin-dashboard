import instance from "@/config/axios";
import endpoint from "./endpoint.constant";
import { Client } from "@/types";

const clientService = {
  getClient: (params?: string) => {
    const query = params ? `?${params}` : "";
    return instance.get(`${endpoint.CLIENT}${query}`);
  },
  addClient: (payload: Client) => instance.post(`${endpoint.CLIENT}`, payload),
  updateClient: (payload: Client, id: string) =>
    instance.put(`${endpoint.CLIENT}/${id}`, payload),
  removeClient: (id: string) => instance.delete(`${endpoint.CLIENT}/${id}`),
};

export default clientService;