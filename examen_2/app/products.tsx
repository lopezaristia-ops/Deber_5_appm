// Pantalla de listado de productos - Usa Tamagui + expo-linear-gradient + Lottie
import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  View,
} from 'react-native';
import { Text, YStack, XStack } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { GradientBackground } from '../components/GradientBackground';
import { ProductCard } from '../components/ProductCard';
import { LoadingLottie } from '../components/LoadingLottie';
import { productService, type Product } from '@/shared/api/productService';
import { PASTEL } from '../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProductsScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (e) {
      console.error('Error cargando productos:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleDelete = async (id: string) => {
    try {
      await productService.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      console.error('Error eliminando producto:', e);
    }
  };

  const handleEdit = (product: Product) => {
    router.push({
      pathname: '/product-form',
      params: { productId: product.id },
    });
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <LinearGradient
          colors={[PASTEL.blue2, PASTEL.purple2]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.headerRow}>
            <XStack alignItems="center" gap="$2">
              <Ionicons name="basket-outline" size={24} color={PASTEL.text} />
              <Text fontSize={22} fontWeight="800" color={PASTEL.text}>
                Catálogo completo
              </Text>
            </XStack>
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={() => router.push('/product-form')}
                style={styles.createProductBtn}
                android_ripple={{ color: '#D1D5DB' }}
              >
                <LinearGradient
                  colors={[PASTEL.purple1, PASTEL.pink1]}
                  style={styles.createProductGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Ionicons name="add" size={18} color="#fff" style={styles.createProductIcon} />
                  <Text style={styles.createProductText}>Crear producto</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/change-password')}
                style={styles.headerBtn}
                android_ripple={{ color: '#D1D5DB' }}
              >
                <Ionicons name="lock-closed-outline" size={22} color={PASTEL.text} />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {loading ? (
          <LoadingLottie source={require('../animations/loading.json')} />
        ) : (
          <FlatList
            data={products}
            keyExtractor={item => item.id!}
            numColumns={2}
            renderItem={({ item }) => (
              <View style={styles.gridItem}>
                <ProductCard
                  product={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </View>
            )}
            contentContainerStyle={styles.list}
            columnWrapperStyle={styles.columnWrapper}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  loadProducts();
                }}
              />
            }
            ListEmptyComponent={
              <YStack alignItems="center" marginTop="$8">
                <LoadingLottie
                  source={require('../animations/empty.json')}
                  size={160}
                />
                <Text color={PASTEL.textLight} fontSize={16} marginTop="$3">
                  No hay productos todavía
                </Text>
              </YStack>
            }
          />
        )}

        {/* FAB - Botón flotante */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/product-form')}
        >
          <LinearGradient
            colors={[PASTEL.purple1, PASTEL.pink1]}
            style={styles.fabGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="add" size={30} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </GradientBackground>
  );
}

  const styles = StyleSheet.create({
    safe: { flex: 1 },
    header: {
      padding: 20,
      paddingTop: 10,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 10,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    headerBtn: { padding: 8, backgroundColor: '#E5E7EB', borderRadius: 12, borderWidth: 1.5, borderColor: PASTEL.purple1 },
    createProductBtn: { overflow: 'hidden', borderRadius: 18 },
    createProductGradient: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    createProductIcon: { marginRight: 8 },
    createProductText: { color: '#fff', fontWeight: '700' },
    list: { paddingTop: 12, paddingBottom: 120 },
    gridItem: { flex: 1, padding: 8 },
    columnWrapper: { justifyContent: 'space-between' },
    fab: { position: 'absolute', bottom: 28, right: 24 },
    fabGradient: {
      width: 58,
      height: 58,
      borderRadius: 29,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 6,
      shadowColor: PASTEL.purple1,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      borderWidth: 2,
      borderColor: PASTEL.purple1,
    },
  });
