import type { Hono } from "hono";

import email from "./controllers/email.js";

export default function routes(app: Hono) {
    app.route("/api/email", email);
}