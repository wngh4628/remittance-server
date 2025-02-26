export class DateTimeBaseVo {
  protected formatToKST(date: Date | string): string {
    const kstDate = new Date(date);

    const transDateTime = new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul', // KST 변환
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
      .format(kstDate)
      .replace(/\./g, '-') // 슬래시를 대시로 변경
      .replace(',', '') // 불필요한 쉼표 제거
      .replace(/\s+/g, '')
      .split('-'); // 공백 및 날짜 시간 구분
      console.log('date: ', date)
    console.log('transDateTime: ', `${transDateTime[0]}-${transDateTime[1]}-${transDateTime[2]} ${transDateTime[3]}`);
    
    return `${transDateTime[0]}-${transDateTime[1]}-${transDateTime[2]} ${transDateTime[3]}`;
  }
}
