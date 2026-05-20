# Configuración de Supabase para Product Images

## Pasos para configurar el almacenamiento de imágenes:

### 1. Crear el Bucket en Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. En el menú lateral, selecciona **Storage**
3. Haz clic en **Create a new bucket**
4. Nombre del bucket: `product-images`
5. Deja la opción "Public bucket" activada para permitir descargas públicas
6. Haz clic en **Create bucket**

### 2. Configurar RLS (Row Level Security) para el Bucket

1. Haz clic en el bucket `product-images`
2. Ve a la pestaña **Policies**
3. Haz clic en **New Policy**
4. Selecciona **For authenticated users**
5. En la template, selecciona: **Enable insert, update, and delete for users based on user_id**
6. En "Allowed columns", asegúrate de que permite cualquier columna
7. Haz clic en **Review** y luego **Save policy**

### 3. Configurar Política de Lectura Pública

1. Haz clic en **New Policy**
2. Selecciona **For public access**
3. Selecciona: **Enable read access for all users**
4. Haz clic en **Review** y luego **Save policy**

## Tabla de Base de Datos - Actualizar Schema

Si aún no lo has hecho, asegúrate de que tu tabla `products` tenga la columna `description`:

```sql
ALTER TABLE products 
ADD COLUMN description TEXT DEFAULT '';
```

## Resultado

Después de estos pasos:
- ✅ Usuarios autenticados pueden subir fotos
- ✅ Las fotos se guardan en Supabase Storage
- ✅ Las fotos son públicas y accesibles
- ✅ Los productos muestran la descripción
- ✅ La categoría es un selector con opciones específicas
- ✅ El título no puede contener números
- ✅ Los botones tienen borde lila
- ✅ Las pantallas tienen padding adecuado
