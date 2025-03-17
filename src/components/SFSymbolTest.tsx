import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SFSymbol } from './SFSymbol';

export function SFSymbolTest() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SF Symbols Test</Text>

      <View style={styles.row}>
        <View style={styles.symbolContainer}>
          <SFSymbol name="star.fill" size={24} color="#007AFF" />
          <Text style={styles.label}>star.fill</Text>
        </View>

        <View style={styles.symbolContainer}>
          <SFSymbol name="heart.fill" size={24} color="#FF2D55" />
          <Text style={styles.label}>heart.fill</Text>
        </View>

        <View style={styles.symbolContainer}>
          <SFSymbol name="bell.fill" size={24} color="#FF9500" />
          <Text style={styles.label}>bell.fill</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Different Weights</Text>
      <View style={styles.row}>
        <View style={styles.symbolContainer}>
          <SFSymbol name="star" weight="light" size={24} color="#007AFF" />
          <Text style={styles.label}>light</Text>
        </View>

        <View style={styles.symbolContainer}>
          <SFSymbol name="star" weight="regular" size={24} color="#007AFF" />
          <Text style={styles.label}>regular</Text>
        </View>

        <View style={styles.symbolContainer}>
          <SFSymbol name="star" weight="bold" size={24} color="#007AFF" />
          <Text style={styles.label}>bold</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Different Scales</Text>
      <View style={styles.row}>
        <View style={styles.symbolContainer}>
          <SFSymbol name="star" scale="small" size={24} color="#007AFF" />
          <Text style={styles.label}>small</Text>
        </View>

        <View style={styles.symbolContainer}>
          <SFSymbol name="star" scale="medium" size={24} color="#007AFF" />
          <Text style={styles.label}>medium</Text>
        </View>

        <View style={styles.symbolContainer}>
          <SFSymbol name="star" scale="large" size={24} color="#007AFF" />
          <Text style={styles.label}>large</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Multicolor</Text>
      <View style={styles.row}>
        <View style={styles.symbolContainer}>
          <SFSymbol name="gamecontroller.fill" size={24} color="#007AFF" />
          <Text style={styles.label}>Single Color</Text>
        </View>

        <View style={styles.symbolContainer}>
          <SFSymbol name="gamecontroller.fill" size={24} multicolor={true} />
          <Text style={styles.label}>Multicolor</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  symbolContainer: {
    alignItems: 'center',
    marginRight: 30,
  },
  label: {
    marginTop: 5,
    fontSize: 12,
  },
});
