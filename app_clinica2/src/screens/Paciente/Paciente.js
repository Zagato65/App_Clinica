// src/screens/Paciente/Paciente.js
import React, { useState, useMemo, useCallback } from 'react';
import { 
  View, Text, TextInput, StyleSheet, SectionList, TouchableOpacity, 
  Platform, LayoutAnimation, UIManager, Button, RefreshControl, Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = 'https://693358d7e5a9e342d2728c31.mockapi.io/clinica/paciente';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// 1. Função de Agrupamento e Filtro adaptada para Pacientes
const groupAndFilterPacientes = (pacientes, searchText) => {
  if (!Array.isArray(pacientes)) return [];
  const textoBusca = searchText ? searchText.toLowerCase() : '';
  
  const filtered = pacientes.filter(paciente => {
    const nome = paciente.nome ? paciente.nome.toLowerCase() : '';
    const cpf = paciente.cpf ? paciente.cpf.toLowerCase() : ''; // Filtra por CPF também
    return nome.includes(textoBusca) || cpf.includes(textoBusca);
  });

  const grouped = filtered.reduce((acc, paciente) => {
    const firstLetter = paciente.nome && paciente.nome[0] ? paciente.nome[0].toUpperCase() : '#';
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(paciente);
    return acc;
  }, {});

  return Object.keys(grouped).sort().map(key => ({ title: key, data: grouped[key] }));
};

// 2. Componente Card adaptado para Pacientes
const PacienteCard = ({ paciente, navigation, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const handleEdit = () => {
    navigation.navigate('CadastroEdicaoPaciente', { 
      paciente: paciente 
    });
  };

  const handleDelete = () => {
    Alert.alert("Excluir", `Apagar ${paciente.nome}?`, [
      { text: "Cancelar" },
      { text: "Sim", onPress: () => onDelete(paciente.id) }
    ]);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={toggleExpand} style={styles.cardMain}>
        <View>
          <Text style={styles.cardTitle}>{paciente.nome || 'Sem Nome'}</Text>
          {/* Exibe o CPF como subtítulo */}
          <Text style={styles.cardSubtitle}>{paciente.cpf ? `CPF: ${paciente.cpf}` : 'Sem CPF'}</Text>
        </View>
        <Text style={{ fontSize: 20, transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}> {'>'} </Text>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.cardDetails}>
          <Text>Email: {paciente.email}</Text>
          <Text>Tel: {paciente.telefone}</Text>
          {/* Exibe endereço resumido se existir */}
          {paciente.cidade && <Text>Cidade: {paciente.cidade} - {paciente.uf}</Text>}
          
          <View style={styles.cardActions}>
            <Button title="Editar" onPress={handleEdit} />
            <View style={{width: 10}} /> 
            <Button title="Excluir" color="red" onPress={handleDelete} />
          </View>
        </View>
      )}
    </View>
  );
};

// 3. Tela Principal de Pacientes
const Paciente = ({ navigation }) => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  const fetchPacientes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setPacientes(data);
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useFocusEffect(
    useCallback(() => {
      fetchPacientes();
    }, [fetchPacientes]) 
  );

  const sections = useMemo(() => groupAndFilterPacientes(pacientes, searchText), [pacientes, searchText]);

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchPacientes(); 
    } catch (e) {
      Alert.alert("Erro", "Falha ao excluir");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput 
          placeholder="Pesquisar Paciente..." 
          style={styles.input}
          value={searchText}
          onChangeText={setSearchText} 
        />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PacienteCard 
            paciente={item} 
            navigation={navigation} 
            onDelete={handleDelete}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchPacientes} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {loading ? 'Carregando...' : 'Nenhum paciente encontrado.'}
          </Text>
        }
      />

      <View style={styles.fabContainer}>
        <Button 
          title="+ Cadastrar Paciente" 
          onPress={() => navigation.navigate('CadastroEdicaoPaciente')} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  searchBox: { padding: 10, backgroundColor: '#fff' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 8 },
  header: { fontSize: 18, fontWeight: 'bold', padding: 10, backgroundColor: '#e0e0e0' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#888' },
  fabContainer: { padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#ddd' },
  card: { backgroundColor: '#fff', margin: 8, borderRadius: 8, overflow: 'hidden', elevation: 2 },
  cardMain: { padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardSubtitle: { color: '#666' },
  cardDetails: { padding: 15, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fafafa' },
  cardActions: { flexDirection: 'row', marginTop: 10, justifyContent: 'flex-end' }
});

export default Paciente;