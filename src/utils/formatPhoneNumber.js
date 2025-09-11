export function formatPhoneNumber(phone) {
  if (!phone) return "";

  const cleaned = phone.toString().replace(/\D/g, "");

  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  }

  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return cleaned.replace(/1(\d{3})(\d{3})(\d{4})/, "+1 ($1) $2-$3");
  }

  if (cleaned.length > 11) {
    return `+${cleaned.slice(0, cleaned.length - 10)} ${cleaned.slice(
      -10,
      -7
    )}-${cleaned.slice(-7, -4)}-${cleaned.slice(-4)}`;
  }

  return phone;
}
