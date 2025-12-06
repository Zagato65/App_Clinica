// src/screens/Menu/MenuScreen.js
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native'; // <--- Adicione ScrollView aqui
import BotaoMenu from '../../components/BotaoMenu'; 

const Logo = require('../../../assets/logo.png')

const IconeMedic = require('../../../assets/usuario-md.png')
const IconePaciente = require('../../../assets/utilizador.png')
const IconeConsulta = require('../../../assets/calendario.png')

const MenuScreen = ({ navigation }) => {
  return (
    // Substituímos View por ScrollView
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.container}>
      
      <Image style={styles.logo} source={Logo} />
      <Text style={styles.header}>Gerenciando sua Clínica</Text>
      
      <View style={styles.btns}>
        <Text style={styles.subHeader}>Escolha qual seção deseja iniciar.</Text>
        <BotaoMenu
          icone={IconeMedic}
          titulo="Médico(a)s" 
          onPress={() => navigation.navigate('Medicos')}
        />
     
        <BotaoMenu
          icone={IconePaciente} 
          titulo="Pacientes" 
          onPress={() => navigation.navigate('Pacientes')}
        />
    
        <BotaoMenu 
          icone={IconeConsulta}
          titulo="Consultas" 
          onPress={() => navigation.navigate('Consultas')}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // O ScrollView usa contentContainerStyle para layout interno
  scrollContainer: {
    flexGrow: 1,
    flexDirection: 'column', 
    justifyContent: 'flex-start',
    padding: 20, 
    alignItems: 'center', // Centraliza itens horizontalmente
  },
  logo: {
    width: '50%',
    height: 100, 
    resizeMode: 'contain',
    marginBottom: 10,
  },
  header: { 
    fontSize: 22, // Aumentei um pouco para destaque
    textAlign: 'center', 
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333'
  },
  subHeader: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#666'
  },
  btns: {
    width: '100%', // Garante que a área dos botões ocupe a largura
    marginTop: 20, 
    alignItems: 'center' // Centraliza os botões
  }
});

export default MenuScreen;