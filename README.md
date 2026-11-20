# Gestor Pro

**Autor:** Joelvy José Salazar Vargas (C.I. 30.022.434)  
**Copyright:** © 2026 Gestor Pro. Todos los derechos reservados. Joelvy José Salazar Vargas (C.I. 30.022.434)

## Descripción General

**Gestor Pro** es una Progressive Web App (PWA) integral para la gestión de inventario, ventas, fiados, mermas/caducidad, caja y finanzas (Arqueo Z), catálogo digital y sincronización en nube con Firebase Firestore, preparada para ejecutarse como app web instalable y empaquetarse para **Google Play Store** (TWA / WebView).

## Archivos del Paquete

- `index.html`: Panel operativo principal, POS, tickets térmicos/BT y PDF, fiados, mermas, caja Z, pedidos, ajustes, respaldos JSON y monetización.
- `catalogo.html`: Catálogo digital multilingüe (`es`, `en`, `pt`, `hi`, `id`, `ru`, `ar`, `fr`, `de`, `ja`, con `dir="rtl"` para árabe) conectado al sistema y a WhatsApp.
- `sw.js`: Service Worker con caché limpia y exclusión de endpoints externos (Firestore, AdMob, Google APIs).
- `manifest.json`: Manifiesto PWA `standalone` con iconos (`icon-192.png`, `icon-512.png`, `icon-512-maskable.png`) y accesos directos (`shortcut-venta.png`, `shortcut-catalogo.png`).
- `README.md`: Documentación técnica del proyecto.

## Notas de Configuración antes de Publicar

1. **Firebase (`gestorpro-sync-8b047`):** Completa `apiKey` y `appId` en `index.html` y `catalogo.html` (`projectId`, `authDomain`, `storageBucket` y `messagingSenderId: "644496640474"` ya están configurados).
2. **AdMob:** Configurado con `ca-app-pub-3645077961178424~5519013340` y slot `3411899761` (bono Pro de 6 horas).
3. **Google Play Billing:** Completa `GOOGLE_BILLING_CONFIG.monthlyProductId` y `GOOGLE_BILLING_CONFIG.annualProductId` en `index.html` para conectar con `window.AndroidBilling` o `getDigitalGoodsService`.
