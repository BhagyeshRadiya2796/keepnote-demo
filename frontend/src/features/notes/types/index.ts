export interface INote {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface ICreateNoteDto {
  title: string;
  content: string;
}

export interface IUpdateNoteDto {
  title?: string;
  content?: string;
}
