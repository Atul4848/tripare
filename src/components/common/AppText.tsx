import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';

interface AppTextProps extends TextProps {
  children: React.ReactNode;
}

export const AppText: React.FC<AppTextProps> = ({ children, style, ...props }) => {
  return (
    <Text style={[styles.default, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  default: {
    fontFamily: 'System',
    fontSize: 16,
    color: '#333',
  },
});