import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import Title from '../text/Title';

const Logo = () => {
  return (
    <View style={styles.logo}>
    <Title style={{ color: colors.primary }}>Leon</Title>
    <Title>'Art</Title>
    </View>
  );
};

const styles = StyleSheet.create({
logo: {
    alignItems: 'center',
    borderColor: 'red',
    // backgroundColor: colors.disabledBg,
    borderRadius: 10,
    flexDirection: 'row',
    marginBottom: 12
    },
});

export default Logo;

