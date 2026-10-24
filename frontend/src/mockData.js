/**
 * Campus Parking Slot Reservation System - Shared Mock Data
 * Phase: Design-Only Phase (Frontend Dummy Data)
 * 
 * Rules:
 * - Members 2 to 5 use this hard-coded dummy data for page design.
 * - Do not make real API calls yet.
 * - Entities & status badges match the draw.io schema specifications.
 */

// 1. PROFILES
export const mockProfiles = [
  {
    id: "usr_001",
    full_name: "Landis Angelo Tarro",
    campus_id: "2022-00123",
    email: "landis.tarro@campus.edu.ph",
    phone: "09171234567",
    role: "admin", // 'student' | 'staff' | 'admin'
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Landis",
    created_at: "2026-01-10T08:00:00Z"
  },
  {
    id: "usr_002",
    full_name: "Juan Saavedra",
    campus_id: "2022-00456",
    email: "juan.saavedra@campus.edu.ph",
    phone: "09181234567",
    role: "student",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan",
    created_at: "2026-01-15T09:30:00Z"
  },
  {
    id: "usr_003",
    full_name: "Maria Alavera",
    campus_id: "2023-00789",
    email: "maria.alavera@campus.edu.ph",
    phone: "09191234568",
    role: "student",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    created_at: "2026-02-01T10:15:00Z"
  },
  {
    id: "usr_004",
    full_name: "Ahmad Munjilul",
    campus_id: "2021-00321",
    email: "ahmad.munjilul@campus.edu.ph",
    phone: "09201234569",
    role: "staff",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
    created_at: "2026-02-05T11:00:00Z"
  },
  {
    id: "usr_005",
    full_name: "Carlo Javier",
    campus_id: "2023-00654",
    email: "carlo.javier@campus.edu.ph",
    phone: "09211234570",
    role: "student",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlo",
    created_at: "2026-02-10T14:20:00Z"
  },
  {
    id: "usr_006",
    full_name: "Bea Espiritu",
    campus_id: "2022-00987",
    email: "bea.espiritu@campus.edu.ph",
    phone: "09221234571",
    role: "admin",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bea",
    created_at: "2026-02-12T16:45:00Z"
  }
];

// Current logged-in mock user (switch id to test different roles)
export const mockCurrentUser = mockProfiles[1]; // student by default

// 2. VEHICLES
export const mockVehicles = [
  {
    id: "veh_001",
    owner_id: "usr_002",
    plate_number: "ABC-1234",
    type: "car", // 'car' | 'motorcycle' | 'bicycle' | 'pwd'
    make: "Toyota",
    model: "Vios 2021",
    color: "Silver",
    verification: "approved", // 'pending' | 'approved' | 'rejected'
    rejection_reason: null,
    verified_by: "usr_001",
    created_at: "2026-02-15T08:30:00Z"
  },
  {
    id: "veh_002",
    owner_id: "usr_002",
    plate_number: "MC-5678",
    type: "motorcycle",
    make: "Yamaha",
    model: "NMAX 155",
    color: "Matte Black",
    verification: "pending",
    rejection_reason: null,
    verified_by: null,
    created_at: "2026-03-01T09:00:00Z"
  },
  {
    id: "veh_003",
    owner_id: "usr_003",
    plate_number: "XYZ-9876",
    type: "car",
    make: "Honda",
    model: "City 2022",
    color: "Modern Steel",
    verification: "rejected",
    rejection_reason: "Expired OR/CR uploaded. Please submit current vehicle registration.",
    verified_by: "usr_006",
    created_at: "2026-02-20T11:20:00Z"
  },
  {
    id: "veh_004",
    owner_id: "usr_004",
    plate_number: "PWD-0012",
    type: "pwd",
    make: "Mitsubishi",
    model: "Xpander",
    color: "White",
    verification: "approved",
    rejection_reason: null,
    verified_by: "usr_001",
    created_at: "2026-02-18T13:45:00Z"
  },
  {
    id: "veh_005",
    owner_id: "usr_005",
    plate_number: "BIKE-2024",
    type: "bicycle",
    make: "Giant",
    model: "Escape 3",
    color: "Blue",
    verification: "approved",
    rejection_reason: null,
    verified_by: "usr_006",
    created_at: "2026-03-02T10:00:00Z"
  }
];

// 3. PARKING ZONES
export const mockZones = [
  {
    id: "zone_001",
    name: "Zone A - Engineering Building",
    location: "North Campus, beside CEA Building",
    description: "Designated 4-wheel vehicle slots with roof shade.",
    capacity: 20,
    allowed_vehicle: "car", // 'car' | 'motorcycle' | 'bicycle' | 'pwd'
    is_active: true
  },
  {
    id: "zone_002",
    name: "Zone B - Student Activity Center",
    location: "South Campus, near Gym",
    description: "Dedicated motorcycle parking bays with CCTV coverage.",
    capacity: 40,
    allowed_vehicle: "motorcycle",
    is_active: true
  },
  {
    id: "zone_003",
    name: "Zone C - Main Admin & Library",
    location: "Central Oval, front of Admin Building",
    description: "Priority and PWD accessible parking slots.",
    capacity: 10,
    allowed_vehicle: "pwd",
    is_active: true
  },
  {
    id: "zone_004",
    name: "Zone D - Eco Trail Bike Rack",
    location: "East Gate, near Sports Complex",
    description: "Secure bicycle racks with wheel locks.",
    capacity: 30,
    allowed_vehicle: "bicycle",
    is_active: true
  }
];

// 4. PARKING SLOTS
export const mockSlots = [
  // Zone A Slots (Car)
  { id: "slot_A01", zone_id: "zone_001", slot_code: "A-01", status: "active" },
  { id: "slot_A02", zone_id: "zone_001", slot_code: "A-02", status: "active" },
  { id: "slot_A03", zone_id: "zone_001", slot_code: "A-03", status: "active" },
  { id: "slot_A04", zone_id: "zone_001", slot_code: "A-04", status: "maintenance" },
  { id: "slot_A05", zone_id: "zone_001", slot_code: "A-05", status: "active" },
  { id: "slot_A06", zone_id: "zone_001", slot_code: "A-06", status: "disabled" },

  // Zone B Slots (Motorcycle)
  { id: "slot_B01", zone_id: "zone_002", slot_code: "B-01", status: "active" },
  { id: "slot_B02", zone_id: "zone_002", slot_code: "B-02", status: "active" },
  { id: "slot_B03", zone_id: "zone_002", slot_code: "B-03", status: "active" },
  { id: "slot_B04", zone_id: "zone_002", slot_code: "B-04", status: "active" },

  // Zone C Slots (PWD)
  { id: "slot_C01", zone_id: "zone_003", slot_code: "C-01 (PWD)", status: "active" },
  { id: "slot_C02", zone_id: "zone_003", slot_code: "C-02 (PWD)", status: "active" },

  // Zone D Slots (Bicycle)
  { id: "slot_D01", zone_id: "zone_004", slot_code: "D-01", status: "active" },
  { id: "slot_D02", zone_id: "zone_004", slot_code: "D-02", status: "active" }
];

// 5. RESERVATIONS
export const mockReservations = [
  {
    id: "res_001",
    user_id: "usr_002",
    vehicle_id: "veh_001",
    slot_id: "slot_A01",
    start_time: "2026-10-12T08:00:00Z",
    end_time: "2026-10-12T12:00:00Z",
    status: "reserved", // 'reserved' | 'occupied' | 'completed' | 'expired' | 'cancelled'
    created_at: "2026-10-11T09:00:00Z"
  },
  {
    id: "res_002",
    user_id: "usr_004",
    vehicle_id: "veh_004",
    slot_id: "slot_C01",
    start_time: "2026-10-11T07:30:00Z",
    end_time: "2026-10-11T16:00:00Z",
    status: "occupied",
    created_at: "2026-10-10T14:30:00Z"
  },
  {
    id: "res_003",
    user_id: "usr_002",
    vehicle_id: "veh_001",
    slot_id: "slot_A02",
    start_time: "2026-10-09T08:00:00Z",
    end_time: "2026-10-09T11:00:00Z",
    status: "completed",
    created_at: "2026-10-08T10:00:00Z"
  },
  {
    id: "res_004",
    user_id: "usr_005",
    vehicle_id: "veh_005",
    slot_id: "slot_D01",
    start_time: "2026-10-08T09:00:00Z",
    end_time: "2026-10-08T12:00:00Z",
    status: "cancelled",
    created_at: "2026-10-08T08:15:00Z"
  },
  {
    id: "res_005",
    user_id: "usr_003",
    vehicle_id: "veh_003",
    slot_id: "slot_A03",
    start_time: "2026-10-05T13:00:00Z",
    end_time: "2026-10-05T17:00:00Z",
    status: "expired",
    created_at: "2026-10-05T10:00:00Z"
  }
];

// Helper: Standard Status Badge Colors (Agreed across all pages)
export const STATUS_COLORS = {
  // Verification statuses
  pending: { bg: "#FEF9C3", text: "#854D0E", border: "#FDE047", label: "Pending" }, // Yellow
  approved: { bg: "#DCFCE7", text: "#166534", border: "#86EFAC", label: "Approved" }, // Green
  rejected: { bg: "#FEE2E2", text: "#991B1B", border: "#FCA5A5", label: "Rejected" }, // Red
  
  // Reservation statuses
  reserved: { bg: "#DBEAFE", text: "#1E40AF", border: "#93C5FD", label: "Reserved" }, // Blue / Orange
  occupied: { bg: "#F3E8FF", text: "#6B21A8", border: "#D8B4FE", label: "Occupied" }, // Purple
  completed: { bg: "#DCFCE7", text: "#166534", border: "#86EFAC", label: "Completed" }, // Green
  cancelled: { bg: "#FEE2E2", text: "#991B1B", border: "#FCA5A5", label: "Cancelled" }, // Red
  expired: { bg: "#F3F4F6", text: "#374151", border: "#D1D5DB", label: "Expired" } // Gray
};

// Helper: Standard vehicle icons / types
export const VEHICLE_TYPES = [
  { value: "car", label: "Car (4-Wheels)" },
  { value: "motorcycle", label: "Motorcycle" },
  { value: "bicycle", label: "Bicycle" },
  { value: "pwd", label: "PWD Accessible" }
];
