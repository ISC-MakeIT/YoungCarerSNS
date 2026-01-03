"use server"

import { createClient } from '@/lib/supabase/server';
import { convertHelpTopic } from '../lib/convert-help-topic';
import type { HelpTopicMaster } from '../types';

export async function getHelpTopicMaster(): Promise<HelpTopicMaster[]> {
    const client = await createClient();
    let query = client
        .from('help_topics_master')
        .select('*')
        .order('sort_order', { ascending: true });

    const { data, error } = await query;

    if (error || !data) {
        throw new Error('Failed to fetch help topic masters');
    }

    return data.map(convertHelpTopic);
}