export const runtime = "nodejs";

import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";

// Función para formatear fecha
const formatearFecha = (dateTimeLocal) => {
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

// Función para formatear monto con símbolo de moneda
const formatearMonto = (monto, moneda) => {
  const num = parseInt(monto, 10);
  const formatted = num.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  const simbolo = moneda === 'USD' ? 'U$D' : '$';
  return `${simbolo} ${formatted}`;
};

export async function POST(request) {
  try {
    const { emisor, receptor, transaccion } = await request.json();

    // Ruta completa al archivo emailTemplate.html
    const templatePath = path.join(process.cwd(), "src", "templates", "emailTemplate.html");
    let htmlTemplate = await fs.readFile(templatePath, "utf8");
    
    // Formatear fecha y monto
    const fechaFormateada = formatearFecha(transaccion.fecha);
    const montoFormateado = formatearMonto(transaccion.monto, transaccion.moneda);
    
    // Reemplaza los placeholders por los datos enviados
    htmlTemplate = htmlTemplate
      .replace(/{{emisorNombre}}/g, emisor.nombre)
      .replace(/{{emisorEmail}}/g, emisor.email)
      .replace(/{{receptorNombre}}/g, receptor.nombre)
      .replace(/{{receptorEmail}}/g, receptor.email)
      .replace(/{{monto}}/g, montoFormateado)
      .replace(/{{concepto}}/g, transaccion.concepto)
      .replace(/{{fecha}}/g, fechaFormateada);

    // Configura el transportador con las variables de entorno
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Envía el correo
    const info = await transporter.sendMail({
      from: `"Misionary" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: `${emisor.email}, ${receptor.email}, marketing@misionary.com`,
      subject: "Recibo de Pago | Misionary",
      html: htmlTemplate,      
    });

    return new Response(
      JSON.stringify({ message: "Email enviado correctamente", info }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Error al enviar email:", err);
    return new Response(
      JSON.stringify({ error: "Error al enviar email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}