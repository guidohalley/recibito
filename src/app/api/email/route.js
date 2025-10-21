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

    // Validación básica del payload
    if (!emisor || !receptor || !transaccion) {
      return new Response(
        JSON.stringify({ error: "Payload inválido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const requiredStrings = [
      emisor.nombre,
      emisor.email,
      receptor.nombre,
      receptor.email,
      transaccion.monto,
      transaccion.moneda,
      transaccion.concepto,
      transaccion.fecha,
    ];
    if (requiredStrings.some((v) => typeof v !== 'string' || v.trim() === '')) {
      return new Response(
        JSON.stringify({ error: "Campos requeridos faltantes o inválidos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Comprobación de variables de entorno requeridas
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE, SMTP_FROM, ADMIN_EMAIL } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      return new Response(
        JSON.stringify({ error: "Configuración SMTP incompleta" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

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
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT || "587"),
      secure: SMTP_SECURE === "true",
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    // Envía el correo
    await transporter.sendMail({
      from: `"Misionary" <${SMTP_FROM || SMTP_USER}>`,
      to: [emisor.email, receptor.email].filter(Boolean).join(', '),
      bcc: ADMIN_EMAIL || undefined,
      subject: "Recibo de Pago | Misionary",
      html: htmlTemplate,
    });

    return new Response(
      JSON.stringify({ message: "Email enviado correctamente" }),
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