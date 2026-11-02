import { z } from 'zod';

const requiredStringSchema = (message: string) => z.string().trim().min(1, { error: message });

const nullableStringSchema = z
  .string()
  .trim()
  .transform((value) => value || null);

export const customerFormSchema = z.object({
  firstName: requiredStringSchema('O nome é obrigatório.'),
  lastName: nullableStringSchema,
  email: requiredStringSchema('O e-mail é obrigatório.').pipe(
    z.email({ error: 'Formato de e-mail inválido.' })
  ),
  gender: nullableStringSchema,
  company: nullableStringSchema,
  city: nullableStringSchema,
  title: nullableStringSchema,
});
