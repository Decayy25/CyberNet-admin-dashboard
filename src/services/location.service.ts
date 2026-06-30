import instance from "@/config/axios";
import endpoint from "./endpoint.constant";
import { typeLocation } from "@/types";

const locationService = {
  getLocation: () => instance.get(`${endpoint.LOCATION}`),
  getLocationByArea: (area: string) =>
    instance.get(`${endpoint.LOCATION}/area/${area}`),
  addLocation: (payload: typeLocation) =>
    instance.post(`${endpoint.LOCATION}`, payload),
  updateLocation: (payload: typeLocation, id: string) =>
    instance.put(`${endpoint.LOCATION}/${id}`, payload),
  removeLocation: (id: string) => instance.delete(`${endpoint.LOCATION}/${id}`),
  predictLocation: (area: string) =>
    instance.post(`${endpoint.LOCATION}/predict`, { area }),
};

export default locationService;
