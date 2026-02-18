import localizedFormat from 'dayjs/plugin/localizedFormat'
import * as Localization from 'expo-localization';
import weekOfYear from 'dayjs/plugin/weekOfYear'
import dayjs from 'dayjs';




// https://unicode.org/Public/cldr/37/core.zip
const firstDayOfWeek = {
    // sunday
    0: [
        'AG', 'AS', 'AU', 'BD', 'BR', 'BS', 'BT', 'BW', 'BZ', 'CA', 'CN', 'CO', 'DM', 'DO', 'ET',
        'GT', 'GU', 'HK', 'HN', 'ID', 'IL', 'IN', 'JM', 'JP', 'KE', 'KH', 'KR', 'LA', 'MH', 'MM',
        'MO', 'MT', 'MX', 'MZ', 'NI', 'NP', 'PA', 'PE', 'PH', 'PK', 'PR', 'PT', 'PY', 'SA', 'SG',
        'SV', 'TH', 'TT', 'TW', 'UM', 'US', 'VE', 'VI', 'WS', 'YE', 'ZA', 'ZW'
    ],
    // monday
    1: [
        '001', 'AD', 'AI', 'AL', 'AM', 'AN', 'AR', 'AT', 'AX', 'AZ', 'BA', 'BE', 'BG', 'BM', 'BN',
        'BY', 'CH', 'CL', 'CM', 'CR', 'CY', 'CZ', 'DE', 'DK', 'EC', 'EE', 'ES', 'FI', 'FJ', 'FO',
        'FR', 'GB', 'GE', 'GF', 'GP', 'GR', 'HR', 'HU', 'IE', 'IS', 'IT', 'KG', 'KZ', 'LB', 'LI',
        'LK', 'LT', 'LU', 'LV', 'MC', 'MD', 'ME', 'MK', 'MN', 'MQ', 'MY', 'NL', 'NO', 'NZ', 'PL',
        'RE', 'RO', 'RS', 'RU', 'SE', 'SI', 'SK', 'SM', 'TJ', 'TM', 'TR', 'UA', 'UY', 'UZ', 'VA',
        'VN', 'XK'
    ],
    // saturday
    6: [
        'AE', 'AF', 'BH', 'DJ', 'DZ', 'EG', 'IQ', 'IR', 'JO', 'KW', 'LY', 'OM', 'QA', 'SD', 'SY',
    ],
}


const translations: Record<string, Record<string, string>> = {
    en: require('../../assets/locales/en.json'),
    fr: require('../../assets/locales/fr.json'),
};


const dayjs_locales = {
    en: require('dayjs/locale/en'),
    fr: require('dayjs/locale/fr'),
}


function getLocale() {
    let locale = Localization.locale || 'en';
    if (locale.includes('-')) locale = locale.split('-')[0];
    if (!translations[locale]) locale = 'en';
    return locale;
};


const _getFirstDayOfWeek = (region: string): number => {
    for (const dayStr in firstDayOfWeek) {
        let dayNumber = parseInt(dayStr)
        if (firstDayOfWeek[dayNumber].includes(region)) {
            return dayNumber;
        }
    }

    return 1;
}


export const initializeDayjs = () => {
    let locale = Localization.locale;
    if (locale.includes('-')) locale = locale.split('-')[0];

    if (locale in dayjs_locales) {
        dayjs.locale(locale)
        if (dayjs.Ls[locale] && Localization.region !== null) {
            dayjs.Ls[locale].weekStart = _getFirstDayOfWeek(Localization.region);
        }
    } 
    else {
        dayjs.locale('en')
    }

    dayjs.extend(weekOfYear)
    dayjs.extend(localizedFormat)
}


export function t(key: string, options?: Record<string, any>): string {
    const locale = getLocale();
    const dict = translations[locale] || {};
    let value = dict[key] || `[${key}]`; // Default value to better see when a key is missing
    if (options) {
        Object.keys(options).forEach(k => {
            value = value.replace(`{{${k}}}`, options[k]);
        });
    }
    return value;
}




export const locale = getLocale();
export const language = locale;