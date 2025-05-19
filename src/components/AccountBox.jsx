import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const BoxContainer = styled.div`
  width: 100%;
  max-width: 420px;
  min-height: 560px;
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
  margin: auto;
  box-sizing: border-box;
  @media (max-width: 480px) {
    max-width: 100vw;
    min-width: 0;
    border-radius: 0;
    margin: 0;
    min-height: 100vh;
  }
`;

const TopContainer = styled.div`
  width: 100%;
  height: 250px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 2rem 3rem 2rem;
  z-index: 72;
  box-sizing: border-box;
  @media (max-width: 480px) {
    padding: 0 1rem 2rem 1rem;
    height: 180px;
  }
`;

const BackDrop = styled(motion.div)`
  position: absolute;
  width: 160%;
  height: 600px;
  top: -320px;
  left: -90px;
  border-radius: 50%;
  transform: rotate(60deg);
  background: linear-gradient(135deg, #00a6fb 20%, #0582ca 100%);
  z-index: 1;
  @media (max-width: 480px) {
    width: 300vw;
    height: 400px;
    top: -180px;
    left: -100vw;
  }
`;

const HeaderContainer = styled.div`
  z-index: 1;
  display: flex;
  flex-direction: column;
`;

const HeaderText = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.3;
  margin: 0;
`;

const SmallText = styled.h5`
  font-size: 0.95rem;
  color: #f0f0f0;
  margin-top: 8px;
  font-weight: 400;
`;

const InnerContainer = styled(motion.div)`
  padding: 2rem;
  z-index: 2;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 10px;
`;

const Input = styled(motion.input)`
  width: 100%;
  height: 44px;
  outline: none;
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 1rem;
  background: #f8fbff;
  transition: border 0.2s;
  &:focus {
    border: 1.5px solid #00a6fb;
    background: #fff;
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 12px;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 100px;
  cursor: pointer;
  background: linear-gradient(58deg, #00a6fb 20%, #0582ca 100%);
  margin-top: 10px;
  box-shadow: 0 2px 8px rgba(0, 166, 251, 0.08);
  transition: filter 0.2s;
  &:hover {
    filter: brightness(1.07);
  }
`;

const SwitchText = styled.p`
  font-size: 13px;
  color: #888;
  font-weight: 500;
  text-align: center;
  margin-top: 18px;
`;

const SwitchLink = styled.span`
  color: #00a6fb;
  font-weight: 600;
  cursor: pointer;
  margin-left: 4px;
  transition: text-decoration 0.2s;
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMsg = styled(motion.div)`
  color: #e53e3e;
  text-align: center;
  font-size: 0.97rem;
  margin-bottom: 8px;
`;

const SuccessMsg = styled(motion.div)`
  color: #38a169;
  text-align: center;
  font-size: 0.97rem;
  margin-bottom: 8px;
`;

const shake = keyframes`
  10%, 90% { transform: translateX(-2px); }
  20%, 80% { transform: translateX(4px); }
  30%, 50%, 70% { transform: translateX(-8px); }
  40%, 60% { transform: translateX(8px); }
`;

const AnimatedBox = styled(motion.div)`
  animation: ${(props) => (props.error ? shake : "none")} 0.4s;
`;

const backdropVariants = {
  expanded: {
    width: "240%",
    height: "1050px",
    borderRadius: "20%",
    transform: "rotate(60deg)",
  },
  collapsed: {
    width: "160%",
    height: "600px",
    borderRadius: "50%",
    transform: "rotate(60deg)",
  },
};

const expandingTransition = {
  type: "spring",
  duration: 1.5,
  stiffness: 30,
};

export default function AccountBox({ onAuthSuccess }) {
  const [mode, setMode] = useState("signin");
  const [isExpanded, setExpanded] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  // Animate backdrop on mode switch
  const animateSwitch = (nextMode) => {
    setExpanded(true);
    setTimeout(() => {
      setExpanded(false);
      setMode(nextMode);
      setForm({ name: "", email: "", password: "" });
      setError("");
      setSuccess("");
    }, 600);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (mode === "signup") {
        if (!form.name || !form.email || !form.password)
          throw new Error("All fields required");
        const res = await axios.post("/api/auth/register", form, {
          withCredentials: true,
        });
        if (res.data.message === "User registered successfully") {
          setSuccess("Registration successful! Redirecting...");
          setTimeout(() => {
            animateSwitch("signin");
          }, 1200);
        } else {
          setError(res.data.error || "Registration failed");
        }
      } else {
        if (!form.email || !form.password)
          throw new Error("All fields required");
        const res = await axios.post("/api/auth/login", form, {
          withCredentials: true,
        });
        if (res.data.token) {
          login(res.data.token);
          setSuccess("Login successful! Redirecting...");
          setTimeout(() => {
            if (onAuthSuccess) onAuthSuccess();
            navigate("/");
          }, 1000);
        } else {
          setError(res.data.error || "Login failed");
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <BoxContainer>
      <TopContainer>
        <BackDrop
          initial={false}
          animate={isExpanded ? "expanded" : "collapsed"}
          variants={backdropVariants}
          transition={expandingTransition}
        />
        <HeaderContainer>
          <HeaderText>
            {mode === "signin" ? "Welcome Back" : "Create Account"}
          </HeaderText>
          <SmallText>
            {mode === "signin"
              ? "Please sign in to continue"
              : "Please sign up to continue"}
          </SmallText>
        </HeaderContainer>
      </TopContainer>
      <InnerContainer
        key={mode}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <AnimatedBox error={!!error}>
          <Form onSubmit={handleSubmit} autoComplete="on">
            <AnimatePresence>
              {error && (
                <ErrorMsg
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {error}
                </ErrorMsg>
              )}
              {success && (
                <SuccessMsg
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {success}
                </SuccessMsg>
              )}
            </AnimatePresence>
            {mode === "signup" && (
              <Input
                key="name"
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                whileFocus={{ scale: 1.03, borderColor: "#0582ca" }}
                transition={{ duration: 0.2 }}
              />
            )}
            <Input
              key="email"
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              whileFocus={{ scale: 1.03, borderColor: "#0582ca" }}
              transition={{ duration: 0.2 }}
            />
            <Input
              key="password"
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              whileFocus={{ scale: 1.03, borderColor: "#0582ca" }}
              transition={{ duration: 0.2 }}
            />
            <Button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
            >
              {loading
                ? mode === "signin"
                  ? "Signing in..."
                  : "Signing up..."
                : mode === "signin"
                ? "Sign In"
                : "Sign Up"}
            </Button>
          </Form>
        </AnimatedBox>
        <SwitchText>
          {mode === "signin"
            ? "Don't have an account?"
            : "Already have an account?"}
          <SwitchLink
            onClick={() =>
              animateSwitch(mode === "signin" ? "signup" : "signin")
            }
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </SwitchLink>
        </SwitchText>
      </InnerContainer>
    </BoxContainer>
  );
}
