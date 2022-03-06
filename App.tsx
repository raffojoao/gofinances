import { StatusBar } from "react-native";
import React from "react";
import { Dashboard } from "./src/screens/Dashboard";
import { Register } from "./src/screens/Register";
import { CategorySelect } from "./src/screens/CategorySelect";
import AppLoading from "expo-app-loading";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { ThemeProvider } from "styled-components";
import theme from "./src/global/styles/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "intl";
import "intl/locale-data/jsonp/pt-BR";

import { Routes } from "./src/routes";

import { AuthProvider, useAuth } from "./src/hooks/auth";

export default function App() {
  const { loadingUser } = useAuth();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  if (!fontsLoaded || loadingUser) {
    return <AppLoading />;
  }

  return (
    <ThemeProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
