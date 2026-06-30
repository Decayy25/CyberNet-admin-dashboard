
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

const validateEmailVeryStrict = (email: string): boolean => {
  const regex = /^(?!@)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

const validateEmailDetailed = (email: string): ValidationResult => {
  const errors: string[] = [];

  if (!email || email.trim() === "") {
    errors.push("Email tidak boleh kosong");
    return { isValid: false, errors };
  }

  if (/\s/.test(email)) {
    errors.push("Email tidak boleh mengandung spasi");
  }

  if (!email.includes("@")) {
    errors.push("Email harus mengandung @ symbol");
  }

  if ((email.match(/@/g) || []).length !== 1) {
    errors.push("Email hanya boleh memiliki 1 @ symbol");
  }

  const [username, domain] = email.split("@");

  if (!username || username.length === 0) {
    errors.push("Username (sebelum @) tidak boleh kosong");
  }

  if (!domain || domain.length === 0) {
    errors.push("Domain (setelah @) tidak boleh kosong");
  }

  if (domain && !domain.includes(".")) {
    errors.push("Domain harus mengandung titik (.)");
  }

  if (domain) {
    const parts = domain.split(".");
    const tld = parts[parts.length - 1];
    if (tld && tld.length < 2) {
      errors.push("TLD (Top Level Domain) minimal 2 karakter");
    }
  }

  const validPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!validPattern.test(email)) {
    errors.push("Email mengandung karakter yang tidak valid");
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
}


export interface PhoneValidationResult {
  isValid: boolean;
  formatted: string;
  operator: string;
  errors: string[];
}

// Daftar operator dan prefix Indonesia
const INDONESIAN_OPERATORS: Record<string, string[]> = {
  "Telkomsel": ["811", "812", "813", "821", "822", "823"],
  "Indosat": ["814", "815", "816", "855", "856", "857", "858"],
  "XL Axiata": ["817", "818", "819", "859", "877", "878"],
  "Tri": ["896", "897", "898", "899"],
  "Smartfren": ["881", "882", "883", "884", "885", "886", "887", "888", "889"],
  "Ericsson": ["801"],
  "Flexi": ["820"],
  "Axis": ["831", "832", "833", "834", "835", "836", "837", "838", "839"],
};

/**
 * Validasi Nomor Telepon Indonesia
 * Format yang diterima:
 * - 0812345678xx (11-13 digit)
 * - +62812345678xx (+62 12-13 digit)
 * - 62812345678xx (62 11-12 digit)
 * @param phone Nomor telepon
 * @returns PhoneValidationResult
 */
const validateIndonesianPhone = (phone: string): PhoneValidationResult => {
  const errors: string[] = [];
  let normalizedPhone = phone.trim();
  let formatted = "";
  let operator = "Tidak diketahui";

  if (!normalizedPhone || normalizedPhone.length === 0) {
    errors.push("Nomor telepon tidak boleh kosong");
    return {
      isValid: false,
      formatted: "",
      operator: "",
      errors,
    };
  }

  normalizedPhone = normalizedPhone.replace(/[-\s()]/g, "");

  if (!/^\d+$/.test(normalizedPhone) && !/^\+\d+$/.test(normalizedPhone)) {
    errors.push("Nomor telepon hanya boleh berisi angka");
  }

  let normalizedForCheck = normalizedPhone;

  if (normalizedPhone.startsWith("+62")) {
    normalizedForCheck = "0" + normalizedPhone.slice(3);
    if (normalizedPhone.length !== 14) {
      errors.push("Nomor dengan format +62 harus 14 digit (+62 + 11 digit)");
    }
  } else if (normalizedPhone.startsWith("62")) {
    normalizedForCheck = "0" + normalizedPhone.slice(2);
    if (normalizedPhone.length !== 12) {
      errors.push("Nomor dengan format 62 harus 12 digit (62 + 10 digit)");
    }
  } else if (normalizedPhone.startsWith("0")) {
    normalizedForCheck = normalizedPhone;
    if (normalizedPhone.length < 10 || normalizedPhone.length > 13) {
      errors.push("Nomor dengan format 0 harus 10-13 digit");
    }
  } else {
    errors.push("Nomor harus dimulai dengan 0, 62, atau +62");
  }

  if (normalizedForCheck.length < 10 || normalizedForCheck.length > 13) {
    errors.push("Panjang nomor telepon tidak valid (10-13 digit)");
  }

  const prefix = normalizedForCheck.substring(1, 4);

  let foundOperator = false;
  for (const [op, prefixes] of Object.entries(INDONESIAN_OPERATORS)) {
    if (prefixes.includes(prefix)) {
      operator = op;
      foundOperator = true;
      break;
    }
  }

  if (!foundOperator) {
    errors.push(`Prefix ${prefix} bukan operator Indonesia yang valid`);
  }

  formatted = normalizedForCheck;

  return {
    isValid: errors.length === 0,
    formatted: formatted,
    operator: operator,
    errors,
  };
}

const validateIndonesianPhoneSimple = (phone: string): boolean => {
  const regex = /^((\+62|62|0)[0-9]{9,12})$/;
  return regex.test(phone.replace(/[-\s()]/g, ""));
}

/**
 * Format nomor telepon Indonesia ke format standar
 * @param phone Nomor telepon
 * @returns Nomor yang sudah diformat atau kosong jika invalid
 */
const formatIndonesianPhone = (phone: string): string => {
  const result = validateIndonesianPhone(phone);
  if (!result.isValid) return "";

  const normalized = result.formatted;

  const match = normalized.match(/^(\d{4})(\d{4})(\d{2,5})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }

  return normalized;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
}

interface ContactFormValidationResult {
  isValid: boolean;
  errors: {
    name?: string[];
    email?: string[];
    phone?: string[];
  };
  data?: {
    name: string;
    email: string;
    phone: string;
    formattedPhone: string;
    operator: string;
  };
}

const validateContactForm = (form: ContactFormData): ContactFormValidationResult => {
  const errors: {
    name?: string[];
    email?: string[];
    phone?: string[];
  } = {};

  if (!form.name || form.name.trim() === "") {
    errors.name = ["Nama tidak boleh kosong"];
  } else if (form.name.trim().length < 3) {
    errors.name = ["Nama minimal 3 karakter"];
  }

  const emailResult = validateEmailDetailed(form.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.errors;
  }

  const phoneResult = validateIndonesianPhone(form.phone);
  if (!phoneResult.isValid) {
    errors.phone = phoneResult.errors;
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
    ...(isValid && {
      data: {
        name: form.name.trim(),
        email: form.email,
        phone: phoneResult.formatted,
        formattedPhone: formatIndonesianPhone(form.phone),
        operator: phoneResult.operator,
      },
    }),
  };
}

export {
  validateEmailVeryStrict,
  validateEmailDetailed,
  validateIndonesianPhone,
  validateIndonesianPhoneSimple,
  formatIndonesianPhone,
  validateContactForm,
};