export default interface Mouse {
  x: number;
  y: number;
  clicked: boolean;
  update(x: number, y: number): void;
}