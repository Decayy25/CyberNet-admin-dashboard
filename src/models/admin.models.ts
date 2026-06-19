import * as Yup from "yup";

export const AdminSchema = Yup.object({
  identifier: Yup.string().required(),
  password: Yup.string().required(),
});

export type Admin = Yup.InferType<typeof AdminSchema>;