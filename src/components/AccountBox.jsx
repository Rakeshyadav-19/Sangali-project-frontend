import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const BoxContainer = styled.div`
  width: 100%;
  max-width: 420px;
  min-height: 560px;
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
  margin: auto;
`;

const TopContainer = styled.div`
  width: 100%;
  height: 250px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 2rem 3rem 2rem;
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
  z-index: 0;
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

export const AccountContext = React.createContext();

export default function AccountBox({ onAuthSuccess }) {
  const [isExpanded, setExpanded] = useState(false);
  const [active, setActive] = useState("signin");
  const [showForm, setShowForm] = useState("signin");
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const animateSwitch = (next) => {
    setExpanded(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setExpanded(false);
      setActive(next);
      setTimeout(() => {
        setShowForm(next);
      }, 100); // short delay to avoid flicker
    }, 600); // animation duration match
  };

  const switchToSignup = () => animateSwitch("signup");
  const switchToSignin = () => animateSwitch("signin");

  const contextValue = { switchToSignup, switchToSignin, onAuthSuccess };

  return (
    <AccountContext.Provider value={contextValue}>
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
              {active === "signin" ? "Welcome Back" : "Create Account"}
            </HeaderText>
            <SmallText>
              {active === "signin"
                ? "Please sign in to continue"
                : "Please sign up to continue"}
            </SmallText>
          </HeaderContainer>
        </TopContainer>

        {showForm && (
          <InnerContainer
            key={showForm}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {showForm === "signin" && <LoginForm />}
            {showForm === "signup" && <SignupForm />}
          </InnerContainer>
        )}
      </BoxContainer>
    </AccountContext.Provider>
  );
}
