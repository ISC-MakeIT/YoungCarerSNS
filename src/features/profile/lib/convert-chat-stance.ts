import type { ChatStanceMaster } from '../types';

export function convertChatStance(data: any): ChatStanceMaster {
    return {
        id: data.id,
        carerLabel: data.carer_label,
        supporterLabel: data.supporter_label,
        sortOrder: data.sort_order,
    };
}