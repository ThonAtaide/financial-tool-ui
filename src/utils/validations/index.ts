const EMAIL_REGEX = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
export const validateEmailWithRegex = (email: string | null) => 
    email && email.length > 5 
&& EMAIL_REGEX.test(email)