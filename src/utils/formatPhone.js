import { parsePhoneNumberFromString } from "libphonenumber-js";

export const formatPhone = (raw) => {
  const phoneNumber = parsePhoneNumberFromString(raw, "US"); // fallback region
  return phoneNumber ? phoneNumber.formatInternational() : raw;
};
