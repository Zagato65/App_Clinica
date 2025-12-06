// src/screens/Medico/Medico.js
import React, { useState, useMemo, useCallback } from 'react';
import { 
  View, Text, TextInput, StyleSheet, SectionList, TouchableOpacity, 
  Platform, LayoutAnimation, UIManager, Button, RefreshControl, Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = 'https://693358d7e5a9e342d2728c31.mockapi.io/clinica/medico';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const groupAndFilterMedicos = (medicos, searchText) => {
  if (!Array.isArray(medicos)) return [];
  const textoBusca = searchText ? searchText.toLowerCase() : '';
  const filtered = medicos.filter(medico => {
    const nome = medico.nome ? medico.nome.toLowerCase() : '';
    const especialidade = medico.especialidade ? medico.especialidade.toLowerCase() : '';
    return nome.includes(textoBusca) || especialidade.includes(textoBusca);
  });
  const grouped = filtered.reduce((acc, medico) => {
    const firstLetter = medico.nome && medico.nome[0] ? medico.nome[0].toUpperCase() : '#';
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(medico);
    return acc;
  }, {});
  return Object.keys(grouped).sort().map(key => ({ title: key, data: grouped[key] }));
};

const MedicoCard = ({ medico, navigation, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const handleEdit = () => {
    navigation.navigate('CadastroEdicaoMedico', { 
      medico: medico 
    });
  };

  const handleDelete = () => {
    Alert.alert("Excluir", `Apagar ${medico.nome}?`, [
      { text: "Cancelar" },
      { text: "Sim", onPress: () => onDelete(medico.id) }
    ]);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={toggleExpand} style={styles.cardMain}>
        <View>
          <Text style={styles.cardTitle}>{medico.nome || 'Sem Nome'}</Text>
          <Text style={styles.cardSubtitle}>{medico.especialidade || 'Sem Especialidade'}</Text>
        </View>
        <Text style={{ fontSize: 20, transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}> {'>'} </Text>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.cardDetails}>
          <Text>CRM: {medico.crm}</Text>
          <Text>Email: {medico.email}</Text>
          <Text>Tel: {medico.telefone}</Text>
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

const Medico = ({ navigation, medicos, onRefresh, loading }) => {
  const [searchText, setSearchText] = useState('');
  
  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, []) 
  );

  const sections = useMemo(() => groupAndFilterMedicos(medicos, searchText), [medicos, searchText]);

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      onRefresh(); 
    } catch (e) {
      Alert.alert("Erro", "Falha ao excluir");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput 
          placeholder="Pesquisar..." 
          style={styles.input}
          value={searchText}
          onChangeText={setSearchText} 
        />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MedicoCard 
            medico={item} 
            navigation={navigation} 
            onDelete={handleDelete}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {loading ? 'Carregando...' : 'Nenhum médico encontrado.'}
          </Text>
        }
      />

      <View style={styles.fabContainer}>
        <Button 
          title="+ Cadastrar Médico" 
          onPress={() => navigation.navigate('CadastroEdicaoMedico')} 
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

export default Medico;