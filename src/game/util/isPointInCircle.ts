export default (
  point: { a: number; b: number },
  center: { a: number; b: number },
  radius: number
): boolean => {
  return (
    Math.pow(point.a - center.a, 2) + Math.pow(point.b - center.b, 2) <
    Math.pow(radius, 2)
  );
};
