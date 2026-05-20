import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system/legacy';

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const BASE64_LOOKUP: Record<string, number> = BASE64_CHARS.split('').reduce((acc, char, idx) => {
  acc[char] = idx;
  return acc;
}, {} as Record<string, number>);

const base64ToUint8Array = (base64: string): Uint8Array => {
  const sanitized = base64.replace(/[^A-Za-z0-9+/=]/g, '');
  const length = sanitized.length;
  const placeholders = sanitized.endsWith('==') ? 2 : sanitized.endsWith('=') ? 1 : 0;
  const bytesLength = (length * 3) / 4 - placeholders;
  const bytes = new Uint8Array(bytesLength);

  let byteIndex = 0;
  for (let i = 0; i < length; i += 4) {
    const enc1 = BASE64_LOOKUP[sanitized.charAt(i)];
    const enc2 = BASE64_LOOKUP[sanitized.charAt(i + 1)];
    const enc3 = BASE64_LOOKUP[sanitized.charAt(i + 2)];
    const enc4 = BASE64_LOOKUP[sanitized.charAt(i + 3)];

    const chr1 = (enc1 << 2) | (enc2 >> 4);
    const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    const chr3 = ((enc3 & 3) << 6) | enc4;

    bytes[byteIndex++] = chr1;
    if (enc3 !== 64 && byteIndex < bytesLength) bytes[byteIndex++] = chr2;
    if (enc4 !== 64 && byteIndex < bytesLength) bytes[byteIndex++] = chr3;
  }

  return bytes;
};

export type Product = {
  id?: string;
  title: string;
  price: number;
  category: string;
  description?: string;
  image_url?: string;
  user_id?: string;
  created_at?: string;
};

export const productService = {
  // UPLOAD IMAGE
  async uploadImage(imageUri: string, fileName: string): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autorizado');

    const getArrayBufferFromUri = async (uri: string): Promise<{ buffer: ArrayBuffer; contentType: string }> => {
      if (uri.startsWith('data:')) {
        const match = uri.match(/^data:([^;]+);base64,(.*)$/);
        if (!match) throw new Error('Invalid base64 image data');
        const [, mime, base64] = match;
        const uint8 = base64ToUint8Array(base64);
        return {
          buffer: uint8.buffer as ArrayBuffer,
          contentType: mime,
        };
      }

      if (uri.startsWith('file:') || uri.startsWith('content:') || uri.startsWith('/')) {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const uint8 = base64ToUint8Array(base64);
        return {
          buffer: uint8.buffer as ArrayBuffer,
          contentType: 'image/jpeg',
        };
      }

      const response = await fetch(uri);
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      return {
        buffer: await response.arrayBuffer(),
        contentType,
      };
    };

    const { buffer, contentType } = await getArrayBufferFromUri(imageUri);
    const path = `${user.id}/${Date.now()}_${fileName}`;
    const { error } = await supabase.storage
      .from('product-images')
      .upload(path, buffer, {
        contentType,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(path);

    return urlData.publicUrl;
  },

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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autorizado');

    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .eq('user_id', user.id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error('No autorizado');
    }
    return data[0];
  },

  // DELETE
  async delete(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autorizado');

    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error('No autorizado');
    }
  },

  // CAMBIO DE CONTRASEÑA
  async changePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  },
};
