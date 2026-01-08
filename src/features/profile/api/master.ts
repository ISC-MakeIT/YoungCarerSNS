import { createClient } from '@/lib/supabase/server';
import { convertChatStance } from '../lib/convert-chat-stance';
import { convertHelpTopic } from '../lib/convert-help-topic';
import type { ChatStanceMaster, HelpTopicMaster } from '../types';

export async function getChatStanceMaster(): Promise<ChatStanceMaster[]> {
    const client = await createClient();
    const { data, error } = await client
        .from('chat_stances_master')
        .select('*')
        .order('sort_order', { ascending: true });

    if (error || !data) {
        throw new Error('Failed to fetch chat stance masters');
    }

    return data.map(convertChatStance);
}

export async function getHelpTopicMaster(): Promise<HelpTopicMaster[]> {
    const client = await createClient();
    const { data, error } = await client
        .from('help_topics_master')
        .select('*')
        .order('sort_order', { ascending: true });

    if (error || !data) {
        throw new Error('Failed to fetch help topic masters');
    }

    return data.map(convertHelpTopic);
}
