
export type FeatureType = 'remove-bg';

export interface AIResult {
    blob: Blob;
    url: string;
    stats?: {
        originalSize: number;
        newSize: number;
    };
}

export const AIService = {
    async removeBackground(imageBlob: Blob): Promise<AIResult> {
        const formData = new FormData();
        formData.append('image', imageBlob);

        const res = await fetch('/api/remove-bg', { method: 'POST', body: formData });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'BG Removal Failed');

        const resultRes = await fetch(data.result);
        const resultBlob = await resultRes.blob();

        return {
            blob: resultBlob,
            url: data.result,
            stats: {
                originalSize: imageBlob.size,
                newSize: resultBlob.size
            }
        };
    }
};
