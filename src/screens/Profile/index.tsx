import React from "react";
import { View, Text, TextInput, Button } from "react-native";

// import {
// Container
// } from './styles';

export function Profile() {
  return (
    <View>
      <Text>Perfil</Text>
      <TextInput placeholder="Nome" autoCorrect={false} />
      <TextInput placeholder="Sobrenome" autoCorrect={false} />
      <Button title="Salvar" onPress={() => {}} />
    </View>
  );
}
