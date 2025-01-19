export function numberToOrdinal(num) {
  const specialCases = {
    1: "الأول",
    2: "الثاني",
    3: "الثالث",
    4: "الرابع",
    5: "الخامس",
    6: "السادس",
    7: "السابع",
    8: "الثامن",
    9: "التاسع",
    10: "العاشر",
    11: "الحادي عشر",
    12: "الثاني عشر",
    13: "الثالث عشر",
    14: "الرابع عشر",
    15: "الخامس عشر",
    16: "السادس عشر",
    17: "السابع عشر",
    18: "الثامن عشر",
    19: "التاسع عشر",
  };

  const tensCases = {
    20: "العشرون",
    30: "الثلاثون",
    40: "الأربعون",
    50: "الخمسون",
    60: "الستون",
    70: "السبعون",
    80: "الثمانون",
    90: "التسعون",
  };

  // Handle special cases
  if (specialCases[num]) {
    return specialCases[num];
  }

  // Handle tens cases
  if (tensCases[num]) {
    return tensCases[num];
  }

  // Calculate the last digit and the tens
  const lastDigit = num % 10;
  const tens = num - lastDigit;

  // Arabic suffixes for last digits
  const suffixes = {
    1: "الأول",
    2: "الثاني",
    3: "الثالث",
    4: "الرابع",
    5: "الخامس",
    6: "السادس",
    7: "السابع",
    8: "الثامن",
    9: "التاسع",
  };

  // If it is a multiple of ten, we need to check the tens case
  if (suffixes[lastDigit]) {
    return tensCases[tens]
      ? tensCases[tens] + " و " + suffixes[lastDigit] // Combine tens and last digit
      : suffixes[lastDigit]; // Just return the suffix if no tens case
  }

  return num + "م"; // Default case for any other number, using "م" for general ordinal
}
