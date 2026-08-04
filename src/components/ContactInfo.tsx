"use client";

import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import type { ContactPageInfoItem } from "@/types/database";

interface ContactInfoProps {
  info: ContactPageInfoItem;
}

const ContactInfo = ({ info }: ContactInfoProps) => {
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
              {info.officeTitle}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line">
              {info.officeAddress}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-linear-to-br from-indigo-600 to-cyan-600 dark:from-indigo-700 dark:to-cyan-700 rounded-2xl p-6 text-white">
        <h3 className="font-semibold text-xl mb-3">
          {info.businessHoursTitle}
        </h3>
        <p className="text-indigo-100 whitespace-pre-line">{info.businessHours}</p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
          {info.responseTimeTitle}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line">
          {info.responseTime}
        </p>
      </div>
    </motion.div>
  );
};

export default ContactInfo;
