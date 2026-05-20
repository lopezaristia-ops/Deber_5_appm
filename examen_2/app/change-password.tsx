// Pantalla de cambio de contraseña - Usa Tamagui + Lottie
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Alert } from 'react-native';
import { Text, YStack, XStack } from 'tamagui';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { GradientBackground } from '../components/GradientBackground';
import { Ionicons } from '@expo/vector-icons';
import { PastelInput } from '../components/PastelInput';
import { PastelButton } from '../components/PastelButton';
import { productService } from '@/shared/api/productService';
import { PASTEL } from '../constants/colors';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (newPassword.length < 6) e.newPassword = 'Mínimo 6 caracteres';
    if (newPassword !== confirmPassword)
      e.confirmPassword = 'Las contraseñas no coinciden';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await productService.changePassword(newPassword);
      setSuccess(true);
      setTimeout(() => router.back(), 2000);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.center}>
          <LottieView
            source={require('../animations/success.json')}
            autoPlay
            loop={false}
            style={styles.lottie}
          />
          <Text fontSize={18} fontWeight="700" color={PASTEL.text} marginTop="$4" style={{ textAlign: 'center' }}>
            ¡Contraseña actualizada!
          </Text>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <YStack padding="$5" gap="$4" flex={1} style={{ paddingTop: 40 }}>
          <XStack alignItems="center" justifyContent="center" gap="$2" style={{ width: '100%' }}>
            <Ionicons name="lock-closed-outline" size={24} color={PASTEL.text} />
            <Text fontSize={22} fontWeight="800" color={PASTEL.text} style={{ textAlign: 'center' }}>
              Cambiar contraseña
            </Text>
          </XStack>
          <YStack
            backgroundColor={PASTEL.card}
            borderRadius={20}
            padding="$4"
            gap="$2"
            style={{ width: '100%' }}
          >
            <PastelInput
              label="Nueva contraseña"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              error={errors.newPassword}
              placeholder="Mínimo 6 caracteres"
            />
            <PastelInput
              label="Confirmar contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              error={errors.confirmPassword}
              placeholder="Repite la contraseña"
            />
          </YStack>
          <PastelButton
            title="Actualizar contraseña"
            onPress={handleChange}
            loading={loading}
          />
          <PastelButton
            title="Volver"
            onPress={() => router.back()}
            colors={[PASTEL.blue2, PASTEL.purple2]}
          />
        </YStack>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  lottie: { width: 180, height: 180 },
});
