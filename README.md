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
### App Screen Shots
<p align="center">
  <img src="https://github.com/user-attachments/assets/dc79d93b-88c5-4331-a3dd-c6f69f17e1d6" width="220"/>
  <img src="https://github.com/user-attachments/assets/53697095-cf18-4c35-b4ad-af9ff6f11c29" width="220"/>
  <img src="https://github.com/user-attachments/assets/97b694a4-d51c-469d-aa34-fcd9b87311ae" width="220"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/d59fa58c-512d-4092-a9e9-976142e4158d" width="220"/>
  <img src="https://github.com/user-attachments/assets/a7700d99-8368-491f-bd17-b019decb8648" width="220"/>
  <img src="https://github.com/user-attachments/assets/059c3ace-1f71-4bd7-98bb-bab86cc127c6" width="220"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/68f48e09-d14b-49a3-a5bc-805fc8e5e7bd" width="220"/>
  <img src="https://github.com/user-attachments/assets/4241649c-0750-46b7-8302-1ff654979ee9" width="220"/>
</p>
