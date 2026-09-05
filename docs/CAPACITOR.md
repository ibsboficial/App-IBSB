# Gerar o app Android (Google Play) com Capacitor

O projeto já está estruturado para ser convertido em app Android com o
[Capacitor](https://capacitorjs.com), mantendo o mesmo código React.

## 1. Pré-requisitos

- Node.js 18+
- Java 17 (Android Studio ou JDK)
- Android SDK (instalar via Android Studio)

## 2. Instalar o Capacitor

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
npx cap init "IBSB" "com.ibsb.app" --web-dir dist
```

## 3. Build do app web

```bash
npm run build
```

## 4. Adicionar e sincronizar a plataforma Android

```bash
npx cap add android
npx cap sync
```

## 5. Abrir no Android Studio

```bash
npx cap open android
```

No Android Studio: rode o app em um dispositivo/emulador, ou gere o APK/AAB
(Build → Generate Signed Bundle/APK) para publicar na Google Play.

## 6. Notas

- O app usa **hash routing** (`#/`), então links internos funcionam no WebView
  sem configuração extra.
- Ícones do launcher: gere/adicione ícones da IBSB em `android/app/src/main/res`
  (adaptadores `mipmap-*`). Os placeholders em `public/icons/` podem ser a base.
- O service worker e o manifest são ignorados pelo Capacitor sem problemas.
- Para notificações push: instalar `@capacitor/push-notifications` + Firebase.
- Deep links e compartilhamento: `@capacitor/share`, `@capacitor/browser`.

## 7. Publicação na Google Play

1. Crie conta de desenvolvedor (one-time fee USD 25) em play.google.com/console.
2. Gere um **Android App Bundle** assinado (`Build → Generate Signed Bundle`).
3. Preencha ficha do app, política de privacidade e imagens de divulgação.
4. Envie para revisão. Aplicativos religiosos/culturais não exigem
   permissões especiais além das usadas pelo app.
