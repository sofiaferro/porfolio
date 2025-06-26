import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'es'] as const;
export const defaultLocale = 'es' as const;

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  const validLocale = locales.includes(locale as any) ? locale : defaultLocale;
  
  try {
    const messages = (await import(`../messages/${validLocale}.json`)).default;
    
    return {
      locale: validLocale as string,
      messages,
    };
  } catch (error) {
    console.error('i18n config - error loading messages for locale:', validLocale, error);
    throw error;
  }
}); 