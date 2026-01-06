import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { useMemo, useRef, useState } from 'react';
import { Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView from 'react-native-maps';

import countriesData from './countries.json';

export default function App() {
  // Referencia para controlar la hoja deslizante
  const bottomSheetRef = useRef<BottomSheet>(null);
  
  // Puntos de anclaje: 15% (solo buscador) y 90% (pantalla completa)
  const snapPoints = useMemo(() => ['15%', '90%'], []);

  const [busqueda, setBusqueda] = useState('');
  const [paisesFiltrados, setPaisesFiltrados] = useState(countriesData);

  const buscarPais = (texto: string) => {
    setBusqueda(texto);
    if (texto) {
      const nuevosDatos = countriesData.filter((item) => {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = texto.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setPaisesFiltrados(nuevosDatos);
      // Si escribes, la hoja sube automáticamente para que veas resultados
      bottomSheetRef.current?.expand();
    } else {
      setPaisesFiltrados(countriesData);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      
      {/* 1. EL MAPA DE FONDO */}
      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: 40.4167, // Madrid (puedes cambiarlo)
          longitude: -3.7037,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        // Pone el mapa en modo oscuro para que resalte tu lista blanca
        userInterfaceStyle="dark" 
      />

      {/* 2. LA HOJA DESLIZANTE (Bottom Sheet) */}
      <BottomSheet
        ref={bottomSheetRef}
        index={0} // Empieza en la posición 0 (15% de altura)
        snapPoints={snapPoints}
        handleIndicatorStyle={{ backgroundColor: '#ccc', width: 40 }}
        backgroundStyle={{ backgroundColor: 'white', borderRadius: 20 }}
      >
        <View style={styles.contenidoSheet}>
          
          {/* BARRA DE BÚSQUEDA (Dentro de la hoja) */}
          <View style={styles.inputContainer}>
            <Ionicons name="search" size={20} color="#8E8E93" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.inputBusqueda}
              value={busqueda}
              placeholder="Buscar aquí..."
              placeholderTextColor="#8E8E93"
              onChangeText={buscarPais}
              // Al tocar el input, expandimos la hoja
              onFocus={() => bottomSheetRef.current?.expand()}
            />
            {busqueda.length > 0 && (
              <TouchableOpacity onPress={() => {
                buscarPais('');
                bottomSheetRef.current?.collapse(); // Al borrar, baja la hoja
              }}>
                <Ionicons name="close-circle" size={20} color="#8E8E93" />
              </TouchableOpacity>
            )}
            <Image 
              source={{ uri: 'https://github.com/shadcn.png' }} // Foto de perfil falsa como en el video
              style={styles.avatar}
            />
          </View>

          {/* LISTA DE PAÍSES */}
          <BottomSheetFlatList
            data={paisesFiltrados}
            keyExtractor={(item: any) => item['alpha-2']}
            renderItem={({ item }: { item: any }) => {
              const codigoPais = item['alpha-2'].toLowerCase();
              return (
                <View style={styles.itemPais}>
                  <View style={styles.infoIzquierda}>
                    <Image 
                      source={{ uri: `https://flagcdn.com/w160/${codigoPais}.png` }} 
                      style={styles.imagenBandera}
                      resizeMode="cover"
                    />
                    <View>
                      <Text style={styles.textoPais}>{item.name}</Text>
                      <Text style={styles.subtituloPais}>{item.region}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.botonMas}>
                    <Ionicons name="add" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              );
            }}
            contentContainerStyle={styles.listaContainer}
          />
        </View>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject, // El mapa ocupa TODA la pantalla detrás
  },
  contenidoSheet: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 10,
  },
  inputBusqueda: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    height: '100%',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10,
  },
  listaContainer: {
    paddingBottom: 20,
  },
  itemPais: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoIzquierda: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  imagenBandera: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  textoPais: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  subtituloPais: {
    fontSize: 13,
    color: '#8E8E93',
  },
  botonMas: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});