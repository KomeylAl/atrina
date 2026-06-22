"use client";

import { Send } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useState } from "react";

interface ContactFormProps {
  locale?: string;
}

const ContactForm = ({ locale = "en" }: ContactFormProps) => {
  const isFa = locale === "fa";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error(
        isFa
          ? "لطفاً فیلدهای الزامی را پر کنید"
          : "Please fill in all required fields",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      toast.success(
        isFa
          ? "پیام با موفقیت ارسال شد! به‌زودی پاسخ می‌دهیم."
          : "Message sent successfully! We'll get back to you soon.",
      );
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error(
        isFa
          ? "ارسال پیام ناموفق بود. دوباره تلاش کنید."
          : "Failed to send message. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="lg:col-span-2"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
          {isFa ? "پیام خود را بفرستید" : "Send us a Message"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {isFa ? "نام شما *" : "Your Name *"}
              </label>
              <Input
                type="text"
                placeholder={isFa ? "نام و نام خانوادگی" : "John Doe"}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {isFa ? "ایمیل *" : "Email Address *"}
              </label>
              <Input
                type="email"
                placeholder={isFa ? "email@example.com" : "john@example.com"}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {isFa ? "موضوع" : "Subject"}
            </label>
            <Input
              type="text"
              placeholder={
                isFa ? "چطور می‌توانیم کمک کنیم؟" : "How can we help you?"
              }
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {isFa ? "پیام شما *" : "Your Message *"}
            </label>
            <Textarea
              placeholder={
                isFa ? "درباره پروژه خود بگویید..." : "Tell us about your project..."
              }
              rows={6}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              required
              className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full bg-linear-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white"
          >
            {isSubmitting
              ? isFa
                ? "در حال ارسال..."
                : "Sending..."
              : isFa
                ? "ارسال پیام"
                : "Send Message"}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default ContactForm;
