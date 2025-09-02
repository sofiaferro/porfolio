"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

export default function ProfileColumn() {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <div className="p-4 md:p-8 flex flex-col justify-start">
      {/* Large Stylized Name/Title */}
      <div className="mb-4 md:mb-8">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-gray-100">
          SVF
        </h1>
      </div>

      {/* Profile Description/Bio */}
      <div className="mb-4 md:mb-8">
        <h2 className="text-sm font-mono tracking-wider text-gray-600 dark:text-gray-300 mb-2 md:mb-4 uppercase">
          {t("aboutMe")}
        </h2>
        <div className="prose prose-sm text-gray-800 dark:text-gray-200 leading-relaxed space-y-2 md:space-y-3">
          <p className="text-xs md:text-sm">{t("description1")}</p>
          <p className="text-xs md:text-sm">{t("description2")}</p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mb-4 md:mb-8">
        <h3 className="text-sm font-mono tracking-wider text-gray-600 dark:text-gray-300 mb-2 md:mb-4 uppercase">
          {t("contact")}
        </h3>
        <div className="text-gray-800 dark:text-gray-200">Sofía Ferro</div>
        <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
          <div>
            <Link
              href="mailto:svf.inbox@gmail.com"
              className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              svf.inbox@gmail.com
            </Link>
          </div>
          {/*           <div>
            <Link
              href="https://github.com/sofiaferro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 hover:text-gray-600 transition-colors"
            >
              GitHub
            </Link>
          </div> */}
          <div>
            <Link
              href="https://www.linkedin.com/in/sofiaferro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
