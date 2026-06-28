import instance from '@/config/axios';
import endpoint from './endpoint.constant';
import { Client } from '@/types';

const clientService = {
  getClient: () => instance.get(`${endpoint.CLIENT}`),
  addClient: (payload: Client) => instance.post(`${endpoint.CLIENT}`, payload),
  updateClient: (payload: Client, id: string) => instance.put(`${endpoint.CLIENT}/${id}`, payload),
  removeClient: (id: string) => instance.delete(`${endpoint.CLIENT}/${id}`)
}

export default clientService;