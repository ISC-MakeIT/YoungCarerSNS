import type { HelpTopicMaster } from '../types';

export function convertHelpTopic(data: any): HelpTopicMaster {
    return {
        id: data.id,
        carerLabel: data.carer_label,
        supporterLabel: data.supporter_label,
        sortOrder: data.sort_order,
    };
}