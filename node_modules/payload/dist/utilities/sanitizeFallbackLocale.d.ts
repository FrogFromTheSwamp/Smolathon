import type { SanitizedLocalizationConfig } from '../config/types.js';
import type { TypedLocale } from '../index.js';
interface Args {
    fallbackLocale: false | TypedLocale;
    locale: string;
    localization: SanitizedLocalizationConfig;
}
/**
 * Sanitizes fallbackLocale based on a provided fallbackLocale, locale and localization config
 *
 * Handles the following scenarios:
 * - determines if a fallback locale should be used
 * - determines if a locale specific fallback should be used in place of the default locale
 * - sets the fallbackLocale to 'null' if no fallback locale should be used
 */
export declare const sanitizeFallbackLocale: ({ fallbackLocale, locale, localization, }: Args) => null | string;
export {};
//# sourceMappingURL=sanitizeFallbackLocale.d.ts.map