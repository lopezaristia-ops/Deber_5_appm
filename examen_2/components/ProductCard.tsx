// Tarjeta de producto individual con gradiente - Usa Tamagui + expo-linear-gradient + Lottie (placeholder animado)
import React from 'react';
import { TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { YStack, XStack, Text, Card } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { PASTEL } from '../constants/colors';
import { useSession } from '@/features/session/model/useSession';

interface Product {
  id?: string;
  title: string;
  price: number;
  category: string;
  description?: string;
  image_url?: string;
  user_id?: string;
  created_at?: string;
}

interface Props {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductCard: React.FC<Props> = ({ product, onEdit, onDelete }) => {
  const { user } = useSession();
  const isOwner = user?.id === product.user_id;

  const handleDelete = () => {
    Alert.alert('Eliminar', `¿Eliminar "${product.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => onDelete(product.id!),
      },
    ]);
  };

  const handleImageError = (event: any) => {
    console.error('ProductCard image load error:', event.nativeEvent?.error || event);
  };

  return (
    <Card elevate bordered style={styles.card} marginBottom="$3">
      <LinearGradient
        colors={[PASTEL.blue2, PASTEL.purple2]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <YStack padding="$3" gap="$2">
          {/* Image Section */}
          {product.image_url ? (
            <Image
              source={{ uri: product.image_url }}
              style={styles.image}
              resizeMode="cover"
              onError={handleImageError}
            />
          ) : (
            <LinearGradient
              colors={[PASTEL.purple2, PASTEL.pink2]}
              style={styles.imagePlaceholder}
            >
              <Ionicons name="image-outline" size={28} color={PASTEL.text} />
            </LinearGradient>
          )}

          {/* Info Section */}
          <YStack>
            <Text fontWeight="700" fontSize={16} color={PASTEL.text} numberOfLines={1}>
              {product.title}
            </Text>
            <XStack justifyContent="space-between" alignItems="center" marginTop="$1">
              <Text fontSize={12} color={PASTEL.textLight} backgroundColor={PASTEL.purple2} paddingHorizontal="$2" paddingVertical="$1" borderRadius="$2">
                {product.category}
              </Text>
              <Text fontWeight="600" fontSize={14} color={PASTEL.purple1}>
                ${product.price.toFixed(2)}
              </Text>
            </XStack>
            {product.description && (
              <Text fontSize={12} color={PASTEL.textLight} marginTop="$2" numberOfLines={2}>
                {product.description}
              </Text>
            )}
          </YStack>

          {/* Actions Section */}
          {isOwner && (
            <XStack gap="$2" paddingTop="$2" justifyContent="flex-end">
              <TouchableOpacity
                onPress={() => onEdit(product)}
                style={[styles.iconBtn, { borderColor: PASTEL.purple1 }]}
              >
                <Ionicons name="pencil-outline" size={18} color={PASTEL.purple1} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleDelete} 
                style={[styles.iconBtn, { borderColor: PASTEL.pink1 }]}
              >
                <Ionicons name="trash-outline" size={18} color={PASTEL.pink1} />
              </TouchableOpacity>
            </XStack>
          )}
        </YStack>
      </LinearGradient>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 16, overflow: 'hidden', margin: 8, flex: 1 },
  gradient: { borderRadius: 16 },
  image: { width: '100%', height: 140, borderRadius: 12 },
  imagePlaceholder: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: { 
    padding: 6, 
    borderRadius: 8, 
    borderWidth: 1.5,
    backgroundColor: '#FFF',
  },
});
