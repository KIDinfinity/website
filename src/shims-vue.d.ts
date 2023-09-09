/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module 'three';
declare module 'three/examples/jsm/controls/OrbitControls.js';
declare module '*.glsl' {
  const value: string
  export default value
}