export interface PowerStats {
  pm25: number;
  status: string;
}

export async function getPowerStats(): Promise<PowerStats> {
  try {
    const statsElement = document.querySelector('[data-lov-id="src\\components\\dashboard\\PowerStats.tsx:166:8"]');
    if (!statsElement) {
      throw new Error('Stats element not found');
    }

    const valueElement = statsElement.querySelector('.text-2xl.font-bold');
    const statusElement = statsElement.querySelector('.Badge');

    return {
      pm25: valueElement ? parseFloat(valueElement.textContent || '0') : 0,
      status: statusElement ? statusElement.textContent || 'Unknown' : 'Unknown'
    };
  } catch (error) {
    console.error('Error fetching power stats:', error);
    throw error;
  }
}