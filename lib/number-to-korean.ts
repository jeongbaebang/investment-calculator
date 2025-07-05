export function numberToKorean(num: number): string {
  if (!num || num === 0) return '';

  const units: string[] = ['', '만', '억', '조'];
  const digits: string[] = [
    '',
    '일',
    '이',
    '삼',
    '사',
    '오',
    '육',
    '칠',
    '팔',
    '구',
  ];
  const tens: string[] = ['', '십', '백', '천'];

  let result = '';
  let unitIndex = 0;

  while (num > 0) {
    const chunk = num % 10000;
    if (chunk > 0) {
      let chunkStr = '';
      let tempChunk = chunk;
      let tensIndex = 0;

      while (tempChunk > 0) {
        const digit = tempChunk % 10;
        if (digit > 0) {
          if (tensIndex === 1 && digit === 1) {
            chunkStr = tens[tensIndex] + chunkStr;
          } else {
            chunkStr = digits[digit] + tens[tensIndex] + chunkStr;
          }
        }
        tempChunk = Math.floor(tempChunk / 10);
        tensIndex++;
      }

      result = chunkStr + units[unitIndex] + result;
    }
    num = Math.floor(num / 10000);
    unitIndex++;
  }

  return result + '원';
}
