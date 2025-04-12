/// <reference types="vite/client" />

// eslint-disable-next-line spaced-comment
declare module '*.vue' {
  import { defineComponent } from 'vue';
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}
