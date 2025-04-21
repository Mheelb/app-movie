import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface SavedProps {}

const Saved = (props: SavedProps) => {
  return (
    <View style={styles.container}>
      <Text>Saved</Text>
    </View>
  );
};

export default Saved;

const styles = StyleSheet.create({
  container: {}
});
