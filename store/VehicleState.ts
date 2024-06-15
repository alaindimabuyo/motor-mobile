// store/vehicleStore.ts
import {create} from 'zustand';
import axios from 'axios';

interface Vehicle {
  MakeId: number;
  MakeName: string;
  status?: 'available' | 'checked out';
  name?: string;
  time?: string;
  returnTime?: string;
  condition?: string;
  type?: string;
}

interface VehicleStore {
  vehicles: Vehicle[];
  fetchVehicles: () => Promise<void>;
  checkoutVehicle: (vehicle: Vehicle, details: { name: string; time: string; type: string }) => void;
  checkinVehicle: (vehicleId: number, details: { returnTime: string; condition: string }) => void;
}

const useVehicleStore = create<VehicleStore>(set => ({
  vehicles: [],
  fetchVehicles: async () => {
    try {
      const response = await axios.get('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json');
      set({ vehicles: response.data.Results.map((vehicle: Vehicle) => ({ ...vehicle, status: 'available' })) });
    } catch (error) {
      console.error("Error fetching vehicle data", error);
    }
  },
  checkoutVehicle: (vehicle, details) => set(state => ({
    vehicles: state.vehicles.map(v => v.MakeId === vehicle.MakeId ? { ...v, status: 'checked out', ...details } : v),
  })),
  checkinVehicle: (vehicleId, details) => set(state => ({
    vehicles: state.vehicles.map(v => v.MakeId === vehicleId ? { ...v, status: 'available', ...details } : v),
  })),
}));

export default useVehicleStore;