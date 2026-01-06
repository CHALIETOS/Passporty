import React, { useState } from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';

// Importamos el JSON
import rawData from './countries.json';

interface Country {
  name: string;
  region: string;
  "alpha-2": string;
  [key: string]: any; 
}

// Conversión segura de datos
const countriesData = rawData as unknown as Country[];

export default function App() {
  const [busqueda, setBusqueda] = useState('');
  const [paisesFiltrados, setPaisesFiltrados] = useState<Country[]>(countriesData);

  const buscarPais = (texto: string) => {
    setBusqueda(texto);
    if (texto) {
      const nuevosDatos = countriesData.filter((item) => {
        // Protección: Si el nombre es null, usamos cadena vacía
        const nombre = item.name ? item.name : ''; 
        return nombre.toUpperCase().includes(texto.toUpperCase());
      });
      setPaisesFiltrados(nuevosDatos);
    } else {
      setPaisesFiltrados(countriesData);
    }
  };

  return (
    <SafeAreaView style={styles.contenedor}>
      <View style={styles.contenido}>
        <Text style={styles.titulo}>Passporty 🌍</Text>
        
        <TextInput
          style={styles.inputBusqueda}
          value={busqueda}
          placeholder="Buscar país..."
          placeholderTextColor="#999"
          onChangeText={buscarPais}
        />

        <FlatList
          data={paisesFiltrados}
          // Protección: Si no hay alpha-2, usamos index como clave (evita crash)
          keyExtractor={(item, index) => item['alpha-2'] || index.toString()} 
          renderItem={({ item }) => (
            <View style={styles.itemPais}>
              <View style={{ flex: 1 }}>
                <Text style={styles.textoPais}>{item.name}</Text>
                {/* Protección: Si la región es null, mostramos 'Desconocido' */}
                <Text style={styles.subtituloPais}>{item.region || 'Desconocido'}</Text>
              </View>
              <Text style={styles.codigoPais}>{item['alpha-2']}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: StatusBar.currentHeight || 40,
  },
  contenido: {
    paddingHorizontal: 20,
    flex: 1,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    marginTop: 10,
  },
  inputBusqueda: {
    height: 50,
    borderWidth: 1,
    paddingLeft: 20,
    borderColor: '#009688',
    borderRadius: 25,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  itemPais: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 3,
  },
  textoPais: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flexWrap: 'wrap', // Evita que nombres largos rompan el diseño
  },
  subtituloPais: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  codigoPais: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#009688',
    backgroundColor: '#e0f2f1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    overflow: 'hidden',
    marginLeft: 10,
  },
});