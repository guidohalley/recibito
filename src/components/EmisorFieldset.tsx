
import { useState, useEffect } from 'react';
import * as Select from '@radix-ui/react-select';
import { TfiUser, TfiEmail, TfiAngleDown } from 'react-icons/tfi';
import type { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { FormValues } from './types';

interface Props {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  setValue: UseFormSetValue<FormValues>;
}

export default function EmisorFieldset({ register, errors, setValue }: Props) {
  // Valores predefinidos
  const emisoresPredefinidos = [
    { nombre: 'Guido Halley', email: 'guido@misionary.com' },
    { nombre: 'Santiago Feltan', email: 'santiago@misionary.com' },
  ];

  // Estado local para manejo simple
  const [selectedOption, setSelectedOption] = useState('otro');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [isReadonly, setIsReadonly] = useState(false);

  // Sincronizar con React Hook Form
  useEffect(() => {
    setValue('emisorNombre', nombre);
    setValue('emisorEmail', email);
  }, [nombre, email, setValue]);

  const handleSelectChange = (value: string) => {
    setSelectedOption(value);
    
    if (value === 'otro') {
      // Modo manual
      setNombre('');
      setEmail('');
      setIsReadonly(false);
    } else {
      // Buscar y setear el predefinido
      const selected = emisoresPredefinidos.find(e => e.email === value);
      if (selected) {
        setNombre(selected.nombre);
        setEmail(selected.email);
        setIsReadonly(true);
      }
    }
  };

  // Obtener el texto a mostrar en el select
  const getSelectDisplayValue = () => {
    if (selectedOption === 'otro') {
      return '-- Otro (ingresar manualmente) --';
    }
    const selected = emisoresPredefinidos.find(e => e.email === selectedOption);
    return selected ? `${selected.nombre} (${selected.email})` : '-- Otro (ingresar manualmente) --';
  };

  return (
    <fieldset className="border border-gray-700 p-4 sm:p-5 md:p-4 rounded">
      <legend className="text-base sm:text-lg md:text-lg font-semibold text-white">Datos del Emisor</legend>
      
      {/* Selector */}
      <div className="mt-3 sm:mt-4">
        <label className="block text-gray-300 text-sm sm:text-base">Seleccionar emisor</label>
        <div className="relative group">
          <Select.Root
            value={selectedOption}
            onValueChange={handleSelectChange}
          >
            <Select.Trigger
              className="w-full pl-3 pr-8 p-2 sm:p-2.5 border border-gray-700 rounded bg-gray-800 text-white text-left flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition relative hover:border-blue-500 group-hover:border-blue-500 text-sm sm:text-base"
              style={{ minHeight: '40px' }}
            >
              <Select.Value>
                {getSelectDisplayValue()}
              </Select.Value>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <TfiAngleDown />
              </span>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content 
                className="bg-gray-900 text-white rounded shadow-xl border border-gray-700 mt-1 z-50 animate-fade-in overflow-hidden"
                position="popper"
              >
                <Select.Viewport className="py-1">
                  <Select.Item value="otro" className="px-3 sm:px-4 py-2 hover:bg-blue-600 hover:text-white cursor-pointer rounded transition-colors text-sm sm:text-base">
                    -- Otro (ingresar manualmente) --
                  </Select.Item>
                  {emisoresPredefinidos.map((emisor) => (
                    <Select.Item 
                      key={emisor.email} 
                      value={emisor.email} 
                      className="px-3 sm:px-4 py-2 hover:bg-blue-600 hover:text-white cursor-pointer rounded flex items-center gap-2 transition-colors text-sm sm:text-base"
                    >
                      <span>{emisor.nombre} <span className='text-xs text-gray-400'>({emisor.email})</span></span>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>

      {/* Campo Nombre */}
      <div className="mt-3 sm:mt-4">
        <label className="block text-gray-300 text-sm sm:text-base">Nombre</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <TfiUser className="text-sm sm:text-base" />
          </span>
          <input
            {...register('emisorNombre')}
            type="text"
            value={nombre}
            onChange={(e) => !isReadonly && setNombre(e.target.value)}
            readOnly={isReadonly}
            className={`w-full pl-10 p-2 sm:p-2.5 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
              isReadonly ? 'cursor-not-allowed opacity-75' : ''
            }`}
            placeholder={isReadonly ? '' : 'Nombre del emisor'}
          />
        </div>
        {errors.emisorNombre && <span className="text-red-400 text-xs sm:text-sm">{errors.emisorNombre.message}</span>}
      </div>

      {/* Campo Email */}
      <div className="mt-3 sm:mt-4">
        <label className="block text-gray-300 text-sm sm:text-base">Email</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <TfiEmail className="text-sm sm:text-base" />
          </span>
          <input
            {...register('emisorEmail')}
            type="email"
            value={email}
            onChange={(e) => !isReadonly && setEmail(e.target.value)}
            readOnly={isReadonly}
            className={`w-full pl-10 p-2 sm:p-2.5 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
              isReadonly ? 'cursor-not-allowed opacity-75' : ''
            }`}
            placeholder={isReadonly ? '' : 'Email del emisor'}
          />
        </div>
        {errors.emisorEmail && <span className="text-red-400 text-xs sm:text-sm">{errors.emisorEmail.message}</span>}
      </div>
    </fieldset>
  );
}
