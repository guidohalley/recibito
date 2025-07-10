import { useState, useEffect } from 'react';
import { TfiUser, TfiEmail, TfiAngleDown } from 'react-icons/tfi';
import * as Select from '@radix-ui/react-select';
import type { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { FormValues } from './types';

interface Props {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  setValue: UseFormSetValue<FormValues>;
}

export default function ReceptorFieldset({ register, errors, setValue }: Props) {
  // Valores predefinidos
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

  // Estado local para manejo simple
  const [selectedOption, setSelectedOption] = useState('otro');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [isReadonly, setIsReadonly] = useState(false);

  // Sincronizar con React Hook Form
  useEffect(() => {
    setValue('receptorNombre', nombre);
    setValue('receptorEmail', email);
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
      const selected = receptoresPredefinidos.find(r => r.email === value);
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
    const selected = receptoresPredefinidos.find(r => r.email === selectedOption);
    return selected ? `${selected.nombre} (${selected.email})` : '-- Otro (ingresar manualmente) --';
  };

  return (
    <fieldset className="border border-gray-700 p-4 rounded">
      <legend className="text-lg font-semibold text-white">Datos del Receptor</legend>
      
      {/* Selector */}
      <div className="mt-2">
        <label className="block text-gray-300">Seleccionar receptor</label>
        <div className="relative group">
          <Select.Root
            value={selectedOption}
            onValueChange={handleSelectChange}
          >
            <Select.Trigger
              className="w-full pl-11 pr-10 p-2 border border-gray-700 rounded bg-gray-800 text-white text-left flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition relative hover:border-blue-500 group-hover:border-blue-500"
              style={{ minHeight: '42px' }}
            >
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <TfiUser />
              </span>
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
                  <Select.Item value="otro" className="px-4 py-2 hover:bg-blue-600 hover:text-white cursor-pointer rounded flex items-center gap-2 transition-colors">
                    <span className="text-gray-400"><TfiUser /></span>
                    <span>-- Otro (ingresar manualmente) --</span>
                  </Select.Item>
                  {receptoresPredefinidos.map((receptor) => (
                    <Select.Item 
                      key={receptor.email} 
                      value={receptor.email} 
                      className="px-4 py-2 hover:bg-blue-600 hover:text-white cursor-pointer rounded flex items-center gap-2 transition-colors"
                    >
                      <span className="text-gray-400"><TfiUser /></span>
                      <span>{receptor.nombre} <span className='text-xs text-gray-400'>({receptor.email})</span></span>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>

      {/* Campo Nombre */}
      <div className="mt-2">
        <label className="block text-gray-300">Nombre</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <TfiUser />
          </span>
          <input
            {...register('receptorNombre')}
            type="text"
            value={nombre}
            onChange={(e) => !isReadonly && setNombre(e.target.value)}
            readOnly={isReadonly}
            className={`w-full pl-10 p-2 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isReadonly ? 'cursor-not-allowed opacity-75' : ''
            }`}
            placeholder={isReadonly ? '' : 'Nombre del receptor'}
          />
        </div>
        {errors.receptorNombre && <span className="text-red-400 text-sm">{errors.receptorNombre.message}</span>}
      </div>

      {/* Campo Email */}
      <div className="mt-2">
        <label className="block text-gray-300">Email</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <TfiEmail />
          </span>
          <input
            {...register('receptorEmail')}
            type="email"
            value={email}
            onChange={(e) => !isReadonly && setEmail(e.target.value)}
            readOnly={isReadonly}
            className={`w-full pl-10 p-2 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isReadonly ? 'cursor-not-allowed opacity-75' : ''
            }`}
            placeholder={isReadonly ? '' : 'Email del receptor'}
          />
        </div>
        {errors.receptorEmail && <span className="text-red-400 text-sm">{errors.receptorEmail.message}</span>}
      </div>
    </fieldset>
  );
}
