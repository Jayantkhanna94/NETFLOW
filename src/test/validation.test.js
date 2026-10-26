import { describe, it, expect } from "vitest";
import { validators } from "../hooks/useForm";

describe("Form Validation Strategies (validators)", () => {
  it("validates required fields", () => {
    const requiredValidator = validators.required("Required error");
    expect(requiredValidator("")).toBe("Required error");
    expect(requiredValidator("   ")).toBe("Required error");
    expect(requiredValidator(null)).toBe("Required error");
    expect(requiredValidator(undefined)).toBe("Required error");
    expect(requiredValidator("Valid input")).toBeNull();
  });

  it("validates RFC email addresses with regex", () => {
    const emailValidator = validators.email("Invalid email");
    expect(emailValidator("plainaddress")).toBe("Invalid email");
    expect(emailValidator("@missingusername.com")).toBe("Invalid email");
    expect(emailValidator("user@")).toBe("Invalid email");
    expect(emailValidator("user@college.edu")).toBeNull();
    expect(emailValidator("admin@netflow.com")).toBeNull();
  });

  it("validates IPv4 addresses with regex", () => {
    const ipv4Validator = validators.ipv4("Invalid IPv4");
    // Invalid IPs
    expect(ipv4Validator("999.999.999.999")).toBe("Invalid IPv4");
    expect(ipv4Validator("10.10.0")).toBe("Invalid IPv4");
    expect(ipv4Validator("10.10.0.1.2")).toBe("Invalid IPv4");
    expect(ipv4Validator("localhost")).toBe("Invalid IPv4");
    expect(ipv4Validator("10.10.0.256")).toBe("Invalid IPv4");

    // Valid IPs
    expect(ipv4Validator("10.10.0.1")).toBeNull();
    expect(ipv4Validator("192.168.1.254")).toBeNull();
    expect(ipv4Validator("127.0.0.1")).toBeNull();
    expect(ipv4Validator("172.16.254.1")).toBeNull();
  });

  it("validates minLength and maxLength bounds", () => {
    const minValidator = validators.minLength(5, "Too short");
    expect(minValidator("abcd")).toBe("Too short");
    expect(minValidator("abcde")).toBeNull();

    const maxValidator = validators.maxLength(10, "Too long");
    expect(maxValidator("12345678901")).toBe("Too long");
    expect(maxValidator("1234567890")).toBeNull();
  });
});
