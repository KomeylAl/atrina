"use client";

import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface ContactInfoProps {
  locale?: string;
}

const ContactInfo = ({ locale = "en" }: ContactInfoProps) => {
  const isFa = locale === "fa";

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
        <div className="flex items-start space-x-3 mb-4">
          <MapPin className="h-6 w-6 text-indigo-600 dark:text-indigo-400 shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              {isFa ? "آدرس دفتر" : "Office Location"}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line">
              {isFa
                ? "خیابان فناوری ۱۲۳\nتهران، ایران"
                : "123 Tech Street\nSan Francisco, CA 94107\nUnited States"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-linear-to-br from-indigo-600 to-cyan-600 dark:from-indigo-700 dark:to-cyan-700 rounded-2xl p-6 text-white">
        <h3 className="font-semibold text-xl mb-3">
          {isFa ? "ساعات کاری" : "Business Hours"}
        </h3>
        <div className="space-y-2 text-indigo-100">
          <p>
            {isFa ? "شنبه تا پنج‌شنبه: ۹ تا ۱۸" : "Monday - Friday: 9am - 6pm"}
          </p>
          <p>{isFa ? "جمعه: تعطیل" : "Saturday: 10am - 4pm"}</p>
          <p>{isFa ? "یکشنبه: تعطیل" : "Sunday: Closed"}</p>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
          {isFa ? "زمان پاسخ‌گویی" : "Response Time"}
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          {isFa
            ? "معمولاً ظرف ۲۴ ساعت در روزهای کاری پاسخ می‌دهیم."
            : "We typically respond to all inquiries within 24 hours during business days."}
        </p>
      </div>
    </motion.div>
  );
};

export default ContactInfo;
