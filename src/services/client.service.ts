import { instanceWithCredential, instance } from "@/config/axios";
import endpoint from "./endpoint.constant";
import { Client } from "@/types";

const clientService = {
  getClient: (params?: string) => {
    const query = params ? `?${params}` : "";
    return instanceWithCredential.get(`${endpoint.CLIENT}${query}`);
  },
  addClient: (payload: Client) => instance.post(`${endpoint.CLIENT}`, payload),
  updateClient: (payload: Client, id: string) =>
    instanceWithCredential.put(`${endpoint.CLIENT}/${id}`, payload),
  removeClient: (id: string) => instanceWithCredential.delete(`${endpoint.CLIENT}/${id}`),
};

export default clientService;
