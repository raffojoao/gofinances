import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SignIn } from "../screens/SignIn";

export type AuthRoutesParamList = {
  SignIn: undefined;
};

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutesParamList>();

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="SignIn" component={SignIn} />
    </Navigator>
  );
}
