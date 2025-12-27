
interface ImportMetaEnv {
  readonly VITE_SERVER_URI: string;
  readonly VITE_SERVER_SSL: boolean;
  readonly VITE_WS_SSL: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
