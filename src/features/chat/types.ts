export interface Support {
  id: string;
  request_body: string | null;
  start_at: string | null;
  end_at: string | null;
  request_note: string | null;
  status: string | null;
  carer_id: string | null;
  supporter_id: string | null;
  reviews?: { id: string }[];
}

export interface Message {
  id: string;
  room_id: string | null;
  sender_id: string | null;
  type: 'text' | 'support' | 'image' | null;
  content: string | null;
  support_id: string | null;
  image_url: string | null;
  created_at: string;
  supports?: Support | null;
}
