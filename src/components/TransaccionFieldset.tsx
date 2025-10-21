import { TfiWrite, TfiTime } from 'react-icons/tfi';
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { FormValues } from './types';
import MontoInput from './MontoInput';

interface Props {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  setValue: UseFormSetValue<FormValues>;
}

export default function TransaccionFieldset({ register, errors, setValue }: Props) {
  return (
    <fieldset className="border border-gray-700 p-4 sm:p-5 md:p-4 rounded">
      <legend className="text-base sm:text-lg md:text-lg font-semibold text-white">Detalles de la Transacción</legend>
      
      {/* Componente MontoInput */}
      <MontoInput register={register} setValue={setValue} errors={errors} />
      
      {/* Concepto */}
      <div className="mt-3 sm:mt-4">
        <label className="block text-gray-300 text-sm sm:text-base">Concepto</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <TfiWrite className="text-sm sm:text-base" />
          </span>
          <input
            {...register('concepto')}
            type="text"
            className="w-full pl-10 p-2 sm:p-2.5 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Ej: Servicios profesionales"
          />
        </div>
        {errors.concepto && <span className="text-red-400 text-xs sm:text-sm">{errors.concepto.message}</span>}
      </div>
      
      {/* Fecha y Hora */}
      <div className="mt-3 sm:mt-4">
        <label className="block text-gray-300 text-sm sm:text-base">Fecha y Hora</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <TfiTime className="text-sm sm:text-base" />
          </span>
          <input
            {...register('fecha')}
            type="datetime-local"
            className="w-full pl-10 p-2 sm:p-2.5 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
        </div>
        {errors.fecha && <span className="text-red-400 text-xs sm:text-sm">{errors.fecha.message}</span>}
      </div>
    </fieldset>
  );
}
