export const STORAGE_KEY = 'campuspark_vehicles_v1';

export function createId() {
  return 'vehicle_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function getVehicles() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (Array.isArray(saved)) {
      return saved;
    }
  } catch (error) {
    console.error('Unable to load demo vehicles:', error);
  }

  const examples = [
    {
      id: createId(),
      type: 'Sedan',
      make: 'Toyota',
      model: 'Vios',
      color: 'White',
      plate: 'ABC 1234',
      owner: 'Student Demo',
      documentRef: 'DEMO-001',
      status: 'Verified',
      reason: '',
      createdAt: new Date().toISOString()
    },
    {
      id: createId(),
      type: 'Motorcycle',
      make: 'Honda',
      model: 'Click 125',
      color: 'Black',
      plate: 'XYZ 5678',
      owner: 'Student Demo',
      documentRef: 'DEMO-002',
      status: 'Pending',
      reason: '',
      createdAt: new Date().toISOString()
    }
  ];

  saveVehicles(examples);
  return examples;
}

export function saveVehicles(vehicles) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
}

export function vehicleIcon(type) {
  return type === 'Motorcycle' ? '🏍️' : '🚘';
}

export function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }
  return date.toLocaleDateString();
}
