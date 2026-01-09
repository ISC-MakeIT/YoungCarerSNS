export interface Message {
  id: string;
  room_id: string | null;
  sender_id: string | null;
  type: 'text' | 'support' | 'image' | null;
  content: string | null;
  support_id: string | null;
  image_url: string | null;
  created_at: string;
}
