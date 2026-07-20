export type UserRole = "principal" | "admin" | "teacher" | "student" | "parent" | null;
export type ModalModeTypes = 'create' | 'edit' | 'none';

interface NameInput {
    firstName: string;
    middleName?: string | null | undefined;
    firstLastName: string;
    secondLastName?: string | null | undefined;
}

export function formateDate(date: string) {
    return  new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

export const getStatusDotColor = (status: string) => {
    switch(status) {
        case 'absent': return 'bg-red-500 border-red-500';
        case 'late': return 'bg-yellow-400 border-yellow-400';
        case 'present': return 'bg-green-500 border-green-500';
        default: return 'bg-gray-300 border-gray-300';
    }
};

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
        dayNum: date.getUTCDate(),
        month: date.toLocaleString('es-ES', { month: 'short', timeZone: 'UTC' }).toUpperCase(),
        weekday: date.toLocaleString('es-ES', { weekday: 'short', timeZone: 'UTC' }).toUpperCase()
    };
}

export const getInitials = (name: string) => {
    const names = name.split(" ");
    if (names.length >= 2) return (names[0][0] + (names[1][0] ? names[1][0] : names[0][names[0].length - 1])).toUpperCase();
    return name[0].toUpperCase();
};

export function reverseName(nameObj: NameInput): string {
    const lastNames = [nameObj.firstLastName, nameObj.secondLastName]
        .filter(Boolean)
        .join(" ");

    const firstNames = [nameObj.firstName, nameObj.middleName]
        .filter(Boolean)
        .join(" ");

    return [lastNames, firstNames].filter(Boolean).join(" ");
}

export const formatterDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
});