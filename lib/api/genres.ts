import { IGenre } from "@/types/Artist";

export async function getGenres(): Promise<IGenre[]> {
   const API_URL = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${API_URL}/genres/static`, {
      next: { 
         tags: ['genres'],
        revalidate: 3600,
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch genres');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
}