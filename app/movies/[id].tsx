import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface MovieDetailsProps {}

const MovieDetails = (props: MovieDetailsProps) => {
  return (
    <View style={styles.container}>
      <Text>MovieDetails</Text>
    </View>
  );
};

export default MovieDetails;

const styles = StyleSheet.create({
  container: {}
});
