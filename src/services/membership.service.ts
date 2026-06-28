import instance from "@/config/axios";
import endpoint from "./endpoint.constant";
import { typeMembership } from "@/types";

const membershipService = {
  getMembership: () => instance.get(`${endpoint.MEMBERSHIP}`),
  getMembershipById: (id: string) => instance.get(`${endpoint.MEMBERSHIP}/${id}`),
  addMembership: (payload: typeMembership) => instance.post(`${endpoint.MEMBERSHIP}`, payload),
  updateMembership: (payload: typeMembership, id: string) => instance.put(`${endpoint.MEMBERSHIP}/${id}`, payload),
  deleteMembership: (id: string) => instance.delete(`${endpoint.MEMBERSHIP}/${id}`),
}

export default membershipService;









// import axios, { AxiosResponse } from "axios";
// import { typeMembership } from "@/types";

// const API_BASE = "/api";

// const membershipService = {
//   async getMembership(): Promise<AxiosResponse> {
//     try {
//       const response = await axios.get(`${API_BASE}/membership`);
//       return response;
//     } catch (error) {
//       console.error("Error fetching membership:", error);
//       throw error;
//     }
//   },

//   async getMembershipById(id: string): Promise<AxiosResponse> {
//     try {
//       const response = await axios.get(`${API_BASE}/membership/${id}`);
//       return response;
//     } catch (error) {
//       console.error(`Error fetching membership with id ${id}:`, error);
//       throw error;
//     }
//   },

//   async addMembership(payload: typeMembership): Promise<AxiosResponse> {
//     try {
//       const response = await axios.post(`${API_BASE}/membership`, payload);
//       return response;
//     } catch (error) {
//       console.error("Error adding membership:", error);
//       throw error;
//     }
//   },

//   async updateMembership(
//     id: string,
//     payload: typeMembership,
//   ): Promise<AxiosResponse> {
//     try {
//       const response = await axios.put(`${API_BASE}/membership/${id}`, payload);
//       return response;
//     } catch (error) {
//       console.error(`Error updating membership with id ${id}:`, error);
//       throw error;
//     }
//   },

//   async deleteMembership(id: string): Promise<AxiosResponse> {
//     try {
//       const response = await axios.delete(`${API_BASE}/membership/${id}`);
//       return response;
//     } catch (error) {
//       console.error(`Error deleting membership with id ${id}:`, error);
//       throw error;
//     }
//   },
// };

// export default membershipService;
