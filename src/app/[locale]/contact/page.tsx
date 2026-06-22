import ContactInfo from "@/components/ContactInfo";
import ContactForm from "@/components/ContactForm";
import ContactHeader from "@/components/ContactHeader";
import ContactMethod from "@/components/ContactMethod";
import { getContactPageMeta, getContactMethods } from "@/lib/db/contact";

export default async function Contact({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as "fa" | "en";

  const [meta, methods] = await Promise.all([
    getContactPageMeta(locale),
    getContactMethods(locale),
  ]);

  const contactMethods = methods.map((method) => ({
    type: method.type,
    label: method.label,
    value: method.value,
    link: method.link,
    color: `${method.colorFrom} ${method.colorTo}`,
  }));

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <section className="bg-linear-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <ContactHeader title={meta.title} description={meta.description} />
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method) => (
              <ContactMethod key={method.type} method={method} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <ContactForm locale={locale} />
            <ContactInfo locale={locale} />
          </div>
        </div>
      </section>
    </div>
  );
}
