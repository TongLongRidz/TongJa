export interface BorrowBook {
  id: number;
  borrowStart: string;
  borrowEnd: string;
  borrowDays: Date;
  bookCode: string;
  borrowCode: string;
  borrowStatus: number;
  isDelete: number;
  returnDate: Date;
  profileCode: string;
  profileImage: string;

  firstName: string;
  lastName: string;

  bookNameTh: string;
  bookNameEn: string;


  active: String;
}

export interface BorrowBook2 {
  id: number;
  borrowStart: string;
  borrowEnd: string;
  borrowDays: Date;
  bookCode: string;
  borrowCode: string;
  borrowStatus: number;
  isDelete: number;
  returnDate: Date;
  profileCode: string;
  profileImage: string;

  firstName: string;
  lastName: string;

  bookNameTh: string;
  bookNameEn: string;
  borrowImage: string;


  active: String;
}


export interface BorrowBookTable {
  totalPages: number;
  totalElements: number;
  content: BorrowBook[];
}
