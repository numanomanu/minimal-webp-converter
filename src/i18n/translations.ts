export type Language = 'en' | 'ja';

export const translations = {
    en: {
        title: "WebP Converter",
        subtitle: "Minimal. Fast. Local.",
        dropzone_main: "Drag & Drop images",
        dropzone_sub: "or click to browse",
        supports_text: "Supports JPG, PNG, GIF, BMP... -> WebP",
        privacy_note: "Privacy focused. Your images never leave your device.",
        save_button: "Save",
        result_hint: "Result available. Long press image to save.",
        meta_description: "Convert JPG, PNG, GIF files to WebP locally. Fast, secure, and privacy-focused client-side converter.",
        error: "Error",
        converting: "Converting...",
        download: "Download"
    },
    ja: {
        title: "軽量画像コンバーター",
        subtitle: "シンプル、高速、ローカル完結",
        dropzone_main: "画像をドラッグ＆ドロップ",
        dropzone_sub: "またはクリックして選択",
        supports_text: "JPG, PNG, GIF, BMP... -> WebP 対応",
        privacy_note: "プライバシー重視。画像はデバイスからサーバーには送信されません。ブラウザ上で変換されます",
        save_button: "保存",
        result_hint: "変換完了。長押しで画像を保存できます。",
        meta_description: "JPG, PNG, GIF画像をブラウザ上でWebPに変換。高速・安全・インストール不要のクライアントサイド変換ツール。",
        error: "エラー",
        converting: "変換中...",
        download: "ダウンロード"
    }
} as const;

export type TranslationKey = keyof typeof translations.en;
