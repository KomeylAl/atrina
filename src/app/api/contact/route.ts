import {
  getContactPageMeta,
  getContactMethods,
  createContactSubmission,
} from "@/lib/db/contact";
import { parseLocale } from "@/lib/api-utils";
import { jsonOk, jsonError } from "@/lib/api-response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = parseLocale(searchParams.get("locale"));

    const [meta, methods] = await Promise.all([
      getContactPageMeta(locale),
      getContactMethods(locale),
    ]);

    return jsonOk({ meta, methods });
  } catch (error) {
    console.error("[GET /api/contact]", error);
    return jsonError("Failed to fetch contact data", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return jsonError("Name, email, and message are required");
    }

    const submission = await createContactSubmission({
      name,
      email,
      subject,
      message,
    });

    return jsonOk(submission, 201);
  } catch (error) {
    console.error("[POST /api/contact]", error);
    return jsonError("Failed to submit contact form", 500);
  }
}
