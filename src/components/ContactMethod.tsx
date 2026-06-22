"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, Send, type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  EMAIL: Mail,
  PHONE: Phone,
  WHATSAPP: MessageCircle,
  TELEGRAM: Send,
};

interface ContactMethodProps {
  method: {
    type: string;
    label: string;
    value: string;
    link: string;
    color: string;
  };
}

const ContactMethod = ({ method }: ContactMethodProps) => {
  const Icon = iconMap[method.type] ?? Mail;

  return (
    <motion.a
      href={method.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-800 hover:border-transparent"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div
        className={`h-12 w-12 rounded-xl bg-linear-to-br ${method.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        {method.label}
      </h3>
      <p className="text-slate-600 dark:text-slate-400">{method.value}</p>
    </motion.a>
  );
};

export default ContactMethod;
