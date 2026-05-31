// vite-plugin-glsl turns shader imports into strings.
declare module '*.glsl' {
  const value: string
  export default value
}
declare module '*.vert.glsl' {
  const value: string
  export default value
}
declare module '*.frag.glsl' {
  const value: string
  export default value
}
declare module '*.vert' {
  const value: string
  export default value
}
declare module '*.frag' {
  const value: string
  export default value
}
