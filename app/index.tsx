// components/VehicleList.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import useVehicleStore from '../store/VehicleState';
import { Ionicons } from '@expo/vector-icons';

const VehicleList: React.FC = () => {
  const { vehicles, fetchVehicles } = useVehicleStore();
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 10;
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    fetchVehicles();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = vehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Motor Platform</Text>
      <Animated.FlatList
        style={{ opacity: fadeAnim }}
        data={currentVehicles}
        keyExtractor={(item) => item.MakeId.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View
            style={[
              styles.vehicleItem,
              item.status === 'available' ? styles.itemAvailable : styles.itemCheckedOut,
            ]}
          >
            <View style={styles.vehicleDetails}>
              {item.status === 'available' ? (
                <Ionicons name="checkmark-circle" size={20} color="green" />
              ) : (
                <Ionicons name="close-circle" size={20} color="red" />
              )}
              <Text
                style={[
                  styles.vehicleName,
                  item.status !== 'available' && styles.vehicleNameUnavailable,
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.MakeName}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.selectButton,
                item.status === 'available' ? styles.buttonAvailable : styles.buttonCheckedOut,
              ]}
              onPress={() =>
                router.push({
                  pathname: 'vehicle-checkout',
                  params: { vehicle: JSON.stringify(item), isCheckin: (item.status !== 'available').toString() },
                })
              }
            >
              <Text style={styles.buttonText}>{item.status === 'available' ? "Select" : "Return"}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.pagination}>
        <TouchableOpacity
          style={[styles.paginationButton, styles.previousButton, currentPage === 1 && styles.disabledButton]}
          onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <Ionicons name="arrow-back-circle" size={24} color="white" />
          <Text style={styles.paginationText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.paginationButton,
            styles.nextButton,
            currentPage === Math.ceil(vehicles.length / vehiclesPerPage) && styles.disabledButton,
          ]}
          onPress={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(vehicles.length / vehiclesPerPage)))}
          disabled={currentPage === Math.ceil(vehicles.length / vehiclesPerPage)}
        >
          <Text style={styles.paginationText}>Next</Text>
          <Ionicons name="arrow-forward-circle" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  vehicleItem: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemAvailable: {
    borderColor: '#28a745',
  },
  itemCheckedOut: {
    borderColor: '#dc3545',
  },
  vehicleDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    flexShrink: 1,
    marginLeft: 10,
  },
  vehicleNameUnavailable: {
    textDecorationLine: 'line-through',
    color: '#dc3545',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonAvailable: {
    backgroundColor: '#28a745',
  },
  buttonCheckedOut: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  paginationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  paginationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    marginRight: 8,
  },
  previousButton: {
    backgroundColor: '#17a2b8',
  },
  nextButton: {
    backgroundColor: '#17a2b8',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default VehicleList;