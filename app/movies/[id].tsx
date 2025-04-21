import { icons } from '@/constants/icons';
import { fetchMovieDetails } from '@/services/api';
import useFetch from '@/services/useFetch';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { addToFavorites, checkIsFavorite, removeFromFavorites } from '@/services/appwrite';
import appEvents, { EVENTS } from '@/utils/event-emitter';

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className='flex-col items-start justify-center mt-5'>
    <Text className='text-light-200 font-normal text-sm'>{label}</Text>
    <Text className='text-light-100 font-bold text-sm mt-2'>{value || 'N/A'}</Text>
  </View>
)

const MovieDetails = () => {

  const [isFavorite, setIsFavorite] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { id } = useLocalSearchParams();

  const { data: movie, loading } = useFetch(() => fetchMovieDetails(id as string));

  const handleFavoriteToggle = async () => {
    if (!movie) return;

    setIsUpdating(true);
    try {
      if (isFavorite) {
        await removeFromFavorites(movie.id);
        setIsFavorite(false);
      } else {
        await addToFavorites({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path || ''
        });
        setIsFavorite(true);
      }
      appEvents.emit(EVENTS.FAVORITES_UPDATED, { movieId: movie.id, isFavorite: !isFavorite });
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (movie) {
        const favoriteStatus = await checkIsFavorite(movie.id);
        setIsFavorite(favoriteStatus);
      }
    };

    checkFavoriteStatus();
  }, [movie]);

  return (
    <View className='bg-primary flex-1'>
      <ScrollView contentContainerStyle={{
        paddingBottom: 80,
      }}>
        <View>
          <Image className="w-full h-[550px]" resizeMode="stretch" source={{ uri: `https://image.tmdb.org/t/p/w500/${movie?.poster_path}` }} />
        </View>

        <View className='flex-col items-start justfy-center mt-5 px-5'>
          <View className='flex-row items-center justify-between w-full'>
            <Text className='text-white text-bold text-xl'>{movie?.title}</Text>
            <TouchableOpacity
              onPress={handleFavoriteToggle}
              disabled={isUpdating}
            >
              <Image
                source={icons.save}
                className='size-8'
                tintColor={isFavorite ? '#ab8bff' : '#ffffff'}
              />
            </TouchableOpacity>
          </View>
          <View className='flex-row items-center gap-x-1 mt-2'>
            <Text className='text-light-200 text-sm'>{movie?.release_date?.split('-')[0]}</Text>
            <Text className='text-light-200 text-sm'>{movie?.runtime}m</Text>
          </View>

          <View className='flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2'>
            <Image source={icons.star} className='size-4' />
            <Text className='text-white text-sm fontbold'>{Math.round(movie?.vote_average ?? 0)}/10</Text>
            <Text className='text-light-200 text-sm'>{movie?.vote_count} votes</Text>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo label="Genres" value={movie?.genres?.map((g) => g.name).join(' - ') || 'N/A'} />

          <View className='flex flex-row justify-between w-1/2'>
            <MovieInfo label="Budget" value={`${(movie?.budget ?? 0) / 1_000_000} millions`} />
            <MovieInfo label="Revenue" value={`$${Math.round(movie?.revenue ?? 0) / 1_000_000}`} />
          </View>

          <MovieInfo label="Production Companies" value={movie?.production_companies?.map((c) => c.name).join(' - ') || 'N/A'} />
        </View>
      </ScrollView>

      <TouchableOpacity
        className='absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50'
        onPress={() => { router.back() }}
      >
        <Image source={icons.arrow} className='size-5 mr-1 mt-0.5 rotate-180' tintColor={'#fff'} />
        <Text className='text-white font-semibold text-base'>Go back</Text>
      </TouchableOpacity>
    </View >
  );
};

export default MovieDetails;

const styles = StyleSheet.create({
  container: {}
});
