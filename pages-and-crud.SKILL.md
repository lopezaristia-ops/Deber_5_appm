# SKILL: React Native App — Parte 2 y 3 (Supabase CRUD + Tamagui + Lottie)

## CONTEXTO DEL PROYECTO

Esta skill guía la implementación de las Partes 2 y 3 de una app React Native (Expo) ya existente, con autenticación previa (Parte 1 ya implementada). El objetivo es:

- **Parte 2:** CRUD completo con Supabase + cambio de contraseña
- **Parte 3:** Diseño con Tamagui + Lottie + paleta pastel degradada

> ⚠️ REGLA CRÍTICA: NO modificar archivos existentes. Solo AGREGAR nuevos archivos o EXTENDER con imports/rutas nuevas donde sea estrictamente necesario (ej: el router de navegación).

---

## TABLA EN SUPABASE (ya existente, NO crear de nuevo)

```sql
create table products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  price numeric not null,
  category text not null,
  image_url text,
  user_id uuid references auth.users(id) on delete cascade
);
```

RLS habilitado: solo usuarios autenticados pueden insertar, actualizar y eliminar. Todos pueden leer.

---

## PALETA DE COLORES (usar siempre estos tokens)

```ts
// constants/colors.ts  ← CREAR si no existe
export const PASTEL = {
  // Celeste
  blue1: '#A7D8FF',
  blue2: '#BFE6FF',
  blue3: '#D6F2FF',
  // Violeta
  purple1: '#CDB4FF',
  purple2: '#D9C7FF',
  purple3: '#E8DDFF',
  // Rosado
  pink1: '#FFB7D5',
  pink2: '#FFC7DE',
  pink3: '#FFDCEB',
  // Neutros útiles
  white: '#FFFFFF',
  text: '#3D2C5E',
  textLight: '#7B6A9A',
  card: 'rgba(255,255,255,0.75)',
};
```

Gradientes principales:
- **Fondo de pantallas:** `[#D6F2FF, #E8DDFF, #FFDCEB]` (celeste → violeta → rosado)
- **Botón primario:** `[#CDB4FF, #FFB7D5]`
- **Header/Card:** `[#BFE6FF, #D9C7FF]`

---

## DEPENDENCIAS A INSTALAR

```bash
# Supabase (si no está instalado)
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage

# Tamagui
npx expo install tamagui @tamagui/core @tamagui/config @tamagui/animations-react-native
npx expo install @tamagui/babel-plugin

# Lottie
npx expo install lottie-react-native

# Gradientes
npx expo install expo-linear-gradient

# Imágenes / picker
npx expo install expo-image-picker

# Iconos (si no están)
npx expo install @expo/vector-icons
```

### babel.config.js — SOLO agregar el plugin, no reemplazar nada:
```js
// Agregar dentro de plugins[] existente:
['@tamagui/babel-plugin', {
  components: ['tamagui'],
  config: './tamagui.config.ts',
}]
```

---

## ESTRUCTURA DE ARCHIVOS A CREAR

```
constants/
  colors.ts              ← tokens de color pastel
  supabase.ts            ← cliente Supabase

lib/
  productService.ts      ← lógica CRUD

animations/
  loading.json           ← animación Lottie (descargar de lottiefiles.com)
  success.json
  empty.json

tamagui.config.ts        ← config Tamagui con tema pastel

screens/ (o app/ si usas Expo Router)
  ProductsScreen.tsx     ← listado + botón agregar
  ProductFormScreen.tsx  ← formulario crear/editar
  ChangePasswordScreen.tsx ← cambio de contraseña
  ProductDetailScreen.tsx  ← detalle de producto (opcional pero recomendado)

components/
  ProductCard.tsx        ← tarjeta individual con gradiente
  PastelButton.tsx       ← botón reutilizable con gradiente
  PastelInput.tsx        ← input con estilo pastel
  GradientBackground.tsx ← fondo degradado reutilizable
  LoadingLottie.tsx      ← wrapper de animación carga
  EmptyState.tsx         ← estado vacío con Lottie
```

---

## ARCHIVO: constants/supabase.ts

```ts
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

> En `.env`: `EXPO_PUBLIC_SUPABASE_URL=...` y `EXPO_PUBLIC_SUPABASE_ANON_KEY=...`

---

## ARCHIVO: lib/productService.ts

```ts
import { supabase } from '../constants/supabase';

export type Product = {
  id?: string;
  title: string;
  price: number;
  category: string;
  image_url?: string;
  user_id?: string;
  created_at?: string;
};

export const productService = {
  // READ - todos pueden ver
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async getById(id: string): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  // CREATE
  async create(product: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('products')
      .insert({ ...product, user_id: user?.id })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // UPDATE
  async update(id: string, product: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // DELETE
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // CAMBIO DE CONTRASEÑA
  async changePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  },
};
```

---

## ARCHIVO: tamagui.config.ts

```ts
import { createTamagui } from 'tamagui';
import { config as defaultConfig } from '@tamagui/config/v3';
import { PASTEL } from './constants/colors';

export const config = createTamagui({
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    color: {
      ...defaultConfig.tokens.color,
      pastelBlue1: PASTEL.blue1,
      pastelBlue2: PASTEL.blue2,
      pastelPurple1: PASTEL.purple1,
      pastelPink1: PASTEL.pink1,
      pastelText: PASTEL.text,
    },
  },
  themes: {
    ...defaultConfig.themes,
    pastel: {
      background: PASTEL.blue3,
      color: PASTEL.text,
      borderColor: PASTEL.purple2,
    },
  },
});

export type AppConfig = typeof config;
declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}
```

### En App.tsx / _layout.tsx — SOLO agregar TamaguiProvider sin tocar lo demás:
```tsx
import { TamaguiProvider } from 'tamagui';
import { config } from './tamagui.config';
// Envolver el árbol existente:
<TamaguiProvider config={config}>
  {/* children existentes sin cambios */}
</TamaguiProvider>
```

---

## COMPONENTE: GradientBackground.tsx

```tsx
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, ViewStyle } from 'react-native';
import { PASTEL } from '../constants/colors';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  colors?: string[];
}

export const GradientBackground: React.FC<Props> = ({
  children,
  style,
  colors = [PASTEL.blue3, PASTEL.purple3, PASTEL.pink3],
}) => (
  <LinearGradient colors={colors} style={[styles.container, style]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
    {children}
  </LinearGradient>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
});
```

---

## COMPONENTE: ProductCard.tsx

```tsx
import React from 'react';
import { TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { YStack, XStack, Text, Card } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { PASTEL } from '../constants/colors';
import { Product } from '../lib/productService';

interface Props {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductCard: React.FC<Props> = ({ product, onEdit, onDelete }) => {
  const handleDelete = () => {
    Alert.alert('Eliminar', `¿Eliminar "${product.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => onDelete(product.id!) },
    ]);
  };

  return (
    <Card elevate bordered style={styles.card} marginBottom="$3">
      <LinearGradient colors={[PASTEL.blue2, PASTEL.purple2]} style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <XStack padding="$3" alignItems="center" gap="$3">
          {product.image_url ? (
            <Image source={{ uri: product.image_url }} style={styles.image} />
          ) : (
            <LinearGradient colors={[PASTEL.purple2, PASTEL.pink2]} style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={28} color={PASTEL.text} />
            </LinearGradient>
          )}
          <YStack flex={1}>
            <Text fontWeight="700" fontSize={16} color={PASTEL.text} numberOfLines={1}>
              {product.title}
            </Text>
            <Text fontSize={13} color={PASTEL.textLight} marginTop="$1">
              {product.category}
            </Text>
            <Text fontWeight="600" fontSize={15} color={PASTEL.purple1} marginTop="$1">
              ${product.price.toFixed(2)}
            </Text>
          </YStack>
          <XStack gap="$2">
            <TouchableOpacity onPress={() => onEdit(product)} style={styles.iconBtn}>
              <Ionicons name="pencil-outline" size={20} color={PASTEL.purple1} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.iconBtn}>
              <Ionicons name="trash-outline" size={20} color={PASTEL.pink1} />
            </TouchableOpacity>
          </XStack>
        </XStack>
      </LinearGradient>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 16, overflow: 'hidden', marginHorizontal: 16 },
  gradient: { borderRadius: 16 },
  image: { width: 60, height: 60, borderRadius: 12 },
  imagePlaceholder: { width: 60, height: 60, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  iconBtn: { padding: 6, borderRadius: 8, backgroundColor: PASTEL.white },
});
```

---

## COMPONENTE: PastelButton.tsx

```tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PASTEL } from '../constants/colors';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  colors?: string[];
  style?: ViewStyle;
  disabled?: boolean;
}

export const PastelButton: React.FC<Props> = ({
  title, onPress, loading = false,
  colors = [PASTEL.purple1, PASTEL.pink1],
  style, disabled = false,
}) => (
  <TouchableOpacity onPress={onPress} disabled={disabled || loading} style={[styles.wrapper, style]}>
    <LinearGradient colors={colors} style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
      {loading
        ? <ActivityIndicator color="#fff" />
        : <Text style={styles.text}>{title}</Text>
      }
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  wrapper: { borderRadius: 24, overflow: 'hidden' },
  btn: { paddingVertical: 14, paddingHorizontal: 28, alignItems: 'center', borderRadius: 24 },
  text: { color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 0.5 },
});
```

---

## COMPONENTE: PastelInput.tsx

```tsx
import React from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { PASTEL } from '../constants/colors';

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

export const PastelInput: React.FC<Props> = ({ label, error, style, ...props }) => (
  <View style={styles.wrapper}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, error && styles.inputError, style]}
      placeholderTextColor={PASTEL.textLight}
      {...props}
    />
    {error && <Text style={styles.error}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: PASTEL.text, marginBottom: 6, marginLeft: 4 },
  input: {
    backgroundColor: PASTEL.white,
    borderWidth: 1.5,
    borderColor: PASTEL.purple2,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: PASTEL.text,
  },
  inputError: { borderColor: PASTEL.pink1 },
  error: { fontSize: 12, color: PASTEL.pink1, marginTop: 4, marginLeft: 4 },
});
```

---

## COMPONENTE: LoadingLottie.tsx

```tsx
import React from 'react';
import LottieView from 'lottie-react-native';
import { View, StyleSheet } from 'react-native';

// Descarga animaciones gratuitas de https://lottiefiles.com
// Recomendadas: "loading dots pastel", "empty box", "success checkmark"

interface Props {
  source: object;  // require('../animations/loading.json')
  size?: number;
}

export const LoadingLottie: React.FC<Props> = ({ source, size = 120 }) => (
  <View style={styles.container}>
    <LottieView source={source} autoPlay loop style={{ width: size, height: size }} />
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: 20 },
});
```

---

## PANTALLA: ProductsScreen.tsx

```tsx
import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, SafeAreaView, StyleSheet, TouchableOpacity, View, RefreshControl } from 'react-native';
import { Text, YStack } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '../components/GradientBackground';
import { ProductCard } from '../components/ProductCard';
import { LoadingLottie } from '../components/LoadingLottie';
import { PastelButton } from '../components/PastelButton';
import { productService, Product } from '../lib/productService';
import { PASTEL } from '../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

// Adaptar la navegación según tu stack (useNavigation / router.push)
interface Props {
  navigation: any; // reemplaza con tipo correcto de tu navegador
}

export const ProductsScreen: React.FC<Props> = ({ navigation }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const handleDelete = async (id: string) => {
    await productService.delete(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleEdit = (product: Product) => {
    navigation.navigate('ProductForm', { product });
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <LinearGradient colors={[PASTEL.blue2, PASTEL.purple2]} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <Text fontSize={22} fontWeight="800" color={PASTEL.text}>🛍️ Mis Productos</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ChangePassword')} style={styles.headerBtn}>
            <Ionicons name="lock-closed-outline" size={22} color={PASTEL.text} />
          </TouchableOpacity>
        </LinearGradient>

        {loading
          ? <LoadingLottie source={require('../animations/loading.json')} />
          : (
            <FlatList
              data={products}
              keyExtractor={item => item.id!}
              renderItem={({ item }) => (
                <ProductCard product={item} onEdit={handleEdit} onDelete={handleDelete} />
              )}
              contentContainerStyle={styles.list}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadProducts(); }} />}
              ListEmptyComponent={
                <YStack alignItems="center" marginTop="$8">
                  <LoadingLottie source={require('../animations/empty.json')} size={160} />
                  <Text color={PASTEL.textLight} fontSize={16} marginTop="$3">No hay productos todavía</Text>
                </YStack>
              }
            />
          )
        }

        {/* FAB */}
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('ProductForm', { product: null })}>
          <LinearGradient colors={[PASTEL.purple1, PASTEL.pink1]} style={styles.fabGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Ionicons name="add" size={30} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 10 },
  headerBtn: { padding: 8, backgroundColor: PASTEL.white, borderRadius: 12 },
  list: { paddingTop: 12, paddingBottom: 100 },
  fab: { position: 'absolute', bottom: 28, right: 24 },
  fabGradient: { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: PASTEL.purple1, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8 },
});
```

---

## PANTALLA: ProductFormScreen.tsx

```tsx
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, YStack } from 'tamagui';
import { GradientBackground } from '../components/GradientBackground';
import { PastelButton } from '../components/PastelButton';
import { PastelInput } from '../components/PastelInput';
import { productService, Product } from '../lib/productService';
import { PASTEL } from '../constants/colors';
import LottieView from 'lottie-react-native';

interface Props {
  navigation: any;
  route: { params: { product: Product | null } };
}

export const ProductFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const editing = route.params?.product;
  const [form, setForm] = useState({
    title: editing?.title ?? '',
    price: editing?.price?.toString() ?? '',
    category: editing?.category ?? '',
    image_url: editing?.image_url ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'El título es obligatorio';
    if (!form.price || isNaN(Number(form.price))) e.price = 'Precio inválido';
    if (!form.category.trim()) e.category = 'La categoría es obligatoria';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = { title: form.title, price: parseFloat(form.price), category: form.category, image_url: form.image_url || undefined };
      if (editing) {
        await productService.update(editing.id!, payload);
      } else {
        await productService.create(payload);
      }
      setSuccess(true);
      setTimeout(() => navigation.goBack(), 1500);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.centerContainer}>
          <LottieView source={require('../animations/success.json')} autoPlay loop={false} style={styles.lottieSuccess} />
          <Text fontSize={18} fontWeight="700" color={PASTEL.text} marginTop="$4">
            {editing ? '¡Producto actualizado!' : '¡Producto creado!'}
          </Text>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text fontSize={22} fontWeight="800" color={PASTEL.text} marginBottom="$4">
            {editing ? '✏️ Editar Producto' : '✨ Nuevo Producto'}
          </Text>
          <YStack backgroundColor={PASTEL.card} borderRadius={20} padding="$4" gap="$2">
            <PastelInput label="Título" value={form.title} onChangeText={v => setForm(p => ({ ...p, title: v }))} error={errors.title} placeholder="Ej: Vestido floral" />
            <PastelInput label="Precio ($)" value={form.price} onChangeText={v => setForm(p => ({ ...p, price: v }))} error={errors.price} keyboardType="numeric" placeholder="0.00" />
            <PastelInput label="Categoría" value={form.category} onChangeText={v => setForm(p => ({ ...p, category: v }))} error={errors.category} placeholder="Ej: Ropa, Accesorios..." />
            <PastelInput label="URL de imagen (opcional)" value={form.image_url} onChangeText={v => setForm(p => ({ ...p, image_url: v }))} placeholder="https://..." />
          </YStack>
          <PastelButton title={editing ? 'Guardar cambios' : 'Crear producto'} onPress={handleSubmit} loading={loading} style={styles.btn} />
          <PastelButton title="Cancelar" onPress={() => navigation.goBack()} colors={[PASTEL.blue2, PASTEL.purple2]} style={styles.btn} />
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40 },
  btn: { marginTop: 16 },
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  lottieSuccess: { width: 180, height: 180 },
});
```

---

## PANTALLA: ChangePasswordScreen.tsx

```tsx
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Alert } from 'react-native';
import { Text, YStack } from 'tamagui';
import { GradientBackground } from '../components/GradientBackground';
import { PastelInput } from '../components/PastelInput';
import { PastelButton } from '../components/PastelButton';
import { productService } from '../lib/productService';
import { PASTEL } from '../constants/colors';
import LottieView from 'lottie-react-native';

interface Props {
  navigation: any;
}

export const ChangePasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (newPassword.length < 6) e.newPassword = 'Mínimo 6 caracteres';
    if (newPassword !== confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await productService.changePassword(newPassword);
      setSuccess(true);
      setTimeout(() => navigation.goBack(), 2000);
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
          <LottieView source={require('../animations/success.json')} autoPlay loop={false} style={styles.lottie} />
          <Text fontSize={18} fontWeight="700" color={PASTEL.text} marginTop="$4">¡Contraseña actualizada!</Text>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <YStack padding="$5" gap="$4" flex={1}>
          <Text fontSize={22} fontWeight="800" color={PASTEL.text}>🔒 Cambiar Contraseña</Text>
          <YStack backgroundColor={PASTEL.card} borderRadius={20} padding="$4" gap="$2">
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
          <PastelButton title="Actualizar contraseña" onPress={handleChange} loading={loading} />
          <PastelButton title="Volver" onPress={() => navigation.goBack()} colors={[PASTEL.blue2, PASTEL.purple2]} />
        </YStack>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  lottie: { width: 180, height: 180 },
});
```

---

## NAVEGACIÓN — Solo agregar rutas, NO reemplazar las existentes

Si usas **React Navigation** (stack), agregar en el archivo de navegación existente:
```tsx
// Solo AGREGAR estas rutas al Stack.Navigator ya existente:
<Stack.Screen name="Products" component={ProductsScreen} options={{ headerShown: false }} />
<Stack.Screen name="ProductForm" component={ProductFormScreen} options={{ headerShown: false }} />
<Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: false }} />
```

Si usas **Expo Router**, crear los archivos:
- `app/(protected)/products.tsx` → exportar `ProductsScreen`
- `app/(protected)/product-form.tsx` → exportar `ProductFormScreen`
- `app/(protected)/change-password.tsx` → exportar `ChangePasswordScreen`

---

## ANIMACIONES LOTTIE — Recursos gratuitos

Descargar de [lottiefiles.com](https://lottiefiles.com) y guardar en `/animations/`:

| Archivo | Búsqueda sugerida |
|---------|------------------|
| `loading.json` | "pastel loading dots" o "colorful loading" |
| `success.json` | "success checkmark" o "done purple" |
| `empty.json` | "empty box" o "no data" |

---

## CHECKLIST FINAL

- [ ] `.env` con `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `constants/colors.ts` creado con paleta pastel
- [ ] `constants/supabase.ts` con cliente configurado
- [ ] `tamagui.config.ts` con tema pastel
- [ ] `TamaguiProvider` envuelve el árbol en App.tsx/_layout.tsx
- [ ] Archivos Lottie `.json` descargados en `/animations/`
- [ ] CRUD funcionando: listar, crear, editar, eliminar
- [ ] Cambio de contraseña funciona con `supabase.auth.updateUser`
- [ ] Pantallas usan `GradientBackground` con colores pastel
- [ ] `ProductCard` muestra título, precio, categoría e imagen
- [ ] Validaciones en formulario
- [ ] RLS de Supabase activo (verificar en dashboard)
- [ ] Archivos existentes del proyecto NO fueron modificados
- [ ] comentame el uso de tamagui y lottie al principio de codigo
