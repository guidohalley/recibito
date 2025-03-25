'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  // Función para obtener la fecha y hora actual en formato "YYYY-MM-DDTHH:MM"
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() - 3); // Ajuste para UTC-3
    return now.toISOString().slice(0, 16);
  };

  // Estados para capturar la información del recibo
  const [emisor, setEmisor] = useState({ nombre: '', email: '' });
  const [receptor, setReceptor] = useState({ nombre: '', email: '' });
  const [transaccion, setTransaccion] = useState({
    monto: '',
    concepto: '',
    fecha: getCurrentDateTime(),
  });
  const [mensaje, setMensaje] = useState('');

  // Actualiza la fecha y hora cada minuto para mantenerlo dinámico
  useEffect(() => {
    const timer = setInterval(() => {
      setTransaccion(prev => ({ ...prev, fecha: getCurrentDateTime() }));
    }, 60000); // Actualización cada 60 segundos

    return () => clearInterval(timer);
  }, []);

  // Envía la información a la API para generar y enviar el recibo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { emisor, receptor, transaccion };

    try {
      const res = await fetch('/api/sendEmail', { // Asegúrate de que la ruta sea correcta
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (res.ok) {
        setMensaje('Recibo enviado correctamente');
      } else {
        setMensaje(result.error || 'Error al enviar el recibo');
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('Error al enviar el recibo');
    }
  };

  return (
    <div className="bg-black min-h-screen p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-white mb-6">Recibitos Misionary</h1>
      <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-lg mx-auto">
        <div className="flex justify-center mb-6">
          <Image
            src="/msnr.svg" // Asegúrate de que el archivo msnr.svg esté en la carpeta public
            alt="@misionary.ok"
            width={50}
            height={50}
          />
        </div>
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Generar Recibo de Pago
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos del Emisor */}
          <fieldset className="border border-gray-600 p-4 rounded">
            <legend className="text-white font-semibold">
              Datos del Emisor
            </legend>
            <div className="mt-2">
              <label className="block text-gray-300">Nombre</label>
              <input
                type="text"
                required
                value={emisor.nombre}
                onChange={(e) =>
                  setEmisor({ ...emisor, nombre: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-500"
              />
            </div>
            <div className="mt-2">
              <label className="block text-gray-300">Email</label>
              <input
                type="email"
                required
                value={emisor.email}
                onChange={(e) =>
                  setEmisor({ ...emisor, email: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-500"
              />
            </div>
          </fieldset>

          {/* Datos del Receptor */}
          <fieldset className="border border-gray-600 p-4 rounded">
            <legend className="text-white font-semibold">
              Datos del Receptor
            </legend>
            <div className="mt-2">
              <label className="block text-gray-300">Nombre</label>
              <input
                type="text"
                required
                value={receptor.nombre}
                onChange={(e) =>
                  setReceptor({ ...receptor, nombre: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-500"
              />
            </div>
            <div className="mt-2">
              <label className="block text-gray-300">Email</label>
              <input
                type="email"
                required
                value={receptor.email}
                onChange={(e) =>
                  setReceptor({ ...receptor, email: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-500"
              />
            </div>
          </fieldset>

          {/* Detalles de la Transacción */}
          <fieldset className="border border-gray-600 p-4 rounded">
            <legend className="text-white font-semibold">
              Detalles de la Transacción
            </legend>
            <div className="mt-2">
              <label className="block text-gray-300">Monto</label>
              <input
                type="text"
                required
                value={transaccion.monto}
                onChange={(e) =>
                  setTransaccion({ ...transaccion, monto: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-500"
              />
            </div>
            <div className="mt-2">
              <label className="block text-gray-300">Concepto</label>
              <input
                type="text"
                required
                value={transaccion.concepto}
                onChange={(e) =>
                  setTransaccion({
                    ...transaccion,
                    concepto: e.target.value,
                  })
                }
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-500"
              />
            </div>
            <div className="mt-2">
              <label className="block text-gray-300">Fecha y Hora</label>
              <input
                type="datetime-local"
                required
                value={transaccion.fecha}
                onChange={(e) =>
                  setTransaccion({ ...transaccion, fecha: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-500"
              />
            </div>
          </fieldset>

          <button
            type="submit"
            className="w-full bg-white hover:bg-gray-300 text-black font-bold py-2 rounded"
          >
            Generar Recibo
          </button>

          {mensaje && (
            <p className="text-white text-center mt-4">{mensaje}</p>
          )}
        </form>
      </div>
    </div>
  );
}
