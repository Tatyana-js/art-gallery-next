import { IGenre } from '@/types/Artist';

export async function getGenres(): Promise<IGenre[]> {
  try {
    const response = await fetch('/api/genres');

    if (!response.ok) {
      throw new Error('Failed to fetch genres');
    }

    return (await response.json()) as IGenre[];
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
}
