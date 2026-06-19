import axios, { AxiosResponse } from "axios";
import { typeMembership } from "@/types";

const API_BASE = "/api";

const membershipService = {
  /**
   * Get all membership plans
   */
  async getMembership(): Promise<AxiosResponse> {
    try {
      const response = await axios.get(`${API_BASE}/membership`);
      return response;
    } catch (error) {
      console.error("Error fetching membership:", error);
      throw error;
    }
  },

  /**
   * Get membership by ID
   */
  async getMembershipById(id: string): Promise<AxiosResponse> {
    try {
      const response = await axios.get(`${API_BASE}/membership/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching membership with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Add new membership plan
   */
  async addMembership(payload: typeMembership): Promise<AxiosResponse> {
    try {
      const response = await axios.post(`${API_BASE}/membership`, payload);
      return response;
    } catch (error) {
      console.error("Error adding membership:", error);
      throw error;
    }
  },

  /**
   * Update membership plan
   */
  async updateMembership(
    id: string,
    payload: typeMembership,
  ): Promise<AxiosResponse> {
    try {
      const response = await axios.put(`${API_BASE}/membership/${id}`, payload);
      return response;
    } catch (error) {
      console.error(`Error updating membership with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete membership plan
   */
  async deleteMembership(id: string): Promise<AxiosResponse> {
    try {
      const response = await axios.delete(`${API_BASE}/membership/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting membership with id ${id}:`, error);
      throw error;
    }
  },
};

export default membershipService;
