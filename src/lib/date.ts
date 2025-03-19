import dayjs from 'dayjs';

export class DateClass {

    public static FORMAT_INPUT_SHORT = 'YYYY-MM-DD';
    public static FORMAT_INPUT = 'YYYY-MM-DDTHH:mm';
    // DD/MM/YYYY HH:mm
    public static FORMAT_OUTPUT = 'DD/MM/YYYY HH:mm';
    constructor() {}

    public static DateToISOString(inputDate: string): string {
        const date = dayjs(inputDate)
        return date.toISOString();
    }

    public static DateToFormat(inputDate: string, format: string): string {
        const date = dayjs(inputDate)
        return date.format(format);
    }
}
