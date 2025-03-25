export const runtime = "nodejs";

import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";

export async function POST(request) {
  try {
    const { emisor, receptor, transaccion } = await request.json();

    // Ruta completa al archivo emailTemplate.html
    const templatePath = path.join(process.cwd(), "src", "templates", "emailTemplate.html");
    let htmlTemplate = await fs.readFile(templatePath, "utf8");

    // Reemplaza los placeholders por los datos enviados
    htmlTemplate = htmlTemplate
      .replace(/{{emisorNombre}}/g, emisor.nombre)
      .replace(/{{emisorEmail}}/g, emisor.email)
      .replace(/{{receptorNombre}}/g, receptor.nombre)
      .replace(/{{receptorEmail}}/g, receptor.email)
      .replace(/{{monto}}/g, transaccion.monto)
      .replace(/{{concepto}}/g, transaccion.concepto)
      .replace(/{{fecha}}/g, transaccion.fecha);

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
      from: `"Recibito" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: `${emisor.email}, ${receptor.email}, ${process.env.ADMIN_EMAIL}`,
      subject: "Recibo de Pago",
      html: htmlTemplate,
      attachments: [
        {
          filename: "msnr.png",
          path: path.join(process.cwd(), "public", "msnr.svg"), // Asegúrate de que la ruta y el nombre del archivo sean correctos
          cid: "logo",
        },
      ],
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