import { TouchableOpacity, View, Image, Text } from "react-native";
import { Link } from "expo-router";

export const FavoriteCard = ({ movie: { movie_id, title, poster_url } }: FavoriteCardProps) => {
    return (
        <Link href={`/movies/${movie_id}`} asChild>
            <TouchableOpacity className="w-32 relative">
                <Image source={{ uri: poster_url }} className="w-32 h-48 rounded-lg" resizeMode="cover" />
                <Text className="text-sm font-bold mt-2 text-light-200" numberOfLines={2}>{title}</Text>
            </TouchableOpacity>
        </Link>
    )
}