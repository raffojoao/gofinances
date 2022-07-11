import React from "react";
import { render } from "@testing-library/react-native";

import { Profile } from "../../screens/Profile";

test("Check if button with placeholder shows correctly", () => {
  const { getByPlaceholderText } = render(<Profile />);

  const inputName = getByPlaceholderText("Nome");

  expect(inputName).toBeTruthy();
});

describe("Profile Screen", () => {
  it("should have correct placeholder in user name input", () => {
    const { getByTestId } = render(<Profile />);

    const inputName = getByTestId("input-name");
    const inputSurname = getByTestId("input-surname");

    expect(inputName.props.value).toEqual("João");
    expect(inputSurname.props.value).toEqual("Raffo");
  });

  it("should have correct child in profile title", () => {
    const { getByTestId } = render(<Profile />);
    const textTitle = getByTestId("text-title");
    expect(textTitle.props.children).toContain("Perfil");
  });
});
