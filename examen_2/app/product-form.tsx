// Pantalla de formulario para crear/editar productos - Usa Tamagui + Lottie
import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Alert, TouchableOpacity, View, Image, KeyboardAvoidingView, Platform, TextInput, Text as RNText } from 'react-native';
import { Text as TamaguiText, YStack, XStack } from 'tamagui';
import { useRouter, useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '../components/GradientBackground';
import { PastelButton } from '../components/PastelButton';
import { PastelInput } from '../components/PastelInput';
import { productService, type Product } from '@/shared/api/productService';
import { PASTEL } from '../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

const CATEGORIES = ['Casual', 'Clásico', 'Deportivo', 'Formal / Elegante'];

export default function ProductFormScreen() {
  const router = useRouter();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({
    title: '',
    price: '',
    category: '',
    description: '',
    image_url: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (productId) {
      loadProduct(productId);
    }
  }, [productId]);

  const loadProduct = async (id: string) => {
    try {
      const product = await productService.getById(id);
      setEditing(product);
      setForm({
        title: product.title,
        price: product.price.toString(),
        category: product.category,
        description: product.description || '',
        image_url: product.image_url || '',
      });
    } catch (e) {
      console.error('Error cargando producto:', e);
    }
  };

  const pickImage = async (useCamera: boolean) => {
    try {
      let result;
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'Se requiere permiso de cámara');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'Se requiere permiso de galería');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setForm(p => ({
          ...p,
          image_url: asset.uri,
        }));
      }
    } catch (e) {
      console.error('Error picking image:', e);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'El título es obligatorio';
    if (/\d/.test(form.title)) e.title = 'El título no puede contener números';
    if (!form.price || isNaN(Number(form.price))) e.price = 'Precio inválido';
    if (!form.category.trim()) e.category = 'La categoría es obligatoria';
    if (!form.description.trim()) e.description = 'La descripción es obligatoria';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      let imageUrl = form.image_url;

      if (form.image_url && (form.image_url.startsWith('file:') || form.image_url.startsWith('content:') || form.image_url.startsWith('/'))) {
        setUploadingImage(true);
        try {
          imageUrl = await productService.uploadImage(
            form.image_url,
            `product_${Date.now()}.jpg`
          );
        } catch (imgError) {
          console.error('Error subiendo imagen:', imgError);
          Alert.alert('Error', 'No se pudo subir la imagen');
          setLoading(false);
          setUploadingImage(false);
          return;
        }
      }

      const payload = {
        title: form.title,
        price: parseFloat(form.price),
        category: form.category,
        description: form.description,
        image_url: imageUrl || undefined,
      };

      if (editing) {
        await productService.update(editing.id!, payload);
      } else {
        await productService.create(payload);
      }
      
      // Activamos la pantalla de éxito
      setSuccess(true);
      
      
      setTimeout(() => router.back(), 1000);
      
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  if (success) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.centerContainer}>
          <LottieView
            source={require('../animations/success.json')}
            autoPlay
            loop={false}
            style={styles.lottieSuccess}
          />
          <TamaguiText fontSize={18} fontWeight="700" color={PASTEL.text} marginTop={20}>
            {editing ? '¡Producto actualizado!' : '¡Producto creado!'}
          </TamaguiText>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            <TamaguiText
              fontSize={22}
              fontWeight="800"
              color={PASTEL.text}
              marginTop={24}
              marginBottom={16}
            >
              {editing ? 'Editar producto' : 'Nuevo producto'}
            </TamaguiText>

            {/* Image Picker Section */}
            <YStack
              backgroundColor={PASTEL.card}
              borderRadius={20}
              padding="$4"
              marginBottom="$4"
            >
              <TamaguiText fontSize={14} fontWeight="600" color={PASTEL.text} marginBottom="$2">
                Foto del producto
              </TamaguiText>
              {form.image_url ? (
                <View style={styles.imagePreview}>
                  <Image
                    source={{ uri: form.image_url }}
                    style={styles.imagePreviewImg}
                  />
                  <TouchableOpacity
                    style={styles.removeImageBtn}
                    onPress={() => setForm(p => ({ ...p, image_url: '' }))}
                  >
                    <Ionicons name="close" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              ) : (
                <LinearGradient
                  colors={[PASTEL.purple2, PASTEL.pink2]}
                  style={styles.imagePlaceholder}
                >
                  <Ionicons name="image-outline" size={40} color={PASTEL.text} />
                </LinearGradient>
              )}
              <XStack gap="$2" marginTop="$3">
                <PastelButton
                  title="Cámara"
                  onPress={() => pickImage(true)}
                  style={{ flex: 1 }}
                  colors={[PASTEL.blue2, PASTEL.purple2]}
                />
                <PastelButton
                  title="Galería"
                  onPress={() => pickImage(false)}
                  style={{ flex: 1 }}
                  colors={[PASTEL.purple2, PASTEL.pink2]}
                />
              </XStack>
            </YStack>

            {/* Form Fields */}
            <YStack
              backgroundColor={PASTEL.card}
              borderRadius={20}
              padding="$4"
              gap="$3"
            >
              <PastelInput
                label="Título (sin números)"
                value={form.title}
                onChangeText={v => setForm(p => ({ ...p, title: v }))}
                error={errors.title}
                placeholder="Ej: Vestido floral"
              />
              <PastelInput
                label="Precio ($)"
                value={form.price}
                onChangeText={v => setForm(p => ({ ...p, price: v }))}
                error={errors.price}
                keyboardType="numeric"
                placeholder="0.00"
              />

              {/* Category Selector */}
              <View>
                <TamaguiText style={styles.label}>Categoría</TamaguiText>
                <View style={styles.categoryContainer}>
                  {CATEGORIES.map(cat => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryChip,
                        form.category === cat && styles.categoryChipActive,
                      ]}
                      onPress={() => setForm(p => ({ ...p, category: cat }))}
                    >
                      <RNText
                        style={[
                          styles.categoryText,
                          form.category === cat && styles.categoryTextActive,
                        ]}
                      >
                        {cat}
                      </RNText>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.category && (
                  <RNText style={styles.error}>{errors.category}</RNText>
                )}
              </View>

              {/* Description */}
              <View style={styles.wrapper}>
                <TamaguiText style={styles.label}>Descripción</TamaguiText>
                <TextInput
                  style={[styles.descriptionInput, errors.description && styles.inputError]}
                  placeholder="Describe tu producto..."
                  placeholderTextColor={PASTEL.textLight}
                  value={form.description}
                  onChangeText={v => setForm(p => ({ ...p, description: v }))}
                  multiline
                  numberOfLines={5}
                />
                {errors.description && (
                  <RNText style={styles.error}>{errors.description}</RNText>
                )}
              </View>
            </YStack>

            {/* Buttons */}
            <PastelButton
              title={loading || uploadingImage ? 'Guardando...' : (editing ? 'Guardar cambios' : 'Crear producto')}
              onPress={handleSubmit}
              loading={loading || uploadingImage}
              style={styles.btn}
              disabled={loading || uploadingImage}
            />
            <PastelButton
              title="Cancelar"
              onPress={() => router.back()}
              colors={[PASTEL.blue2, PASTEL.purple2]}
              style={styles.btn}
              disabled={loading || uploadingImage}
          />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 100 },
  btn: { marginTop: 16 },
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  lottieSuccess: { width: 180, height: 180 },
  imagePreview: {
    position: 'relative',
    marginBottom: 12,
  },
  imagePreviewImg: {
    width: '100%',
    height: 200,
    borderRadius: 14,
  },
  removeImageBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 6,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: PASTEL.text,
    marginBottom: 6,
    marginLeft: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: PASTEL.white,
    borderWidth: 1.5,
    borderColor: PASTEL.purple2,
  },
  categoryChipActive: {
    backgroundColor: PASTEL.purple1,
    borderColor: PASTEL.purple1,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: PASTEL.text,
  },
  categoryTextActive: {
    color: '#fff',
  },
  descriptionInput: {
    backgroundColor: PASTEL.white,
    borderWidth: 1.5,
    borderColor: PASTEL.purple2,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: PASTEL.text,
    textAlignVertical: 'top',
  },
  inputError: { borderColor: PASTEL.pink1 },
  error: { fontSize: 12, color: PASTEL.pink1, marginTop: 4, marginLeft: 4 },
  wrapper: { marginBottom: 16 },
});