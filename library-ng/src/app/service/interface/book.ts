import { BorrowBook } from './borrow';

export interface Book {
  id: number;
  bookCode: string;
  bookNameTh: string;
  bookNameEn: string;
  bookStatus: number;
  isDelete: number;
}

export interface BookTable {
  totalPages: number;
  totalElements: number;
  content: Book[];
}

export interface BookManage {
  id: number;
  bookNameTh: string;
  bookNameEn: string;
  bookImage: string;
  bookBarCode: string;
  bookCode: string;
  categoryCode: string;
  categoryName: string;
  bookStatus: number;
  isDelete: number;
}

export interface BookDetail extends BookManage {
  totalBorrow: number;
  borrowings: BorrowBook[];
}

export interface AddCommentInterface {
  bookCode: string;
  profileCode: string;
  commentText: string;
}

export interface CommentsInterface {
  id: number;
  bookCode: string;
  profileCode: string;
  firstName: string;
  lastName: string;
  commentText: string;
  image: string;
  createAt: string;
}

export interface getCommentsInterface {
  totalPages: number;
  totalElements: number;
  content: CommentsInterface[];
}


export interface BookBorrowCounts {
  bookCode: string;
  borrowCount: number;
  viewCount: number;
}

export interface TopViewedBook {
  bookCode: string;
  bookNameTh: string;
  bookNameEn: string;
  totalView: number;
}