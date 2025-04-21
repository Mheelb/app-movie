import { icons } from '@/constants/icons';
import * as React from 'react';
import { Text, View, StyleSheet, Image, TextInput } from 'react-native';

interface SearchBarProps {
  placeholder: string;
  onPress?: () => void;
}

const SearchBar = ({placeholder, onPress}: SearchBarProps) => {

  return (
    <View className='flex-row items-center bg-dark-200 rouded-full px-5 py-4'>
      <Image source={icons.search} className="size-5" resizeMode='contain' tintColor="#ab8bff"/>
      <TextInput
        onPress={onPress}
        placeholder={placeholder}
        value=''
        onChangeText={() => {}}
        placeholderTextColor="#a8b5db"
        className='flex-1 text-white ml-2'
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {}
});
