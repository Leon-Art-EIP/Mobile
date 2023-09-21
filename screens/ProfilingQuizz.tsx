import React from 'react';
import { View, StyleSheet, Text } from 'react-native'
import colors from '../constants/colors';
import Title from '../components/Title';


const ProfilingQuizz = () => {
  return (
<View style={styles.container}>
    <Title style={{ color: colors.primary, fontSize: 40 }}>Leon</Title>
    <Title style={{ fontSize: 40 }}>'Art</Title>
</View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
});

export default ProfilingQuizz;
