'use client';

import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

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
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Envía la información a la API para generar y enviar el recibo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { emisor, receptor, transaccion };

    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (res.ok) {
        setMensaje('Recibo enviado correctamente');
        toast('Recibo enviado correctamente', {
          icon: '👏',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      } else {
        setMensaje(result.error || 'Error al enviar el recibo');
        toast(result.error || 'Error al enviar el recibo', {
          icon: '❌',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('Error al enviar el recibo');
      toast('Error al enviar el recibo', {
        icon: '❌',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-black p-8 flex flex-col items-center">
      <Toaster />
      {/* <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold text-white">Recibitos Misionary</h1>
      </header> */}
      <main className="w-full max-w-3xl bg-gray-900 rounded-2xl shadow-xl p-10">
        {/* Encabezado con logo a la izquierda y título a la derecha */}
        <div className="mb-8 flex items-center space-x-4">
          <img
            src="https://misionary.com/wp-content/uploads/2024/06/Logos-Misionary_MSNR-440-a.png"
            alt="@misionary.ok"
            className="h-16"
          />
          <h2 className="text-3xl font-bold text-white">Generar Recibo de Pago</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos del Emisor */}
          <fieldset className="border border-gray-700 p-4 rounded">
            <legend className="text-lg font-semibold text-white">Datos del Emisor</legend>
            <div className="mt-2">
              <label className="block text-gray-300">Nombre</label>
              <input
                type="text"
                required
                value={emisor.nombre}
                onChange={(e) => setEmisor({ ...emisor, nombre: e.target.value })}
                className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-2">
              <label className="block text-gray-300">Email</label>
              <input
                type="email"
                required
                value={emisor.email}
                onChange={(e) => setEmisor({ ...emisor, email: e.target.value })}
                className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </fieldset>
          {/* Datos del Receptor */}
          <fieldset className="border border-gray-700 p-4 rounded">
            <legend className="text-lg font-semibold text-white">Datos del Receptor</legend>
            <div className="mt-2">
              <label className="block text-gray-300">Nombre</label>
              <input
                type="text"
                required
                value={receptor.nombre}
                onChange={(e) => setReceptor({ ...receptor, nombre: e.target.value })}
                className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-2">
              <label className="block text-gray-300">Email</label>
              <input
                type="email"
                required
                value={receptor.email}
                onChange={(e) => setReceptor({ ...receptor, email: e.target.value })}
                className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </fieldset>
          {/* Detalles de la Transacción */}
          <fieldset className="border border-gray-700 p-4 rounded">
            <legend className="text-lg font-semibold text-white">Detalles de la Transacción</legend>
            <div className="mt-2">
              <label className="block text-gray-300">Monto</label>
              <input
                type="text"
                required
                value={transaccion.monto}
                onChange={(e) => {
                  const value = e.target.value.replace(/\$/g, "");
                  setTransaccion({ ...transaccion, monto: `$${value}` });
                }}
                className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-2">
              <label className="block text-gray-300">Concepto</label>
              <input
                type="text"
                required
                value={transaccion.concepto}
                onChange={(e) => setTransaccion({ ...transaccion, concepto: e.target.value })}
                className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-2">
              <label className="block text-gray-300">Fecha y Hora</label>
              <input
                type="datetime-local"
                required
                value={transaccion.fecha}
                onChange={(e) => setTransaccion({ ...transaccion, fecha: e.target.value })}
                className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </fieldset>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-200"
          >
            Generar Recibo
          </button>
          {mensaje && <p className="text-center text-white mt-4">{mensaje}</p>}
        </form>
      </main>
    </div>
  );
}
