"use server"

import { createClient } from '@/lib/supabase/server';
import { convertChatStance } from '../lib/convert-chat-stance';
import type { ChatStanceMaster } from '../types';

export async function getChatStanceMaster(): Promise<ChatStanceMaster[]> {
    const client = await createClient();
    let query = client
        .from('chat_stances_master')
        .select('*')
        .order('sort_order', { ascending: true });

    const { data, error } = await query;

    if (error || !data) {
        throw new Error('Failed to fetch chat stance masters');
    }

    return data.map(convertChatStance);
}