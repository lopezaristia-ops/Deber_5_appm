// Wrapper de animación Lottie para estados de carga, éxito y vacío
import React from 'react';
import LottieView from 'lottie-react-native';
import { View, StyleSheet } from 'react-native';

// Descarga animaciones gratuitas de https://lottiefiles.com
// Recomendadas: "loading dots pastel", "empty box", "success checkmark"

interface Props {
  source: object;  // require('../animations/loading.json')
  size?: number;
  autoPlay?: boolean;
  loop?: boolean;
}

export const LoadingLottie: React.FC<Props> = ({
  source,
  size = 120,
  autoPlay = true,
  loop = true,
}) => (
  <View style={styles.container}>
    <LottieView
      source={source}
      autoPlay={autoPlay}
      loop={loop}
      style={{ width: size, height: size }}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: 20 },
});
