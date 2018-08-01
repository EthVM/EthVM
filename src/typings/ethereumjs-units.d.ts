declare module 'ethereumjs-units' {
  namespace Units {
    export function convert(value: string, fromUnit: string, destinationUnit: string): string
    export function lazyConvert(from: string, destinationUnit: string): string
  }
  export default Units
}
