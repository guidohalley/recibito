"use client";

import { useState, useEffect } from 'react';

import { Toaster } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schema, FormValues } from './types';
import EmisorFieldset from './EmisorFieldset';
import ReceptorFieldset from './ReceptorFieldset';
import TransaccionFieldset from './TransaccionFieldset';
import ReciboCorrectionModal from './ReciboCorrectionModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReciboForm() {
  const [mounted, setMounted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const getCurrentDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() - 3);
    return now.toISOString().slice(0, 16);
  };

  const [mensaje, setMensaje] = useState('');


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
      moneda: 'ARS',
      concepto: '',
      fecha: '',
    },
  });

  // Solo mantener el efecto para la fecha
  useEffect(() => {
    setValue('fecha', getCurrentDateTime());
    const timer = setInterval(() => {
      setValue('fecha', getCurrentDateTime());
    }, 60000);
    return () => clearInterval(timer);
  }, [setValue]);

  const formData = watch();

  const handleGenerarRecibo = () => {
    setShowPreview(true);
  };

  const handleConfirmEmail = async () => {
    try {
      setIsLoadingEmail(true);
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emisor: { nombre: formData.emisorNombre, email: formData.emisorEmail },
          receptor: { nombre: formData.receptorNombre, email: formData.receptorEmail },
          transaccion: {
            monto: formData.monto,
            moneda: formData.moneda,
            concepto: formData.concepto,
            fecha: formData.fecha,
          },
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setMensaje('Recibo enviado correctamente');
        setShowPreview(false);
        reset();
      } else {
        setMensaje(result.error || 'Error al enviar el recibo');
      }
    } catch (error) {
      setMensaje('Error al enviar el recibo');
    } finally {
      setIsLoadingEmail(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    handleGenerarRecibo();
  };

  if (!mounted) return null;
  return (
    <>
      <Toaster />
      <ReciboCorrectionModal
        isOpen={showPreview}
        emisor={{ nombre: formData.emisorNombre, email: formData.emisorEmail }}
        receptor={{ nombre: formData.receptorNombre, email: formData.receptorEmail }}
        transaccion={{
          monto: formData.monto,
          moneda: formData.moneda,
          concepto: formData.concepto,
          fecha: formData.fecha,
        }}
        onConfirm={handleConfirmEmail}
        onCancel={() => setShowPreview(false)}
        isLoading={isLoadingEmail}
      />
      <main className="w-full min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 px-4 py-6 sm:px-6 sm:py-8 md:px-0 md:py-12 flex items-center justify-center">
        <div className="w-full max-w-3xl bg-[#18181b] rounded-2xl shadow-xl p-6 sm:p-8 md:p-10">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-center gap-4">
            <img
              src="https://www.misionary.com/msnr.svg"
              alt="@misionary.ok"
              className="h-12 sm:h-14 md:h-16"
            />
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center sm:text-left">Generar Recibo de Pago</h2>
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
              <EmisorFieldset
                register={register}
                errors={errors}
                setValue={setValue}
              />
              <ReceptorFieldset
                register={register}
                errors={errors}
                setValue={setValue}
              />
              <TransaccionFieldset 
                register={register} 
                errors={errors}
                setValue={setValue}
              />
              <motion.button
                type="submit"
                className="w-full py-2 sm:py-3 bg-[#E3FC74] text-black font-bold rounded-lg transition duration-200 hover:border hover:border-[#E3FC74] hover:bg-transparent hover:text-white text-sm sm:text-base"
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.03 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Generar Recibo'}
              </motion.button>
              {mensaje && (
                <motion.p
                  className="text-center text-white mt-4 text-sm sm:text-base"
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
        </div>
      </main>
    </>
  );
}
