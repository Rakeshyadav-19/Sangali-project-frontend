import { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import AccountBox from "../components/AccountBox";

const BoxContainer = styled.div`
  width: 100vw;
  max-width: 430px;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  border-radius: 22px;
  background-color: #fff;
  box-shadow: 0 0 12px rgba(15, 15, 15, 0.18);
  position: relative;
  overflow: hidden;
  @media (min-width: 640px) {
    width: 420px;
    min-height: 650px;
  }
  @media (min-width: 1024px) {
    width: 500px;
    min-height: 700px;
  }
`;

const TopContainer = styled.div`
  width: 100%;
  height: ${({ islogin }) => (islogin === "true" ? "180px" : "240px")};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 2.2em;
  padding-bottom: ${({ islogin }) => (islogin === "true" ? "2.5em" : "3.5em")};
  @media (min-width: 640px) {
    height: ${({ islogin }) => (islogin === "true" ? "210px" : "270px")};
    padding-bottom: ${({ islogin }) => (islogin === "true" ? "3em" : "4em")};
  }
  @media (min-width: 1024px) {
    height: ${({ islogin }) => (islogin === "true" ? "240px" : "320px")};
    padding-bottom: ${({ islogin }) => (islogin === "true" ? "3.5em" : "5em")};
  }
`;

const BackDrop = styled(motion.div)`
  position: absolute;
  width: 160%;
  height: 550px;
  display: flex;
  flex-direction: column;
  border-radius: 50%;
  top: -290px;
  left: -70px;
  transform: rotate(60deg);
  background: linear-gradient(58deg, #8f87f1 20%, #fed2e2 100%);
`;

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const HeaderText = styled.h2`
  font-size: 30px;
  font-weight: 600;
  line-height: 1.24;
  color: #fff;
  z-index: 10;
`;

const SmallText = styled.h5`
  color: #fff;
  font-weight: 500;
  font-size: 11px;
  margin-top: 7px;
  z-index: 10;
`;

const InnerContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 1.2em;
  @media (min-width: 640px) {
    padding: 0 2.2em;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 42px;
  outline: none;
  border: 1px solid #e0e0e0;
  padding: 0px 10px;
  border-bottom: 1.4px solid transparent;
  transition: all 200ms ease-in-out;
  font-size: 12px;
  &::placeholder {
    color: #b9b9b9;
  }
  &:not(:last-of-type) {
    margin-bottom: 20px;
  }
  &:focus {
    outline: none;
    border-bottom: 2px solid #8f87f1;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 11px 40%;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 100px 100px 100px 100px;
  background: #8f87f1;
  background: linear-gradient(58deg, #8f87f1 20%, #fed2e2 100%);
  cursor: pointer;
  transition: all, 240ms ease-in-out;
  &:hover {
    filter: brightness(1.03);
  }
`;

const backdropVariants = {
  login: {
    width: "220%",
    height: "420px",
    borderRadius: "50%",
    top: "-180px",
    left: "-60px",
    transform: "rotate(60deg)",
  },
  signup: {
    width: "250%",
    height: "650px",
    borderRadius: "35%",
    top: "-260px",
    left: "-80px",
    transform: "rotate(60deg)",
  },
};

const expandingTransition = {
  type: "spring",
  duration: 1.2,
  stiffness: 30,
};

export default function Auth() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#8F87F1] to-[#FED2E2] px-2 sm:px-0">
      <AccountBox />
    </div>
  );
}
