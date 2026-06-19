import axios, { AxiosResponse } from "axios";
import { LocationArea } from "@/types/UI";

const API_BASE = "/api";

const locationService = {

  async getLocations(): Promise<AxiosResponse> {
    try {
      const response = await axios.get(`${API_BASE}/location`);
      return response;
    } catch (error) {
      console.error("Error fetching locations:", error);
      throw error;
    }
  },


  async getLocationById(id: string): Promise<AxiosResponse> {
    try {
      const response = await axios.get(`${API_BASE}/location/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching location ${id}:`, error);
      throw error;
    }
  },


  async getLocationByArea(area: string): Promise<AxiosResponse> {
    try {
      const response = await axios.get(`${API_BASE}/location/area/${area}`);
      return response;
    } catch (error) {
      console.error(`Error fetching location for area ${area}:`, error);
      throw error;
    }
  },

  async addLocation(payload: LocationArea): Promise<AxiosResponse> {
    try {
      const response = await axios.post(`${API_BASE}/location`, payload);
      return response;
    } catch (error) {
      console.error("Error adding location:", error);
      throw error;
    }
  },


  async updateLocation(
    id: string,
    payload: Partial<LocationArea>,
  ): Promise<AxiosResponse> {
    try {
      const response = await axios.put(`${API_BASE}/location/${id}`, payload);
      return response;
    } catch (error) {
      console.error(`Error updating location ${id}:`, error);
      throw error;
    }
  },


  async deleteLocation(id: string): Promise<AxiosResponse> {
    try {
      const response = await axios.delete(`${API_BASE}/location/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting location ${id}:`, error);
      throw error;
    }
  },


  async predictLocation(area: string): Promise<AxiosResponse> {
    try {
      const response = await axios.post(`${API_BASE}/location/predict`, {
        area,
      });
      return response;
    } catch (error) {
      console.error("Error predicting location:", error);
      throw error;
    }
  },
};

export default locationService;
