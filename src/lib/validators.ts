import { z } from "zod";

export const LeadSchema = z.object({
  from_city: z.string().min(2).max(64),
  to_city: z.string().min(2).max(64),
  date: z.string().min(8).max(20),
  time: z.string().min(3).max(10),
  pax: z.string().regex(/^\d{1,2}$/),
  bags: z.preprocess(
    (val) => (val === undefined || val === "" ? "0" : val),
    z.string().regex(/^\d{1,2}$/),
  ),
  name: z.string().min(2).max(64),
  whatsapp: z.string().regex(/^\+?\d{10,15}$/),
  notes: z.string().max(200).optional().default(""),
  utm_source: z.string().optional(),
  utm_campaign: z.string().optional(),
});
