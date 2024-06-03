
/** post API接收資料型別 */
export interface PostDataType {
  _id: string;
  author: string[];
  title: string;
  content: string;
  image: string;
  status: number;
  subject: string;
  hashTags: string[];
  collectionCount: number;
  shareCount: number;
  likedByUsers: string[];
  comments: string[];
  createdAt: string;
  editedAt: string;
}

/** post API參數型別 */
export interface PostVariablesType {
  postId: string;
  author: string;
  title: string;
  content: string;
  image: string;
  status: number;
  subject: string;
  hashTags: string[];
}

