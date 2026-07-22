export type LocationStatus = "tersedia" | "akan_tersedia" |"tidak_tersedia";

export interface Location {
  _id?: string;
  area: string;
  status: LocationStatus;
}

export type LocationInput = Omit<Location, "_id">;


export interface LocationDocument {
  _id: string;
  area: string;
  status: LocationStatus;
  areaSearchKey?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
