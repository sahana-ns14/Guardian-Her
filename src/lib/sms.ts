export const generateSMSLink = (phones: string[], message: string) => {
    const p = phones.join(',');
    const m = encodeURIComponent(message);

    // Basic cross-platform check
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
        // iOS sometimes prefers ; or &? Standard says ?body=
        // Usually sms:num&body=msg works on iOS
        return `sms:${p}&body=${m}`;
    }

    // Android / Standard
    return `sms:${p}?body=${m}`;
};
