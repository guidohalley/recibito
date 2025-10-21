import { useState } from 'react';
import { TfiMoney, TfiAngleDown } from 'react-icons/tfi';
import * as Select from '@radix-ui/react-select';
import { UseFormSetValue, FieldErrors, UseFormRegister } from 'react-hook-form';
import { FormValues } from './types';

interface Props {
  register: UseFormRegister<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  errors: FieldErrors<FormValues>;
}

export default function MontoInput({ register, setValue, errors }: Props) {
  const [moneda, setMoneda] = useState<'ARS' | 'USD'>('ARS');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value;
    
    // Solo números
    const numeros = valor.replace(/\D/g, '');
    
    if (!numeros) {
      e.target.value = '';
      setValue('monto', '');
      return;
    }

    // Formatear: 20000 → $20.000,00
    const formatted = parseInt(numeros, 10).toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    e.target.value = `$${formatted}`;
    setValue('monto', numeros);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Al enfocar, mostrar solo números para editar
    const numeros = e.target.value.replace(/\D/g, '');
    e.target.value = numeros;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Al desenfocary, formatear de nuevo
    const numeros = e.target.value.replace(/\D/g, '');
    
    if (!numeros) {
      e.target.value = '';
      return;
    }

    const formatted = parseInt(numeros, 10).toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    e.target.value = `$${formatted}`;
  };

  return (
    <div className="mt-3 sm:mt-4">
      <label className="block text-gray-300 text-sm sm:text-base mb-2">Monto</label>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-end">
        {/* Input de monto */}
        <div className="relative flex-1 w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <TfiMoney className="text-sm sm:text-base" />
          </span>
          <input
            {...register('monto')}
            type="text"
            placeholder="Ej: 20000"
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="w-full pl-10 p-2 sm:p-2.5 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
        </div>

        {/* Selector de moneda */}
        <div className="relative group w-full sm:w-32">
          <Select.Root value={moneda} onValueChange={(val) => {
            setMoneda(val as 'ARS' | 'USD');
            setValue('moneda', val as 'ARS' | 'USD');
          }}>
            <Select.Trigger className="w-full px-3 py-2 sm:p-2.5 border border-gray-700 rounded bg-gray-800 text-white text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 transition hover:border-blue-500 text-sm sm:text-base min-h-[40px]">
              <Select.Value>{moneda}</Select.Value>
              <span className="text-gray-400 pointer-events-none ml-2">
                <TfiAngleDown className="text-xs" />
              </span>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content 
                className="bg-gray-900 text-white rounded shadow-xl border border-gray-700 z-50 overflow-hidden"
                position="popper"
              >
                <Select.Viewport className="py-1">
                  <Select.Item 
                    value="ARS" 
                    className="px-4 py-2 hover:bg-blue-600 cursor-pointer text-sm sm:text-base"
                  >
                    ARS
                  </Select.Item>
                  <Select.Item 
                    value="USD" 
                    className="px-4 py-2 hover:bg-blue-600 cursor-pointer text-sm sm:text-base"
                  >
                    USD
                  </Select.Item>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>

      {errors.monto && (
        <span className="text-red-400 text-xs sm:text-sm mt-1 block">{errors.monto.message}</span>
      )}
    </div>
  );
}
