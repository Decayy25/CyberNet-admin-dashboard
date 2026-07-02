import { instance, instanceWithCredential} from "@/config/axios";
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
    instanceWithCredential.post(`${endpoint.MEMBERSHIP}`, payload),
  updateMembership: (payload: typeMembership, id: string) =>
    instanceWithCredential.put(`${endpoint.MEMBERSHIP}/${id}`, payload),
  deleteMembership: (id: string) =>
    instanceWithCredential.delete(`${endpoint.MEMBERSHIP}/${id}`),
};

export default membershipService;