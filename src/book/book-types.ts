import TUser from "../user/user-types";

export interface TBook {
  _id: string;
  title: string;
  author: TUser;
  genre: string;
  coverImage: string;
  file: string;
  createdAt: Date;
  updatedAt: Date;
}
