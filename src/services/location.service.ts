import instance from "@/config/axios";
import endpoint from "./endpoint.constant";
import { LocationInput } from "@/types/location";

const locationService = {
  getLocation: (params?: string) => {
    const query = params ? `?${params}` : "";
    return instance.get(`${endpoint.LOCATION}${query}`);
  },
  getLocationByArea: (area: string) =>
    instance.get(`${endpoint.LOCATION}/area/${area}`),
  addLocation: (payload: LocationInput) =>
    instance.post(`${endpoint.LOCATION}`, payload),

  updateLocation: (payload: LocationInput, id: string) =>
    instance.put(`${endpoint.LOCATION}/${id}`, payload),

  removeLocation: (id: string) => instance.delete(`${endpoint.LOCATION}/${id}`),
  predictLocation: (area: string) =>
    instance.post(`${endpoint.LOCATION}/predict`, { area }),
};

export default locationService;
