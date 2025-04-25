export const maskPhoneNumber=(phoneNumber: string)=> {
    // Check if the provided phoneNumber is valid
    if (!/^\d{10}$/.test(phoneNumber)) {
        // Not a valid 10-digit phone number
        return 'Invalid phone number';
    }

    // Mask the phone number, keeping the first three and last two digits visible
    const visiblePart = phoneNumber.substring(0, 3);
    const maskedPart = phoneNumber.substring(3, 8).replace(/\d/g, '*');
    const lastDigits = phoneNumber.substring(8);

    // Combine the visible and masked parts
    const maskedPhoneNumber = `${visiblePart}${maskedPart}${lastDigits}`;

    return maskedPhoneNumber;
}
