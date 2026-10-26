import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  TextInput,
  SelectField,
  TextareaField,
  CheckboxField,
} from "../components/forms";

describe("Reusable Form Input Components Suite", () => {
  it("renders TextInput with label and handles onChange", () => {
    const handleChange = vi.fn();
    render(
      <TextInput
        label="Host IP"
        name="ip"
        value="10.10.0.1"
        onChange={handleChange}
        placeholder="Enter IP"
        required
      />
    );

    const input = screen.getByLabelText(/Host IP/i);
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("10.10.0.1");

    fireEvent.change(input, { target: { value: "10.10.0.2" } });
    expect(handleChange).toHaveBeenCalled();
  });

  it("displays error state and aria-invalid when touched with error", () => {
    render(
      <TextInput
        label="Email Address"
        name="email"
        value="bademail"
        error="Please enter a valid email address."
        touched={true}
        onChange={() => {}}
      />
    );

    const errorMessage = screen.getByText("Please enter a valid email address.");
    expect(errorMessage).toBeInTheDocument();

    const input = screen.getByLabelText(/Email Address/i);
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("renders SelectField with provided options", () => {
    render(
      <SelectField
        label="Hardware Role"
        name="role"
        value="Router"
        options={["Switch", "Router", "Server"]}
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText(/Hardware Role/i)).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Router" }).selected).toBe(true);
    expect(screen.getByRole("option", { name: "Switch" })).toBeInTheDocument();
  });

  it("renders TextareaField and displays character counter", () => {
    render(
      <TextareaField
        label="Project Notes"
        name="notes"
        value="Testing"
        maxLength={100}
        onChange={() => {}}
      />
    );

    expect(screen.getByText("7 / 100")).toBeInTheDocument();
  });

  it("renders CheckboxField and toggles check state", () => {
    const handleChange = vi.fn();
    render(
      <CheckboxField
        label="Accept Lab Terms"
        name="terms"
        checked={false}
        onChange={handleChange}
      />
    );

    const checkbox = screen.getByLabelText(/Accept Lab Terms/i);
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalled();
  });
});
