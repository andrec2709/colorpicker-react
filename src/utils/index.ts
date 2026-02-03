export function clamp(min: number, max: number, value: number) {
    return Math.max(min, Math.min(max, value));
}

export const parseBoolean = (value: string | null, defaultValue: boolean = false) => {
    if (value === null) return defaultValue;
    return value === 'true';
}