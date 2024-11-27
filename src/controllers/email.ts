import { Hono } from 'hono'
import nodemailer from 'nodemailer';

const app = new Hono()
.get("/", (c) => c.json("list authors"))
.post("/", async (c) => {
    const body = await c.req.json();
    const { smtp, mail } = body;
    
    const { host, port, user, password } = smtp;
    const { from, to, subject, htmlContent } = mail;

    // check if htmlContent is base64 encoded
    if (!htmlContent.startsWith("data:text/html;base64,")) {
        return c.json("`htmlContent` is not base64 encoded", 400);
    }

    // Decode the base64 htmlContent
    const decodedHtmlContent = Buffer.from(htmlContent.replace("data:text/html;base64,", ""), 'base64').toString('utf-8');

    const transporter = nodemailer.createTransport({
        host,
        port: port || 587,
        auth: {
            user,
            pass: password,
        },
        secure: false,
        tls: {
            rejectUnauthorized: false,
        }
    });

    await transporter.sendMail({
        from,
        to,
        subject,
        html: decodedHtmlContent
    }).catch((error: any) => {
        console.error(error);
        return c.json("An error occurred while sending the email", 500);
    });

    return c.json("mail sent", 200);
})
.get("/:id", (c) => c.json(`get ${c.req.param("id")}`));

export default app