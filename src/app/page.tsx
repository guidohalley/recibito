'use client';

import { useState, useEffect } from 'react';
import { TfiUser, TfiEmail, TfiMoney, TfiWrite, TfiTime, TfiAngleDown } from 'react-icons/tfi';
import { Toaster, toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Select from '@radix-ui/react-select';
import { motion, AnimatePresence } from 'framer-motion';

const schema = z.object({
  emisorNombre: z.string().min(2, 'Nombre requerido'),
  emisorEmail: z.string().email('Email inválido'),
  receptorNombre: z.string().min(2, 'Nombre requerido'),
  receptorEmail: z.string().email('Email inválido'),
  monto: z.string().min(1, 'Monto requerido'),
  concepto: z.string().min(1, 'Concepto requerido'),
  fecha: z.string().min(1, 'Fecha requerida'),
});

type FormValues = z.infer<typeof schema>;

export default function Home() {
  // Evita hydration mismatch: renderiza solo en cliente
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  // Función para obtener la fecha y hora actual en formato "YYYY-MM-DDTHH:MM"
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() - 3); // Ajuste para UTC-3
    return now.toISOString().slice(0, 16);
  };

  // Estados para capturar la información del recibo
  const [mensaje, setMensaje] = useState('');

  // Lista de receptores predefinidos
  const receptoresPredefinidos = [
    { nombre: 'Guido Halley', email: 'guido@misionary.com' },
    { nombre: 'Santiago Feltan', email: 'santiago@misionary.com' },
    { nombre: 'AGENCIA', email: 'marketing@misionary.com' },
    { nombre: 'Lucas Milde', email: 'lucascmilde@gmail.com' },
    { nombre: 'Evelyn Lopez', email: 'evelyn.lopez.chapedi@gmail.com' },
    { nombre: 'Nicole Marinoff', email: 'nicoleangm@gmail.com' },
    { nombre: 'Anabella Bartholdy', email: 'anabellabartholdy2000@gmail.com' },
    { nombre: 'Ivan Ezequiel Gomez', email: 'ivangomezlab@gmail.com' },
    { nombre: 'Gimena Valentina Rippel', email: 'gimenarippel@gmail.com' },
    { nombre: 'Jimena Romero', email: 'romerojimena54@gmail.com' },
  ];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      emisorNombre: '',
      emisorEmail: '',
      receptorNombre: '',
      receptorEmail: '',
      monto: '',
      concepto: '',
      fecha: '', // <-- inicial vacío
    },
  });

  // Setea la fecha solo en el cliente
  useEffect(() => {
    setValue('fecha', getCurrentDateTime());
    const timer = setInterval(() => {
      setValue('fecha', getCurrentDateTime());
    }, 60000);
    return () => clearInterval(timer);
  }, [setValue]);

  // Watch para receptor
  const receptorEmail = watch('receptorEmail');
  useEffect(() => {
    const selected = receptoresPredefinidos.find(r => r.email === receptorEmail);
    if (selected) {
      setValue('receptorNombre', selected.nombre);
    }
  }, [receptorEmail, setValue]);

  // Envía la información a la API para generar y enviar el recibo
  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emisor: { nombre: data.emisorNombre, email: data.emisorEmail },
          receptor: { nombre: data.receptorNombre, email: data.receptorEmail },
          transaccion: {
            monto: data.monto,
            concepto: data.concepto,
            fecha: data.fecha,
          },
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setMensaje('Recibo enviado correctamente');
        reset();
      } else {
        setMensaje(result.error || 'Error al enviar el recibo');
      }
    } catch (error) {
      setMensaje('Error al enviar el recibo');
    }
  };

  if (!mounted) return null;
  return (
    <div className="min-h-screen bg-black p-8 flex flex-col items-center">
      <Toaster />
      <main className="w-full max-w-3xl bg-[#18181b] rounded-2xl shadow-xl p-10">
        <div className="mb-8 flex items-center space-x-4">
          <img
            src="https://www.misionary.com/msnr.svg"
            alt="@misionary.ok"
            className="h-16"
          />
          <h2 className="text-3xl font-bold text-white">Generar Recibo de Pago</h2>
        </div>
        <AnimatePresence mode="wait">
          <motion.form
            key="form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
          >
            {/* Datos del Emisor */}
            <fieldset className="border border-gray-700 p-4 rounded">
              <legend className="text-lg font-semibold text-white">Datos del Emisor</legend>
              <div className="mt-2">
                <label className="block text-gray-300">Nombre</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <TfiUser />
                  </span>
                  <input
                    {...register('emisorNombre')}
                    type="text"
                    className="w-full pl-10 p-2 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {errors.emisorNombre && <span className="text-red-400 text-sm">{errors.emisorNombre.message}</span>}
              </div>
              <div className="mt-2">
                <label className="block text-gray-300">Email</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <TfiEmail />
                  </span>
                  <input
                    {...register('emisorEmail')}
                    type="email"
                    className="w-full pl-10 p-2 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {errors.emisorEmail && <span className="text-red-400 text-sm">{errors.emisorEmail.message}</span>}
              </div>
            </fieldset>
            {/* Datos del Receptor */}
            <fieldset className="border border-gray-700 p-4 rounded">
              <legend className="text-lg font-semibold text-white">Datos del Receptor</legend>
              <div className="mt-2">
                <label className="block text-gray-300">Seleccionar receptor</label>
                <div className="relative group">
                  <Select.Root
                    value={receptorEmail || 'otro'}
                    onValueChange={val => {
                      if (val === 'otro') {
                        setValue('receptorEmail', '');
                        setValue('receptorNombre', '');
                      } else {
                        setValue('receptorEmail', val);
                      }
                    }}
                  >
                    <Select.Trigger
                      className="w-full pl-11 pr-10 p-2 border border-gray-700 rounded bg-gray-800 text-white text-left flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition relative hover:border-blue-500 group-hover:border-blue-500"
                      style={{ minHeight: '42px' }}
                    >
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <TfiUser />
                      </span>
                      <Select.Value placeholder="-- Otro (ingresar manualmente) --" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <TfiAngleDown />
                      </span>
                    </Select.Trigger>
                    <Select.Content className="bg-gray-900 text-white rounded shadow-xl border border-gray-700 mt-1 z-50 animate-fade-in overflow-hidden">
                      <Select.Viewport className="py-1">
                        <Select.Item value="otro" className="px-4 py-2 hover:bg-blue-600 hover:text-white cursor-pointer rounded flex items-center gap-2 transition-colors">
                          <span className="text-gray-400"><TfiUser /></span>
                          <span>-- Otro (ingresar manualmente) --</span>
                        </Select.Item>
                        {receptoresPredefinidos.map(r => (
                          <Select.Item key={r.email} value={r.email} className="px-4 py-2 hover:bg-blue-600 hover:text-white cursor-pointer rounded flex items-center gap-2 transition-colors">
                            <span className="text-gray-400"><TfiUser /></span>
                            <span>{r.nombre} <span className='text-xs text-gray-400'>({r.email})</span></span>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Root>
                </div>
              </div>
              <div className="mt-2">
                <label className="block text-gray-300">Nombre</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <TfiUser />
                  </span>
                  <input
                    {...register('receptorNombre')}
                    type="text"
                    className="w-full pl-10 p-2 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={receptoresPredefinidos.some(r => r.email === receptorEmail)}
                  />
                </div>
                {errors.receptorNombre && <span className="text-red-400 text-sm">{errors.receptorNombre.message}</span>}
              </div>
              <div className="mt-2">
                <label className="block text-gray-300">Email</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <TfiEmail />
                  </span>
                  <input
                    {...register('receptorEmail')}
                    type="email"
                    className="w-full pl-10 p-2 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={receptoresPredefinidos.some(r => r.email === receptorEmail)}
                  />
                </div>
                {errors.receptorEmail && <span className="text-red-400 text-sm">{errors.receptorEmail.message}</span>}
              </div>
            </fieldset>
            {/* Detalles de la Transacción */}
            <fieldset className="border border-gray-700 p-4 rounded">
              <legend className="text-lg font-semibold text-white">Detalles de la Transacción</legend>
              <div className="mt-2">
                <label className="block text-gray-300">Monto</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <TfiMoney />
                  </span>
                  <input
                    {...register('monto')}
                    type="text"
                    className="w-full pl-10 p-2 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {errors.monto && <span className="text-red-400 text-sm">{errors.monto.message}</span>}
              </div>
              <div className="mt-2">
                <label className="block text-gray-300">Concepto</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <TfiWrite />
                  </span>
                  <input
                    {...register('concepto')}
                    type="text"
                    className="w-full pl-10 p-2 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {errors.concepto && <span className="text-red-400 text-sm">{errors.concepto.message}</span>}
              </div>
              <div className="mt-2">
                <label className="block text-gray-300">Fecha y Hora</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <TfiTime />
                  </span>
                  <input
                    {...register('fecha')}
                    type="datetime-local"
                    className="w-full pl-10 p-2 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {errors.fecha && <span className="text-red-400 text-sm">{errors.fecha.message}</span>}
              </div>
            </fieldset>
            <motion.button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-200"
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.03 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Generar Recibo'}
            </motion.button>
            {mensaje && (
              <motion.p
                className="text-center text-white mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                {mensaje}
              </motion.p>
            )}
          </motion.form>
        </AnimatePresence>
      </main>
    </div>
  );
}
