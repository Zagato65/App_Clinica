// src/screens/Paciente/CadastroEdicaoPacienteScreen.js
import React, { useState } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import PacienteForm from '../../components/PacienteForm';

const API_URL = 'https://693358d7e5a9e342d2728c31.mockapi.io/clinica/paciente';

const CadastroEdicaoPacienteScreen = ({ route, navigation }) => {
  const { paciente } = route.params || {};
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (dadosPaciente) => {
    setIsSaving(true);
    try {
      const method = paciente?.id ? 'PUT' : 'POST';
      const url = paciente?.id ? `${API_URL}/${paciente.id}` : API_URL;

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosPaciente),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Operação realizada com sucesso!');
        navigation.goBack();
      } else {
        throw new Error('Falha na requisição');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isSaving) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <PacienteForm
        paciente={paciente}
        onSave={handleSave}
        onCancel={() => navigation.goBack()}
        navigation={navigation}
      />
    </View>
  );
};

export default CadastroEdicaoPacienteScreen;