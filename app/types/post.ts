export type Post = {
  _id: string;
  title: string;
  description?: string;
  img_url?: string;
  username: string;
  likes: number;
  created_at?: string;
};

export type PostCardProps = {
  post: Post;
  onLike: () => void;
};
