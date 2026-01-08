export interface Message {
  id: string;
  room_id: string | null;
  sender_id: string | null;
  content: string | null;
  image_url: string | null;
  created_at: string;
}
