# 📱 Cheicon – Aplicación móvil estilo red social

Cheicon es una aplicación móvil construida con **React Native (Expo)**, **NativeWind**, **Zustand** y **Expo Router**.  
Permite crear publicaciones con imágenes, ver un feed global, comentar, dar likes y administrar el perfil.  
Las imágenes se almacenan en **Cloudinary** y el backend está desplegado en **Render**, usando **autenticación JWT**.

---

## ✨ Características principales

### 🔐 Autenticación
- Registro de usuarios  
- Inicio de sesión con JWT  
- Persistencia de sesión con AsyncStorage  
- Validación automática del token al abrir la app  

### 🏠 Feed global
- Visualización de todos los posts  
- Likes en tiempo real  
- Vista completa del post con comentarios  

### 📝 Crear publicaciones
- Subida de imágenes desde la galería  
- Validación de título, descripción e imagen  
- Subida automática a Cloudinary  

### 👤 Perfil de usuario
- Vista del perfil (nombre, username, bio, avatar)  
- Edición del perfil con subida de foto  
- Estado global con Zustand para reflejar cambios de inmediato  

---

## 🛠️ Tecnologías utilizadas

### Frontend
- React Native (Expo)  
- Expo Router  
- NativeWind / TailwindCSS  
- Zustand  
- AsyncStorage  
- React Native Reanimated  

### Backend
- API REST en Render  
- Endpoints protegidos con JWT  
- Cloudinary para almacenamiento de imágenes (FormData)  

---

## 📂 Estructura del proyecto

<img width="176" height="594" alt="image" src="https://github.com/user-attachments/assets/cfcd6661-89b8-4ab4-97b6-9a4a732b3554" />

---

## ⚙️ Configuración relevante

### **package.json**
Dependencias principales: Expo, NativeWind, Zustand, Reanimated, AsyncStorage.

### **app.json**
Configuración general del proyecto: iconos, splash, paquetes Android y iOS, esquema y EAS.

### **eas.json**
Perfiles de build: development, preview, production.

### **babel.config.js**
Configuración para NativeWind.

### **metro.config.js**
Integración con global.css.

---

## 🔄 Flujo del usuario

1. La app revisa AsyncStorage para verificar sesión.  
2. Si no hay sesión se dirige a Login o Signin.  
3. Si sí hay token se valida en **/usuarios/me**.  
4. Se carga el feed.  

El usuario puede:
- Crear posts  
- Dar like  
- Ver posts completos  
- Comentar  
- Editar su perfil  

---

## ▶️ Scripts
```bash
npm start
npm run android
npm run ios
npm run web
```

### EAS Build
```bash
eas build --platform android --profile production
eas build --platform android --profile preview
eas build --platform android --profile production --local
```

