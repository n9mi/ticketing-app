export function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    const padL = (nr: number, len: number = 2, chr: string = '0') =>
        `${nr}`.padStart(2, chr);

    return `${ padL(d.getMonth() + 1)}/${ padL(d.getDate()) }/${ d.getFullYear() } ${ padL(d.getHours()) }:${ padL(d.getMinutes()) }:${ padL(d.getSeconds()) }`;
}

export function toPHPDateString(date: Date) {
    const isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();

    return isoDateTime.split('T')[0];
}
