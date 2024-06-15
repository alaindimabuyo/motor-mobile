import React, { useState, useRef, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import useVehicleStore from '../store/VehicleState';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import BottomSheet from '@gorhom/bottom-sheet';

const VehicleCheckout: React.FC = () => {
  const { vehicle: vehicleParam } = useLocalSearchParams();
  const vehicle = JSON.parse(vehicleParam as string);

  const { checkoutVehicle, checkinVehicle } = useVehicleStore();
  const [name, setName] = useState('');
  const [time, setTime] = useState<Date | undefined>(undefined);
  const [condition, setCondition] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [checkoutType, setCheckoutType] = useState('loan');
  const router = useRouter();

  const isCheckout = vehicle.status === 'available';

  const handleCheckout = () => {
    if (name && time) {
      checkoutVehicle(vehicle, { name, time: time.toISOString(), type: checkoutType });
      router.back();
      setName('');
      setTime(undefined);
    }
  };

  const handleCheckin = () => {
    if (time && condition) {
      checkinVehicle(vehicle.MakeId, { returnTime: time.toISOString(), condition });
      router.back();
      setTime(undefined);
      setCondition('');
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  // Bottom sheet ref and snap points
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '30%'], []);

  const handleTypeSelection = (type: string) => {
    setCheckoutType(type);
    bottomSheetRef.current?.close();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#007bff" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.header}>{isCheckout ? 'Vehicle Form' : 'Return Form'}</Text>
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleName}>{vehicle.MakeName}</Text>
      </View>
      {isCheckout ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TouchableOpacity
            style={styles.timePickerButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.timePickerText}>
              {time ? time.toLocaleTimeString() : 'Select Time'}
            </Text>
            {showTimePicker && (
              <DateTimePicker
                value={time || new Date()}
                mode="time"
                display="default"
                onChange={onTimeChange}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => bottomSheetRef.current?.expand()}
          >
            <Text style={styles.dropdownText}>{checkoutType === 'loan' ? 'Loan' : 'Test Drive'}</Text>
            <Ionicons name="chevron-down" size={24} color="#007bff" />
          </TouchableOpacity>
          
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Condition"
            value={condition}
            onChangeText={setCondition}
          />
          <TouchableOpacity
            style={styles.timePickerButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.timePickerText}>
              {time ? time.toLocaleTimeString() : 'Select Return Time'}
            </Text>
            {showTimePicker && (
              <DateTimePicker
                value={time || new Date()}
                mode="time"
                display="default"
                onChange={onTimeChange}
              />
            )}
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity
        style={[styles.actionButton, (!time || (!isCheckout && !condition) || (isCheckout && !name)) && styles.disabledButton]}
        onPress={isCheckout ? handleCheckout : handleCheckin}
        disabled={!time || (!isCheckout && !condition) || (isCheckout && !name)}
      >
        <Text style={styles.buttonText}>{isCheckout ? 'Checkout' : 'Return Vehicle'}</Text>
      </TouchableOpacity>
      
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
      >
        <View style={styles.bottomSheetContent}>
          <TouchableOpacity style={styles.bottomSheetOption} onPress={() => handleTypeSelection('loan')}>
            <Text style={styles.bottomSheetOptionText}>Loan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomSheetOption} onPress={() => handleTypeSelection('test-drive')}>
            <Text style={styles.bottomSheetOptionText}>Test Drive</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#007bff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  vehicleLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#555',
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginLeft: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  timePickerText: {
    fontSize: 16,
    color: '#333',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderRadius: 8,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  bottomSheetContent: {
    padding: 20,
  },
  bottomSheetOption: {
    paddingVertical: 10,
    backgroundColor: '#FEFCF9',
    margin: 5,
    borderRadius: 5
  },
  bottomSheetOptionText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
});

export default VehicleCheckout;