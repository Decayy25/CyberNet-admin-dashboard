import instance from "@/config/axios";
import endpoint from "./endpoint.constant";
import { typeMembership } from "@/types";

const membershipService = {
  getMembership: (params?: string) => {
    const query = params ? `?${params}` : "";
    return instance.get(`${endpoint.MEMBERSHIP}${query}`);
  },
  getMembershipById: (id: string) =>
    instance.get(`${endpoint.MEMBERSHIP}/${id}`),
  addMembership: (payload: typeMembership) =>
    instance.post(`${endpoint.MEMBERSHIP}`, payload),
  updateMembership: (payload: typeMembership, id: string) =>
    instance.put(`${endpoint.MEMBERSHIP}/${id}`, payload),
  deleteMembership: (id: string) =>
    instance.delete(`${endpoint.MEMBERSHIP}/${id}`),
};

export default membershipService;