export const toTitleCase = (input: string): string => {
    if (!input) return input; // Handle empty or null strings
    return input
        .split(' ') // Split the string into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter and lowercase the rest
        .join(' '); // Join the words back into a single string
}

export const convertToTitleCase = (str: string): string => {
    if (!str) return "";

    return str
        .split(/[-_]/) // Split at both underscores (_) and dashes (-)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
        .join(' '); // Join the words with spaces
};