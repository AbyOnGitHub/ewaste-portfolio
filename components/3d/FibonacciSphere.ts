export interface SpherePoint {
  x: number;
  y: number;
  z: number;
  lat: number;
  lng: number;
}

/**
 * Converts Latitude & Longitude to 3D Cartesian coordinates (x, y, z) on a sphere of radius R
 */
export function latLngToVector3(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z];
}

/**
 * Distributes N points evenly across a sphere of given radius using Fibonacci spiral algorithm
 */
export function generateFibonacciSpherePoints(count: number, radius: number = 2): SpherePoint[] {
  const points: SpherePoint[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle in radians

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
    const r = Math.sqrt(1 - y * y); // radius at y
    const theta = phi * i;

    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;

    // Calculate approximate lat & lng from Cartesian coordinates
    const lat = Math.asin(y) * (180 / Math.PI);
    const lng = Math.atan2(z, -x) * (180 / Math.PI);

    points.push({
      x: x * radius,
      y: y * radius,
      z: z * radius,
      lat,
      lng,
    });
  }

  return points;
}
