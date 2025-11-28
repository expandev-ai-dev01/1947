export type TipCategory = 'Sobrevivência' | 'Construção' | 'Redstone' | 'Exploração';
export type TipStatus = 'Rascunho' | 'Publicado';

export interface Tip {
  id: string;
  title: string;
  category: TipCategory;
  content_body: string;
  status: TipStatus;
  author_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface Post {
  id: string;
  nickname: string;
  post_title: string;
  post_body: string;
  created_at?: string;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  post_id_fk: string;
  nickname: string;
  comment_body: string;
  created_at?: string;
}

export interface CreateTipDto {
  title: string;
  category: TipCategory;
  content_body: string;
  status: TipStatus;
}

export interface CreatePostDto {
  nickname?: string;
  post_title: string;
  post_body: string;
  captcha_response: string;
}

export interface CreateCommentDto {
  nickname?: string;
  comment_body: string;
  captcha_response: string;
}
