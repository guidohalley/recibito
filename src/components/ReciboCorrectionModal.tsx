import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReciboCorrectionModalProps {
  isOpen: boolean;
  emisor: { nombre: string; email: string };
  receptor: { nombre: string; email: string };
  transaccion: {
    monto: string;
    moneda: 'ARS' | 'USD';
    concepto: string;
    fecha: string;
  };
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

// Función para formatear fecha
const formatearFecha = (dateTimeLocal: string) => {
  const [fecha, hora] = dateTimeLocal.split("T");
  const [año, mes, día] = fecha.split("-");
  const [horas, minutos] = hora.split(":");
  
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  
  const nombreMes = meses[parseInt(mes) - 1];
  return `${parseInt(día)} de ${nombreMes} de ${año}, a las ${horas}:${minutos} hs`;
};

// Función para formatear monto
const formatearMonto = (monto: string, moneda: 'ARS' | 'USD') => {
  const num = parseInt(monto, 10);
  const formatted = num.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  const simbolo = moneda === 'USD' ? 'U$D' : '$';
  return `${simbolo} ${formatted}`;
};

export default function ReciboCorrectionModal({
  isOpen,
  emisor,
  receptor,
  transaccion,
  onConfirm,
  onCancel,
  isLoading,
}: ReciboCorrectionModalProps) {
  const fechaFormateada = formatearFecha(transaccion.fecha);
  const montoFormateado = formatearMonto(transaccion.monto, transaccion.moneda);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Contenido del Recibo */}
            <div className="p-6 sm:p-8">
              {/* Encabezado */}
              <div className="text-center border-b-2 border-gray-900 pb-6 mb-6">
                <h1 className="text-3xl font-bold text-gray-900 tracking-wider">RECIBO DE PAGO</h1>
              </div>

              {/* Secciones del Recibo */}
              <div className="space-y-6">
                {/* Emisor */}
                <div>
                  <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Emisor del Pago</div>
                  <div className="text-gray-900">
                    <p className="font-semibold">{emisor.nombre}</p>
                    <p className="text-sm text-gray-600">{emisor.email}</p>
                  </div>
                </div>

                {/* Receptor */}
                <div>
                  <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Receptor del Pago</div>
                  <div className="text-gray-900">
                    <p className="font-semibold">{receptor.nombre}</p>
                    <p className="text-sm text-gray-600">{receptor.email}</p>
                  </div>
                </div>

                {/* Separador */}
                <div className="border-t border-gray-300"></div>

                {/* Detalles */}
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-gray-700">Monto:</span>
                    <span className="text-lg font-bold text-gray-900">{montoFormateado}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-gray-700">Concepto:</span>
                    <span className="text-gray-900">{transaccion.concepto}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-gray-700">Fecha y Hora:</span>
                    <span className="text-gray-900">{fechaFormateada}</span>
                  </div>
                </div>

                {/* Declaración Legal */}
                <div className="border-t border-gray-300 pt-6">
                  <p className="text-sm text-gray-700 text-justify leading-relaxed">
                    Siendo la fecha {fechaFormateada}, se deja constancia formal del pago efectuado por el emisor al receptor por el monto y concepto detallados anteriormente.
                  </p>
                  <p className="text-sm text-gray-700 text-justify leading-relaxed mt-3">
                    Este documento tiene validez como recibo de pago y constancia de la transacción realizada.
                  </p>
                </div>

                {/* Footer Unificado */}
                <div className="border-t border-gray-200 pt-6 text-center">
                  <p className="text-xs font-bold text-gray-800 uppercase tracking-wide">Misionary</p>
                  <p className="text-xs text-gray-600 mt-1">Hacemos realidad tu visión digital</p>
                  <div className="flex flex-col items-center gap-1 mt-3 text-xs text-gray-600">
                    <a href="https://www.misionary.com" className="hover:text-gray-900 transition">www.misionary.com</a>
                    <a href="mailto:marketing@misionary.com" className="hover:text-gray-900 transition">marketing@misionary.com</a>
                    <p>📍 Posadas, Misiones • Argentina</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="bg-gray-50 px-6 sm:px-8 py-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
              <motion.button
                onClick={onCancel}
                disabled={isLoading}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancelar
              </motion.button>
              <motion.button
                onClick={onConfirm}
                disabled={isLoading}
                className="px-6 py-2 bg-[#E3FC74] text-gray-900 font-bold rounded-lg hover:bg-[#d4ed63] transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? 'Enviando...' : 'Aceptar y Enviar'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
