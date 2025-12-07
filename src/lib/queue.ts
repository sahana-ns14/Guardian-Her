export interface SOSRequest {
    id: string;
    timestamp: number;
    contacts: { id: string; phone: string }[];
    message: string;
    locationURL: string;
}

const QUEUE_KEY = 'guardian_her_sos_queue';

export const saveToQueue = (data: Omit<SOSRequest, 'id' | 'timestamp'>) => {
    const queue = getQueue();
    const newRequest: SOSRequest = {
        ...data,
        id: crypto.randomUUID(),
        timestamp: Date.now()
    };
    queue.push(newRequest);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    return newRequest;
};

export const getQueue = (): SOSRequest[] => {
    try {
        const item = localStorage.getItem(QUEUE_KEY);
        return item ? JSON.parse(item) : [];
    } catch {
        return [];
    }
};

export const clearQueue = () => {
    localStorage.removeItem(QUEUE_KEY);
};

export const removeFromQueue = (id: string) => {
    const queue = getQueue();
    const filtered = queue.filter(item => item.id !== id);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
};

export const processQueue = async (apiEndpoint: string) => {
    if (!navigator.onLine) return;

    const queue = getQueue();
    if (queue.length === 0) return;

    console.log(`Processing ${queue.length} offline SOS requests...`);

    for (const request of queue) {
        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contacts: request.contacts,
                    message: request.message,
                    locationURL: request.locationURL
                })
            });

            if (response.ok) {
                console.log(`Queue item ${request.id} sent successfully.`);
                removeFromQueue(request.id);
            } else {
                console.error(`Failed to send queue item ${request.id}`);
            }
        } catch (error) {
            console.error(`Error processing queue item ${request.id}:`, error);
        }
    }
};
