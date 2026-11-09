# Surra de Pagode — Aplicativo instalável

Este projeto possui Web App Manifest, service worker com cache de assets e página offline, CTA de instalação no site e integração com Instagram oficial. É uma **PWA** (instalação via navegador Android), não um app já publicado na Google Play Store.

## Próximos passos para Google Play

1. Aprovação do grupo para identidade e publicação oficial.
2. Conferir assets quadrados 192x192 e 512x512 em PNG, screenshots, política de privacidade, conteúdo e classificação etária.
3. Construir TWA (Trusted Web Activity) com Bubblewrap/PWABuilder, validar Digital Asset Links na Vercel, assinar AAB com chave de release armazenada com segurança.
4. Abrir/usar conta Google Play Console com acesso autorizado; executar testes exigidos e submeter para revisão.
5. Confirmar propriedade de marca, música e direitos sobre conteúdo divulgado.

A PWA precisa da internet para agenda e vídeos; o offline mostra uma página de orientação, sem inventar dados.
