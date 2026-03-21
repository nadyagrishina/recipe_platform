export type UnitSystem = 'METRIC' | 'IMPERIAL';

export const METRIC_UNITS = [
    'GRAM',
    'KILOGRAM',
    'MILLILITER',
    'LITER',
    'TABLESPOON',
    'TEASPOON',
    'PINCH',
    'PIECE',
    'TO_TASTE'
] as const;

export const IMPERIAL_UNITS = [
    'OZ',
    'LB',
    'FL_OZ',
    'CUP',
    'TABLESPOON',
    'TEASPOON',
    'PINCH',
    'PIECE',
    'TO_TASTE'
] as const;

export const getAllowedUnits = (unitSystem: UnitSystem): string[] => {
    return unitSystem === 'IMPERIAL'
        ? [...IMPERIAL_UNITS]
        : [...METRIC_UNITS];
};

interface UnitConversion {
    toImperial: (val: number) => { value: number; unit: string };
    toMetric: (val: number) => { value: number; unit: string };
}

const conversionTable: Record<string, UnitConversion> = {
    GRAM: {
        toImperial: (v) => ({ value: v * 0.035274, unit: 'OZ' }),
        toMetric: (v) => ({ value: v, unit: 'GRAM' })
    },
    KILOGRAM: {
        toImperial: (v) => ({ value: v * 2.20462, unit: 'LB' }),
        toMetric: (v) => ({ value: v, unit: 'KILOGRAM' })
    },
    OZ: {
        toImperial: (v) => ({ value: v, unit: 'OZ' }),
        toMetric: (v) => ({ value: v * 28.3495, unit: 'GRAM' })
    },
    LB: {
        toImperial: (v) => ({ value: v, unit: 'LB' }),
        toMetric: (v) => ({ value: v * 0.453592, unit: 'KILOGRAM' })
    },

    MILLILITER: {
        toImperial: (v) => ({ value: v * 0.033814, unit: 'FL_OZ' }),
        toMetric: (v) => ({ value: v, unit: 'MILLILITER' })
    },
    LITER: {
        toImperial: (v) => ({ value: v * 4.22675, unit: 'CUP' }),
        toMetric: (v) => ({ value: v, unit: 'LITER' })
    },
    FL_OZ: {
        toImperial: (v) => ({ value: v, unit: 'FL_OZ' }),
        toMetric: (v) => ({ value: v * 29.5735, unit: 'MILLILITER' })
    },
    CUP: {
        toImperial: (v) => ({ value: v, unit: 'CUP' }),
        toMetric: (v) => ({ value: v * 236.588, unit: 'MILLILITER' })
    },

    TABLESPOON: {
        toImperial: (v) => ({ value: v, unit: 'TABLESPOON' }),
        toMetric: (v) => ({ value: v, unit: 'TABLESPOON' })
    },
    TEASPOON: {
        toImperial: (v) => ({ value: v, unit: 'TEASPOON' }),
        toMetric: (v) => ({ value: v, unit: 'TEASPOON' })
    },
    PINCH: {
        toImperial: (v) => ({ value: v, unit: 'PINCH' }),
        toMetric: (v) => ({ value: v, unit: 'PINCH' })
    },
    PIECE: {
        toImperial: (v) => ({ value: v, unit: 'PIECE' }),
        toMetric: (v) => ({ value: v, unit: 'PIECE' })
    },
    TO_TASTE: {
        toImperial: () => ({ value: 0, unit: 'TO_TASTE' }),
        toMetric: () => ({ value: 0, unit: 'TO_TASTE' })
    }
};

export const convertIngredient = (
    amount: number,
    unit: string,
    targetSystem: UnitSystem,
    translations: any
) => {
    const conversion = conversionTable[unit];

    if (!conversion) {
        return {
            amount: amount > 0 ? amount : "",
            unit: translations[unit] || unit
        };
    }

    const result = targetSystem === 'IMPERIAL'
        ? conversion.toImperial(amount)
        : conversion.toMetric(amount);

    const translatedUnit = translations[result.unit] || result.unit;

    return {
        amount: result.unit === 'TO_TASTE' ? "" : Number(result.value.toFixed(1)),
        unit: translatedUnit
    };
};