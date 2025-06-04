export interface BookEntity {
    id: number;
    bookCode: string;
    bookBarCode: string;
    bookNameTh: string;
    bookNameEn: string;
    bookImage: string;
    categoryName: string;
    bookStatus: number;
    isDelete: number;
  }
  
  export interface FavoriteResponse {
    content: BookEntity[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }
  