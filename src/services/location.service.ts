import { instance, instanceWithCredential } from "@/config/axios";
import endpoint from "./endpoint.constant";
import { LocationInput } from "@/types/location";

const locationService = {
  getLocation: (params?: string) => {
    const query = params ? `?${params}` : "";
    return instanceWithCredential.get(`${endpoint.LOCATION}${query}`);
  },
  addLocation: (payload: LocationInput) =>
    instance.post(`${endpoint.LOCATION}`, payload),

  updateLocation: (payload: LocationInput, id: string) =>
    instanceWithCredential.put(`${endpoint.LOCATION}/${id}`, payload),

  removeLocation: (id: string) => instanceWithCredential.delete(`${endpoint.LOCATION}/${id}`),
  predictLocation: (area: string) =>
    instance.post(`${endpoint.LOCATION}/predict`, { area }),
};

export default locationService;
