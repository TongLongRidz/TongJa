import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormatDateService {
  constructor() {}

  // prettier-ignore
  forDate(date: string, style: 'MIN' | 'MAX', time: 'NO-TIME' | 'TIME', lang: string): string {
    const dateObj = new Date(date);
  
    const monthsThai = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
    ];
    const monthsEnglish = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
  
    const day = dateObj.getDate();
    const month = dateObj.getMonth();
    const year = dateObj.getFullYear();
    const thaiYear = year + 543; // Thai year
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  
    if (style === 'MAX') {
      if (lang === 'en') {
        return time === 'TIME'
          ? `${monthsEnglish[month]} ${day}, ${year} at ${hours}:${minutes}`
          : `${monthsEnglish[month]} ${day}, ${year}`;
      } else {
        return time === 'TIME'
          ? `วันที่ ${day} ${monthsThai[month]} ${thaiYear} เวลา ${hours}:${minutes} น.`
          : `วันที่ ${day} ${monthsThai[month]} ${thaiYear}`;
      }
    } else if (style === 'MIN') {
      if (lang === 'en') {
        return time === 'TIME'
          ? `${day}/${month + 1}/${year} at ${hours}:${minutes}`
          : `${day}/${month + 1}/${year}`;
      } else {
        return time === 'TIME'
          ? `${day}/${month + 1}/${thaiYear} เวลา ${hours}:${minutes} น.`
          : `${day}/${month + 1}/${thaiYear}`;
      }
    }
  
    return '';
  }

  lastStatus(date: string, lang: string): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSeconds < 60) {
      return lang === 'en'
        ? `${diffSeconds} seconds ago`
        : `${diffSeconds} วินาทีที่แล้ว`;
    } else if (diffMinutes < 60) {
      return lang === 'en'
        ? `${diffMinutes} minutes ago`
        : `${diffMinutes} นาทีที่แล้ว`;
    } else if (diffHours < 24) {
      return lang === 'en'
        ? `${diffHours} hours ago`
        : `${diffHours} ชั่วโมงที่แล้ว`;
    } else if (diffDays <= 30) {
      return lang === 'en' ? `${diffDays} days ago` : `${diffDays} วันที่แล้ว`;
    } else if (diffMonths < 12) {
      return lang === 'en'
        ? `${diffMonths} months ago`
        : `${diffMonths} เดือนที่แล้ว`;
    } else {
      return lang === 'en'
        ? `${diffYears} years ago`
        : `${diffYears} ปีที่แล้ว`;
    }
  }
}
