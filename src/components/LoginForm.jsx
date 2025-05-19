import React, { useContext, useState } from "react";
import styled from "styled-components";
import { AccountContext } from "./AccountBox";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const FormContainer = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 2.5em;
`;
const Input = styled.input`
  width: 100%;
  height: 42px;
  outline: none;
  border: 1px solid rgba(200, 200, 200, 0.3);
  border-radius: 5px;
  padding: 0px 10px;
  transition: all 200ms ease-in-out;
  margin-bottom: 10px;
  &::placeholder {
    color: rgba(200, 200, 200, 1);
  }
  &:focus {
    outline: none;
    border-bottom: 1px solid #00a6fb;
  }
`;
const SubmitButton = styled.button`
  width: 100%;
  max-width: 150px;
  padding: 10px;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 100px;
  cursor: pointer;
  transition: all 240ms ease-in-out;
  background: linear-gradient(58deg, #00a6fb 20%, #0582ca 100%);
  margin: 10px auto 0 auto;
  &:hover {
    filter: brightness(1.03);
  }
`;
const LineText = styled.p`
  font-size: 12px;
  color: #888;
  font-weight: 500;
  text-align: center;
  margin-top: 10px;
`;
const BoldLink = styled.span`
  color: #00a6fb;
  font-weight: 600;
  cursor: pointer;
  margin-left: 4px;
`;

export default function LoginForm() {
  const { switchToSignup, onAuthSuccess } = useContext(AccountContext);
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!form.email || !form.password) throw new Error("All fields required");
      const res = await axios.post("/api/auth/login", form, {
        withCredentials: true,
      });
      if (res.data.token) {
        login(res.data.token);
        navigate("/"); // Redirect to home after login
        if (onAuthSuccess) onAuthSuccess();
      } else {
        setError(res.data.error || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit} autoComplete="on">
      {error && (
        <div
          style={{
            color: "#e53e3e",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}
      <Input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <Input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />
      <SubmitButton type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </SubmitButton>
      <LineText>
        Don't have an account?
        <BoldLink onClick={switchToSignup}>Sign up</BoldLink>
      </LineText>
    </FormContainer>
  );
}
