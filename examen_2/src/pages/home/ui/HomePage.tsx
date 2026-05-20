import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, FlatList } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import { useSession } from "@/features/session/model/useSession";
import { Button } from "@/shared/ui/Button";
import { theme } from "@/core/styles/theme";
import { productService, type Product } from "@/shared/api/productService";
import { useEffect, useState, useMemo } from "react";
import { ProductCard } from "../../../../components/ProductCard";
import { PASTEL } from "../../../../constants/colors";

export const HomePage = () => {
  const { signOut } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll();
      setProducts(data ?? []);
    } catch (e) {
      console.error('Error cargando productos en Home:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSignOut = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro de que deseas salir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const handleEdit = (product: Product) => {
    router.push({ pathname: '/product-form', params: { productId: product.id } });
  };

  const totalProducts = products.length;
  const categoryCount = useMemo(
    () => Array.from(new Set(products.map((item) => item.category))).length,
    [products]
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* PARTE SUPERIOR: Fila horizontal de botones fija */}
      <View style={styles.headerActionRow}>
        <Button onPress={() => router.push('/change-password')} label="Cambiar contraseña" variant="primary" />
        <Button onPress={handleSignOut} label="Cerrar sesión" variant="danger" />
      </View>

      {/* PARTE INFERIOR: Todo este contenedor maneja el scroll unificado */}
      <View style={styles.catalogSection}>
        {loading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Cargando productos...</Text>
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(i) => i.id!}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            
            // Renderiza la cabecera de la lista para que se deslice junto con las tarjetas
            ListHeaderComponent={
              <>
                {/* Comienza el recuadro que contiene el título de Aurora Boutique */}
                <LinearGradient 
                  colors={[PASTEL.blue2, PASTEL.purple2]} 
                  style={styles.header} 
                  start={{ x: 0, y: 0 }} 
                  end={{ x: 1, y: 0 }}
                >
                  <Ionicons name="bag-outline" size={32} color="#fff" style={styles.headerIcon} />
                  <Text style={styles.headerTitle}>Boutique Aurora</Text>
                  <Text style={styles.headerSub}>Tienda de productos pastel y únicos</Text>
                </LinearGradient>

                {/* Grid de Dashboard de control */}
                <View style={styles.dashboardGrid}>
                  <View style={styles.dashboardCard}>
                    <View style={styles.cardHeader}>
                      <Ionicons name="cube-outline" size={20} color={PASTEL.text} style={styles.cardIcon} />
                      <Text style={styles.cardTitle}>Productos</Text>
                    </View>
                    <Text style={styles.statValue}>{totalProducts}</Text>
                    <Text style={styles.cardSubtitle}>Items registrados en tu catálogo</Text>
                  </View>

                  <View style={styles.dashboardCard}>
                    <View style={styles.cardHeader}>
                      <Ionicons name="pricetag-outline" size={20} color={PASTEL.text} style={styles.cardIcon} />
                      <Text style={styles.cardTitle}>Categorías</Text>
                    </View>
                    <Text style={styles.statValue}>{categoryCount}</Text>
                    <Text style={styles.cardSubtitle}>Variedad de productos disponibles</Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.dashboardCard, styles.actionCard, styles.catalogCard]}
                    onPress={() => router.push('/products')}
                  >
                    <View style={styles.cardHeader}>
                      <Ionicons name="cart-outline" size={20} color="#fff" style={styles.cardIcon} />
                      <Text style={[styles.cardTitle, styles.actionTitle]}>Ver catálogo completo</Text>
                    </View>
                    <Text style={styles.cardDescription}>Navega todos los productos activos.</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.dashboardCard, styles.actionCard, styles.createCard]}
                    onPress={() => router.push('/product-form')}
                  >
                    <View style={styles.cardHeader}>
                      <Ionicons name="pencil-outline" size={20} color="#fff" style={styles.cardIcon} />
                      <Text style={[styles.cardTitle, styles.actionTitle]}>Crear producto</Text>
                    </View>
                    <Text style={styles.cardDescription}>Agrega un nuevo artículo a tu tienda.</Text>
                  </TouchableOpacity>
                </View>

                {/* Título de la sección de listado */}
                <Text style={styles.sectionTitle}>Últimos productos</Text>

                {/* Si no hay productos, mostramos el botón de creación aquí dentro */}
                {products.length === 0 && (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Aún no hay productos. Comienza creando el primero.</Text>
                    <TouchableOpacity
                      onPress={() => router.push('/product-form')}
                      style={[styles.createBtn, { backgroundColor: PASTEL.purple1 }]}
                    >
                      <Text style={styles.createBtnText}>Crear Producto</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            }
            renderItem={({ item }) => (
              <View style={styles.gridItem}>
                <ProductCard 
                  product={item} 
                  onEdit={handleEdit} 
                  onDelete={async (id: string) => { 
                    await productService.delete(id); 
                    loadProducts(); 
                  }} 
                />
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:              { flex: 1, backgroundColor: theme.colors.bg },
  headerActionRow:   { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 40, marginBottom: 16, gap: 10 },
  catalogSection:    { flex: 1, paddingHorizontal: 24 },
  header:            { backgroundColor: theme.colors.primary, borderRadius: 16, paddingTop: 32, paddingHorizontal: 24, paddingBottom: 22, alignItems: "center", ...theme.shadow.card },
  dashboardGrid:     { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 18 },
  dashboardCard:     { width: '48%', backgroundColor: PASTEL.white, borderRadius: 18, padding: 18, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
  actionCard:        { paddingVertical: 22 },
  catalogCard:       { backgroundColor: PASTEL.blue2 },
  createCard:        { backgroundColor: PASTEL.purple1 },
  cardHeader:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 },
  cardIcon:          { marginRight: 10 },
  cardTitle:         { color: PASTEL.text, fontWeight: '700', fontSize: 14, textAlign: 'center' },
  actionTitle:       { color: '#fff', textAlign: 'center' },
  statValue:         { fontSize: 32, fontWeight: '800', color: PASTEL.text, textAlign: 'center' },
  cardSubtitle:      { marginTop: 8, color: PASTEL.textLight, fontSize: 13, lineHeight: 18, textAlign: 'center' },
  cardDescription:   { marginTop: 8, color: '#F3F4F6', fontSize: 13, lineHeight: 18, textAlign: 'center' },
  sectionTitle:      { fontSize: 18, fontWeight: '700', color: PASTEL.text, marginTop: 24, marginBottom: 16, textAlign: 'center' },
  emptyContainer:    { alignItems: 'center', paddingVertical: 24 },
  emptyText:         { marginTop: 12, color: PASTEL.textLight, textAlign: 'center' },
  createBtn:         { marginTop: 12, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 14 },
  createBtnText:     { color: '#fff', fontWeight: '700' },
  gridItem:          { flex: 1, padding: 6 },
  columnWrapper:     { justifyContent: 'space-between' },
  headerIcon:        { fontSize: 48, marginBottom: 8 },
  headerTitle:       { color: "#fff", fontSize: 28, fontWeight: "800", textAlign: 'center' },
  headerSub:         { color: "rgba(255,255,255,0.75)", fontSize: 12, textAlign: "center", marginTop: 4 },
  list:              { paddingBottom: 40 },
});