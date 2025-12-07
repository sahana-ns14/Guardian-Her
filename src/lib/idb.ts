import { openDB, type DBSchema } from 'idb';

interface GuardianDB extends DBSchema {
    reports: {
        key: string;
        value: {
            id: string;
            type: string;
            timestamp: number;
            location: { lat: number; lng: number } | null;
            description?: string;
            synced: boolean;
        };
    };
    chats: {
        key: string;
        value: {
            id: string;
            role: 'user' | 'bot';
            text: string;
            timestamp: number;
        };
        indexes: { 'by-timestamp': number };
    };
    maps: {
        key: string;
        value: {
            id: string; // tile key or route id
            data: any;
            timestamp: number;
        };
    };
}

const dbPromise = openDB<GuardianDB>('guardian-her-db', 1, {
    upgrade(db) {
        db.createObjectStore('reports', { keyPath: 'id' });
        const chatStore = db.createObjectStore('chats', { keyPath: 'id' });
        chatStore.createIndex('by-timestamp', 'timestamp');
        db.createObjectStore('maps', { keyPath: 'id' });
    },
});

export const idb = {
    async addReport(report: GuardianDB['reports']['value']) {
        return (await dbPromise).put('reports', report);
    },
    async getReports() {
        return (await dbPromise).getAll('reports');
    },
    async addChatMessage(message: GuardianDB['chats']['value']) {
        return (await dbPromise).put('chats', message);
    },
    async getChatHistory() {
        return (await dbPromise).getAllFromIndex('chats', 'by-timestamp');
    },
    async clearChat() {
        return (await dbPromise).clear('chats');
    }
};
