import { TfiMoney, TfiWrite, TfiTime } from 'react-icons/tfi';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { FormValues } from './types';

interface Props {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}

export default function TransaccionFieldset({ register, errors }: Props) {
  return (
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
  );
}
