export const numberToKorean = (num: number): string => {
  if (num === 0) return '0원';

  const units = ['', '만', '억', '조'];
  let result = '';
  let unitIndex = 0;

  while (num > 0) {
    const part = num % 10000;
    if (part > 0) {
      let partStr = '';

      // 천의 자리
      const thousand = Math.floor(part / 1000);
      if (thousand > 0) {
        if (thousand > 1) partStr += thousand;
        partStr += '천';
      }

      // 백의 자리
      const hundred = Math.floor((part % 1000) / 100);
      if (hundred > 0) {
        if (hundred > 1) partStr += hundred;
        partStr += '백';
      }

      // 십의 자리와 일의 자리를 합쳐서 처리
      const remainder = part % 100;
      if (remainder > 0) {
        if (remainder >= 10 && remainder % 10 === 0) {
          // 10, 20, 30... 처럼 딱 떨어지는 경우
          partStr += Math.floor(remainder / 10) + '십';
        } else if (remainder >= 10) {
          // 11, 23, 45... 처럼 십의 자리와 일의 자리가 모두 있는 경우
          partStr += remainder;
        } else {
          // 1, 2, 3... 처럼 일의 자리만 있는 경우
          partStr += remainder;
        }
      }

      result = partStr + units[unitIndex] + result;
    }
    num = Math.floor(num / 10000);
    unitIndex++;
  }

  return result + '원';
};
