import React from "react";
import { render } from "@testing-library/react-native";

import { Profile } from "../../screens/Profile";

test("Check if button with placeholder shows correctly", () => {
  const { debug } = render(<Profile />);
  debug();
});
