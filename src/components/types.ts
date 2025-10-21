import { z } from 'zod';

export const schema = z.object({
  emisorNombre: z.string().min(2, 'Nombre requerido'),
  emisorEmail: z.string().email('Email inválido'),
  receptorNombre: z.string().min(2, 'Nombre requerido'),
  receptorEmail: z.string().email('Email inválido'),
  monto: z.string().min(1, 'Monto requerido'),
  moneda: z.enum(['ARS', 'USD']),
  concepto: z.string().min(1, 'Concepto requerido'),
  fecha: z.string().min(1, 'Fecha requerida'),
});

export type FormValues = z.infer<typeof schema>;
