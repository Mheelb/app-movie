import { Client, Databases, ID, Query } from 'react-native-appwrite';

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const METRICS_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_METRICS_COLLECTION_ID!;
const FAVORITES_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_FAVORITES_COLLECTION_ID!;

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

type FavoriteMovieInput = {
    id: number;
    title: string;
    poster_path: string;
};

export const updateSearchCount = async (query: string, movie: Movie) => {
    try {
        const result = await database.listDocuments(DATABASE_ID, METRICS_COLLECTION_ID, [
            Query.equal('searchTerm', query),
        ]);

        if (result.documents.length > 0) {
            const existingMovie = result.documents[0];

            await database.updateDocument(
                DATABASE_ID,
                METRICS_COLLECTION_ID,
                existingMovie.$id,
                {
                    count: existingMovie.count + 1,
                }
            );
        } else {
            await database.createDocument(
                DATABASE_ID,
                METRICS_COLLECTION_ID,
                ID.unique(),
                {
                    searchTerm: query,
                    movie_id: movie.id,
                    count: 1,
                    poster_url: 'https://images.tmdb.org/t/p/w500' + movie.poster_path,
                    title: movie.title,
                }
            )
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, METRICS_COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc('count'),
        ]);

        return result.documents as unknown as TrendingMovie[];
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export const addToFavorites = async (movie: FavoriteMovieInput): Promise<void> => {
    try {
        // Check if the movie already exists in the favorites collection
        const result = await database.listDocuments(DATABASE_ID, FAVORITES_COLLECTION_ID, [
            Query.equal('movie_id', movie.id),
        ]);
        
        if (result.documents.length > 0) return;

        await database.createDocument(
            DATABASE_ID,
            FAVORITES_COLLECTION_ID,
            ID.unique(),
            {
                movie_id: movie.id,
                poster_url: 'https://images.tmdb.org/t/p/w500' + movie.poster_path,
                title: movie.title,
            }
        );
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const removeFromFavorites = async (movieId: number): Promise<void> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, FAVORITES_COLLECTION_ID, [
            Query.equal('movie_id', movieId),
        ]);

        if (result.documents.length > 0) {
            const existingMovie = result.documents[0];

            await database.deleteDocument(
                DATABASE_ID,
                FAVORITES_COLLECTION_ID,
                existingMovie.$id
            );
        }
    }
    catch (error) {
        console.error(error);
        throw error;
    }
};

export const getFavoriteMovies = async (): Promise<FavoriteMovie[] | undefined> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, FAVORITES_COLLECTION_ID);

        return result.documents as unknown as FavoriteMovie[];
    } catch (error) {
        console.error(error);
        return undefined;
    }
};

export const checkIsFavorite = async (movieId: number): Promise<boolean> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, FAVORITES_COLLECTION_ID, [
            Query.equal('movie_id', movieId),
        ]);

        return result.documents.length > 0;
    } catch (error) {
        console.error(error);
        return false;
    }
};