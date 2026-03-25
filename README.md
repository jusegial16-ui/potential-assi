# Mi Día (MVP funcional)

App mobile-first construida con **Expo + React Native + TypeScript**.
Funciona 100% local con SQLite y notificaciones locales, sin depender de servicios pagos.

## Stack

- Expo + React Native
- Expo Router
- Zustand (estado global)
- Expo SQLite (persistencia local)
- Expo Notifications (recordatorios)
- React Hook Form + Zod (formularios y validación)

## Arquitectura

```txt
app/                  # Rutas y pantallas (Expo Router)
  (tabs)/             # Home, tareas, recordatorios, metas, historial, ajustes
  entry/              # Crear entrada y detalle
src/
  components/         # UI reutilizable
  constants/          # Tema y categorías
  db/                 # Repositorios de persistencia por plataforma (native/web)
  hooks/              # Bootstrap y búsqueda
  services/           # Persistencia y notificaciones
  store/              # Estado global y casos de uso
  utils/              # Parser de texto, fechas relativas, resúmenes
  validators/         # Esquemas Zod
  types/              # Modelos TypeScript
```

## Funcionalidades incluidas (MVP)

- Onboarding breve.
- Dashboard con resumen diario/semanal, tareas, metas, recordatorios y última entrada.
- Nueva entrada en lenguaje natural con extracción de tareas/metas/recordatorios.
- Confirmación/edición básica de detectado antes de guardar.
- Tareas: crear manualmente y completar/reabrir.
- Recordatorios: crear manualmente y programar notificación local.
- Metas: crear y actualizar progreso visual.
- Historial por fecha (lista cronológica + vista mensual simple).
- Búsqueda por texto en entradas/tareas/recordatorios/metas.
- Privacidad básica con PIN local opcional.
- Seed local para probar rápido.

## Parser local (fallback sin IA externa)

Detecta reglas simples:

- Recordatorios: `recuérdame`, `no olvidar`, `acuérdate de`
- Metas: `quiero`, `mi meta es`, `este año quiero`, `quiero empezar a`
- Tareas: verbos accionables (`llamar`, `pagar`, `comprar`, `enviar`, `estudiar`, `revisar`)
- Fechas relativas: `hoy`, `mañana`, `pasado mañana`, `el viernes`, `próxima semana`

## Instalación

1. Instala Node 18+.
2. Instala dependencias:

```bash
npm install
```

3. Ejecuta en desarrollo:

```bash
npm run start
```

4. Abre en Expo Go o simulador:

- `a` para Android
- `i` para iOS (macOS)
- `w` para web

## Comandos útiles

```bash
npm run typecheck
npm run lint
```

## Notas

- En iOS/Android los datos se guardan en SQLite local (`mi-dia.db`).
- En web/Codespaces los datos se guardan en `localStorage` mediante adapter web.
- Si activas PIN, se guarda de forma local (MVP).
- El proyecto queda listo para agregar sincronización futura (capa `services`).

## Fase 2 sugerida

1. UI de calendario mensual real (grid interactivo por día).
2. Editor completo de entidades detectadas (fechas/prioridad/repetición).
3. Reglas NLP más robustas o adapter IA opcional.
4. Cifrado local de base de datos y PIN con hash seguro.
5. Sincronización opcional con backend + resolución de conflictos.
