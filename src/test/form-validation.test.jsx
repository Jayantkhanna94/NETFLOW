import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FormField, Input, Select, Textarea } from "../components/UI";
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateIP,
  validateRequired,
  validateCapacity,
} from "../services/validation";

describe("Form Handling, Validation Strategies & Reusable Input Components", () => {
  describe("Validation Strategy Functions", () => {
    it("validates required fields", () => {
      expect(validateRequired("", "Username")).toBe("Username is required");
      expect(validateRequired("   ", "Username")).toBe("Username is required");
      expect(validateRequired("Alice", "Username")).toBeNull();
    });

    it("validates email formatting via regex", () => {
      expect(validateEmail("invalid-email")).toBe("Please enter a valid email address (e.g. name@college.edu)");
      expect(validateEmail("user@")).toBe("Please enter a valid email address (e.g. name@college.edu)");
      expect(validateEmail("user@domain")).toBe("Please enter a valid email address (e.g. name@college.edu)");
      expect(validateEmail("student@college.edu")).toBeNull();
      expect(validateEmail("admin@netflow.com")).toBeNull();
    });

    it("validates password length and password matching", () => {
      expect(validatePassword("12345", 6)).toBe("Password must be at least 6 characters");
      expect(validatePassword("123456", 6)).toBeNull();

      expect(validatePasswordMatch("pass123", "pass456")).toBe("Passwords do not match");
      expect(validatePasswordMatch("pass123", "pass123")).toBeNull();
    });

    it("validates IPv4 address format", () => {
      expect(validateIP("999.999.999.999")).toBe("Please enter a valid IPv4 address (e.g. 10.10.0.1)");
      expect(validateIP("10.10.0")).toBe("Please enter a valid IPv4 address (e.g. 10.10.0.1)");
      expect(validateIP("10.10.0.1")).toBeNull();
      expect(validateIP("192.168.1.254")).toBeNull();
    });

    it("validates resource capacity limits", () => {
      expect(validateCapacity(0)).toBe("Capacity must be a positive number greater than 0");
      expect(validateCapacity(-5)).toBe("Capacity must be a positive number greater than 0");
      expect(validateCapacity(50)).toBeNull();
    });
  });

  describe("Reusable Form Components", () => {
    it("renders FormField with label, required asterisk, and error alert", () => {
      render(
        <FormField
          id="test-field"
          label="Test Field"
          required
          error="Field is required"
          touched={true}
        >
          <input id="test-field" />
        </FormField>
      );

      expect(screen.getByText("Test Field")).toBeInTheDocument();
      expect(screen.getByText("*")).toBeInTheDocument();
      expect(screen.getByRole("alert")).toHaveTextContent("Field is required");
    });

    it("renders reusable Input with error state and handles changes", () => {
      let changedValue = "";
      render(
        <Input
          id="custom-input"
          label="Custom Input"
          placeholder="Type here..."
          value="Initial"
          onChange={(val) => {
            changedValue = val;
          }}
          error="Invalid value"
          touched={true}
        />
      );

      const input = screen.getByPlaceholderText("Type here...");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(screen.getByRole("alert")).toHaveTextContent("Invalid value");

      fireEvent.change(input, { target: { value: "Updated" } });
      expect(changedValue.toString()).toBe("Updated");
    });

    it("renders reusable Select and Textarea components", () => {
      render(
        <>
          <Select
            id="role-select"
            label="Role Select"
            value="Faculty"
            onChange={() => {}}
            options={["Student", "Faculty", "Administrator"]}
          />
          <Textarea
            id="desc-textarea"
            label="Description"
            placeholder="Enter description..."
            value="Notes"
            onChange={() => {}}
          />
        </>
      );

      expect(screen.getByLabelText(/Role Select/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    });
  });
});
