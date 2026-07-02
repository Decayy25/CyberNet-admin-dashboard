/**
 * Single source of truth for Location / Region types.
 *
 * Sebelumnya bentuk yang sama didefinisikan ulang di 4 tempat berbeda
 * (types/index.ts, types/UI.d.ts x3, types/Auth.d.ts) dengan nama dan
 * literal status yang tidak konsisten ("tidak_tersedia" vs "tidak tersedia").
 * Semua tipe location/region sekarang hidup di sini dan di-reuse di
 * seluruh layer (service, hook, component, controller).
 */

/** Status ketersediaan jaringan untuk sebuah area/wilayah. */
export type LocationStatus = "tersedia" | "tidak_tersedia";

/**
 * Entity Location sebagaimana dipakai di sisi client (list, table, form state).
 * `_id` opsional karena belum ada saat record baru dibuat di form "tambah".
 */
export interface Location {
  _id?: string;
  area: string;
  status: LocationStatus;
}

/** Payload untuk create/update — tidak pernah menyertakan `_id`. */
export type LocationInput = Omit<Location, "_id">;

/**
 * Bentuk dokumen persis seperti tersimpan di MongoDB (collection `regions`).
 * Dipakai di layer controller/backend.
 */
export interface LocationDocument {
  _id: string;
  area: string;
  status: LocationStatus;
  areaSearchKey?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
