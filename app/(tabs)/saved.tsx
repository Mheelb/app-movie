import { useEffect } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { getFavoriteMovies } from '@/services/appwrite';
import useFetch from '@/services/useFetch';
import { FavoriteCard } from '@/components/FavoriteCard';
import appEvents, { EVENTS } from '@/utils/event-emitter';

const Saved = () => {

  const { data: favoriteMovies, loading: loading, error: error, refetch: reloadFavorites } = useFetch(getFavoriteMovies);

  useEffect(() => {
    const handleFavoritesUpdate = () => {
      reloadFavorites();
    };

    appEvents.on(EVENTS.FAVORITES_UPDATED, handleFavoritesUpdate);

    return () => {
      appEvents.off(EVENTS.FAVORITES_UPDATED, handleFavoritesUpdate);
    };
  }, []);

  return (
    <View className='bg-primary flex-1'>
      <Image source={images.bg} className="absolute w-full z-0" />
      <FlatList
        data={favoriteMovies}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <FavoriteCard
            movie={item}
          />
        )}
        keyExtractor={(item) => item.movie_id.toString()}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: 'flex-start', gap: 16, marginVertical: 16 }}
        className="px-3"
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className='w-full flex-row justify-center mt-20 items-center'>
              <Image source={icons.logo} className="w-12 h-10" />
            </View>
            {loading && (
              <ActivityIndicator size="large" color="#0000ff" className="my-3" />
            )}

            {error && (
              <Text className="text-red-500 px-5 my-3">Error: {error?.message}</Text>
            )}

            {favoriteMovies && favoriteMovies.length === 0 && (
              <View className='mt-10 px-5'>
                <Text className='text-center text-gray-500'>
                  No saved movies found
                </Text>
              </View>
            )}

            {!loading && !error && favoriteMovies && favoriteMovies.length > 0 && (
              <Text className="text-xl text-white font-bold mt-5 mb-3">
                Saved Movies
              </Text>
            )}
          </>
        }
        ListHeaderComponentClassName='mb-5'
      />
    </View>
  );
};

export default Saved;