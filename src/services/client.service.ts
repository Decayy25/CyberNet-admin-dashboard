import axios, { AxiosResponse } from "axios";
import { TotalClientResponse, Client } from "@/types";

const API = "/api"
const clientService = {
  async getTotalClient(): Promise<AxiosResponse> {
    try {
      const response =
        await axios.get<TotalClientResponse>(`${API}/client/count`);
      return response;
    } catch (error) {
      console.error("Error fetching client:", error);
      throw error;
    }
  },

  async getClient(): Promise<AxiosResponse> {
    try {
      const response = await axios.get(`${API}/client`);
      return response;
    } catch (error) {
      console.error("Error fetching client:", error);
      throw error;
    }
  },

  async addClient(payload: Client): Promise<AxiosResponse> {
    try {
      const response = await axios.post(`${API}/client`, payload);
      return response;
    } catch (error) {
      console.error("Error adding client:", error);
      throw error;
    }
  },

  async updateClient(
    payload: Client,
    id: string,
  ): Promise<AxiosResponse> {
    try {
      const response = await axios.put(`${API}/client/${id}`, payload);
      return response;
    } catch (error) {
      console.error("Error update client:", error);
      throw error;
    }
  },

  async deleteClient(id: string): Promise<AxiosResponse> {
    try {
      const response = await axios.delete(`${API}/client/${id}`);
      return response;
    } catch (error) {
      console.error("Error delete client:", error);
      throw error;
    }
  },
};
export default clientService;
