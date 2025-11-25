export type Post = {
  _id: string;
  title: string;
  description?: string;
  img_url?: string;
  username: string;
  likes: number;
  liked_by?: string[];
  created_at?: string;
  content?: string;
};

export type PostCardProps = {
  post: Post;
  onLike: () => void;
  currentUsername: string;
};
