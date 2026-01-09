export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'carer' | 'supporter' | null
          display_name: string | null
          icon_url: string | null
          bio: string | null
          prefecture: string | null
          city: string | null
          help_topics: string[] | null
          help_topic_other: string | null
          chat_stances: string[] | null
          created_at: string | null
        }
        Insert: {
          id: string
          role?: 'carer' | 'supporter' | null
          display_name?: string | null
          icon_url?: string | null
          bio?: string | null
          prefecture?: string | null
          city?: string | null
          help_topics?: string[] | null
          help_topic_other?: string | null
          chat_stances?: string[] | null
          created_at?: string | null
        }
        Update: {
          id?: string
          role?: 'carer' | 'supporter' | null
          display_name?: string | null
          icon_url?: string | null
          bio?: string | null
          prefecture?: string | null
          city?: string | null
          help_topics?: string[] | null
          help_topic_other?: string | null
          chat_stances?: string[] | null
          created_at?: string | null
        }
      }
      carer_profiles: {
        Row: {
          user_id: string
          family_situation: string | null
          location_visibility: string | null
          help_topic_visibility: string | null
          chat_stance_visibility: string | null
          family_situation_visibility: string | null
        }
        Insert: {
          user_id: string
          family_situation?: string | null
          location_visibility?: string | null
          help_topic_visibility?: string | null
          chat_stance_visibility?: string | null
          family_situation_visibility?: string | null
        }
        Update: {
          user_id?: string
          family_situation?: string | null
          location_visibility?: string | null
          help_topic_visibility?: string | null
          chat_stance_visibility?: string | null
          family_situation_visibility?: string | null
        }
      }
      supporter_profiles: {
        Row: {
          user_id: string
          available_time: string | null
          care_experience: string[] | null
          learning_background: string[] | null
        }
        Insert: {
          user_id: string
          available_time?: string | null
          care_experience?: string[] | null
          learning_background?: string[] | null
        }
        Update: {
          user_id?: string
          available_time?: string | null
          care_experience?: string[] | null
          learning_background?: string[] | null
        }
      }
      rooms: {
        Row: {
          id: string
          current_support_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          current_support_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          current_support_id?: string | null
          created_at?: string | null
        }
      }
      room_members: {
        Row: {
          room_id: string
          user_id: string
          last_read_at: string | null
        }
        Insert: {
          room_id: string
          user_id: string
          last_read_at?: string | null
        }
        Update: {
          room_id?: string
          user_id?: string
          last_read_at?: string | null
        }
      }
      supports: {
        Row: {
          id: string
          room_id: string | null
          carer_id: string | null
          supporter_id: string | null
          status: 'pending' | 'accepted' | 'ongoing' | 'completed' | 'cancelled' | 'rejected' | null
          start_at: string | null
          end_at: string | null
          started_at: string | null
          completed_at: string | null
          request_body: string | null
          request_note: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          room_id?: string | null
          carer_id?: string | null
          supporter_id?: string | null
          status?: 'pending' | 'accepted' | 'ongoing' | 'completed' | 'cancelled' | 'rejected' | null
          start_at?: string | null
          end_at?: string | null
          started_at?: string | null
          completed_at?: string | null
          request_body?: string | null
          request_note?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          room_id?: string | null
          carer_id?: string | null
          supporter_id?: string | null
          status?: 'pending' | 'accepted' | 'ongoing' | 'completed' | 'cancelled' | 'rejected' | null
          start_at?: string | null
          end_at?: string | null
          started_at?: string | null
          completed_at?: string | null
          request_body?: string | null
          request_note?: string | null
          created_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          room_id: string | null
          sender_id: string | null
          type: 'text' | 'support' | 'image' | null
          content: string | null
          support_id: string | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          room_id?: string | null
          sender_id?: string | null
          type?: 'text' | 'support' | 'image' | null
          content?: string | null
          support_id?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string | null
          sender_id?: string | null
          type?: 'text' | 'support' | 'image' | null
          content?: string | null
          support_id?: string | null
          image_url?: string | null
          created_at?: string
        }
      }
      chat_stances_master: {
        Row: {
          id: string
          carer_label: string | null
          supporter_label: string | null
          sort_order: number | null
        }
        Insert: {
          id: string
          carer_label?: string | null
          supporter_label?: string | null
          sort_order?: number | null
        }
        Update: {
          id?: string
          carer_label?: string | null
          supporter_label?: string | null
          sort_order?: number | null
        }
      }
      help_topics_master: {
        Row: {
          id: string
          carer_label: string | null
          supporter_label: string | null
          sort_order: number | null
        }
        Insert: {
          id: string
          carer_label?: string | null
          supporter_label?: string | null
          sort_order?: number | null
        }
        Update: {
          id?: string
          carer_label?: string | null
          supporter_label?: string | null
          sort_order?: number | null
        }
      }
    }
  }
}
