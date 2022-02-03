import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

// Returns an object not a list
export const countryObject = countries.getNames("en", { select: "official" });

export const countryArray = Object.entries(countryObject).map(([value, label]) => {
    return {
        label: label,
        value: value
    };
});