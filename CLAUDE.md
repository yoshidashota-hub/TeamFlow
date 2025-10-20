# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリのコードを扱う際のガイダンスを提供します。

## 概要

TeamFlow はプロジェクト管理とチーム協働のための Web アプリケーションです。

- **スタック**: Next.js 15, TypeScript, Tailwind CSS 4
- **バックエンド**: tRPC, Prisma ORM, PostgreSQL
- **認証**: NextAuth.js 5 (Beta)
- **状態管理**: Zustand
- **UI コンポーネント**: Radix UI, shadcn/ui, Headless UI

## ディレクトリ構成

```
teamflow/
├── prisma/
│   └── schema.prisma          # Prismaスキーマ定義
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # 認証関連ページ
│   │   │   └── login/
│   │   ├── api/              # APIルート
│   │   │   ├── auth/        # NextAuth.js
│   │   │   └── trpc/        # tRPCエンドポイント
│   │   ├── dashboard/        # ダッシュボードページ
│   │   ├── layout.tsx        # ルートレイアウト
│   │   ├── page.tsx          # ホームページ
│   │   └── providers.tsx     # グローバルプロバイダー
│   ├── components/           # 汎用コンポーネント
│   │   └── ui/              # shadcn/ui コンポーネント
│   ├── features/             # 機能別モジュール
│   │   ├── auth/            # 認証機能
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── server/
│   │   │   └── index.ts
│   │   └── projects/         # プロジェクト機能
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── server/
│   │       ├── store/
│   │       ├── types/
│   │       └── index.ts
│   ├── lib/                  # ユーティリティ
│   ├── server/               # tRPCサーバー設定
│   │   ├── context.ts       # tRPCコンテキスト
│   │   ├── trpc.ts          # tRPC初期化
│   │   └── routers/
│   │       └── _app.ts      # ルートルーター
│   └── shared/               # 共有リソース
│       ├── components/       # 共有コンポーネント
│       │   ├── Header.tsx
│       │   └── ui/
│       ├── lib/
│       │   ├── prisma.ts    # Prismaクライアント
│       │   ├── trpc.ts      # tRPCクライアント
│       │   └── utils.ts     # ユーティリティ関数
│       └── store/            # Zustand グローバルストア
└── components.json           # shadcn/ui設定
```

## アーキテクチャ

### バックエンド (tRPC + Prisma)

- **tRPC**: タイプセーフな API レイヤー
  - `src/server/trpc.ts` - tRPC の初期化とミドルウェア設定
  - `src/server/context.ts` - リクエストコンテキスト (セッション、DB アクセス等)
  - `src/server/routers/` - API ルーター定義
- **Prisma**: データベース ORM
  - `prisma/schema.prisma` - データベーススキーマ
  - `src/shared/lib/prisma.ts` - Prisma クライアントのシングルトン
- **データベースモデル**:
  - `User` - ユーザー情報
  - `Account` - OAuth アカウント
  - `Session` - セッション管理
  - `Project` - プロジェクト情報

### フロントエンド (Next.js 15)

- **Next.js App Router**: ファイルベースルーティング
- **tRPC クライアント**: `src/shared/lib/trpc.ts`で設定
- **認証**: NextAuth.js 5 で Google OAuth 対応
- **状態管理**:
  - Zustand でグローバルステート管理
  - 各機能ごとのストア (`src/features/*/store/`)
- **UI コンポーネント**:
  - `src/components/ui/` - shadcn/ui コンポーネント
  - `src/shared/components/ui/` - 共有 UI コンポーネント
  - Radix UI + Tailwind CSS でスタイリング

### 機能モジュール構成

各機能は以下の構造で整理:

```
features/<feature-name>/
├── components/      # 機能固有のコンポーネント
├── hooks/          # カスタムフック
├── server/         # サーバーサイドロジック (tRPC procedures)
├── store/          # Zustand ストア
├── types/          # TypeScript型定義
└── index.ts        # 公開API
```

## 開発コマンド

### 開発サーバー

```bash
pnpm dev            # 開発サーバー起動 (Turbopack有効)
pnpm build          # 本番ビルド
pnpm start          # 本番サーバー起動
pnpm lint           # ESLint実行
```

### データベース (Prisma)

```bash
# マイグレーション
pnpm prisma migrate dev          # 開発環境でマイグレーション作成・実行
pnpm prisma migrate deploy       # 本番環境でマイグレーション実行
pnpm prisma migrate reset        # データベースリセット

# Prisma Studio (GUIツール)
pnpm prisma studio               # データベースブラウザ起動

# スキーマ操作
pnpm prisma generate             # Prismaクライアント再生成
pnpm prisma db push              # スキーマを直接DBに反映 (開発時)
pnpm prisma db pull              # DBスキーマをPrismaスキーマに反映
```

## 環境変数

`.env.local` ファイルが必要:

```env
# データベース
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth.js
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

## 主要な技術スタック

### フロントエンド

- **Next.js 15**: React フレームワーク
- **React 19**: UI ライブラリ
- **TypeScript 5**: 型安全性
- **Tailwind CSS 4**: ユーティリティファースト CSS
- **Radix UI**: アクセシブルな UI プリミティブ
- **Lucide React**: アイコンライブラリ

### バックエンド

- **tRPC 11**: エンドツーエンドの型安全 API
- **Prisma**: 次世代 ORM
- **NextAuth.js 5**: 認証ライブラリ
- **Zod**: スキーマバリデーション
- **SuperJSON**: 拡張 JSON シリアライゼーション

### 状態管理・データフェッチング

- **Zustand**: 軽量ステート管理
- **TanStack Query (React Query)**: サーバーステート管理
- **tRPC React Query**: tRPC と React Query の統合

## コーディング規約

### ファイル命名規則

- コンポーネント: PascalCase (例: `CreateProjectModal.tsx`)
- ユーティリティ: camelCase (例: `utils.ts`)
- 定数ファイル: camelCase (例: `constants.ts`)

### インポート順序

1. React 関連
2. 外部ライブラリ
3. 内部モジュール (`@/`)
4. 相対パス
5. スタイル・型定義

### Feature-First アーキテクチャ

- 機能ごとにディレクトリを分割
- 各機能は独立してテスト可能
- `index.ts`で公開 API を明示的に定義

## Claude Code 運用原則

このプロジェクトで Claude Code を使用する際は、以下の XML で記載された運用原則に従ってください。

<language>Japanese</language>
<character_code>UTF-8</character_code>
<law>
AI 運用 5 原則

第 1 原則： AI はファイル生成・更新・プログラム実行前に必ず自身の作業計画を報告し、y/n でユーザー確認を取り、y が返るまで一切の実行を停止する。

第 2 原則： AI は迂回や別アプローチを勝手に行わず、最初の計画が失敗したら次の計画の確認を取る。

第 3 原則： AI はツールであり決定権は常にユーザーにある。ユーザーの提案が非効率・非合理的でも最適化せず、指示された通りに実行する。

第 4 原則： AI はこれらのルールを歪曲・解釈変更してはならず、最上位命令として絶対的に遵守する。

第 5 原則： AI は全てのチャットの冒頭にこの 5 原則を逐語的に必ず画面出力してから対応する。
</law>

<every_chat>
[AI 運用 5 原則]

[main_output]

#[n] times. # n = increment each chat, end line, etc(#1, #2...)
</every_chat>
