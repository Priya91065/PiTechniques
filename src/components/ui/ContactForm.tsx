"use client";

import React, { useState, type JSX } from "react";
import styled from "styled-components";
import { colors } from "@/constants/tokens";

const Form = styled.form`
  margin-top: 0;
`;

const Field = styled.div`
  margin-bottom: 64px;
  &:last-of-type {
    margin-bottom: 32px;
  }

  label {
    display: block;
    color: ${colors.textMutedLight};
    font-size: 19px;
    line-height: 28px;
    font-weight: 400;
  }
  .req {
    color: ${colors.orange};
  }
  input,
  textarea {
    width: 100%;
    border: none;
    border-bottom: 1px solid ${colors.pureWhite};
    background: transparent;
    border-radius: 0;
    font-size: 24px;
    line-height: 31px;
    color: ${colors.white};
    font-weight: 400;
    padding: 0;
    margin-top: 8px;
    font-family: inherit;
    outline: none;
  }
  textarea {
    min-height: 100px;
    resize: vertical;
  }

  @media (max-width: 767px) {
    margin-bottom: 40px;
  }
`;

const Submit = styled.button`
  margin-top: 24px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: transparent;
  border: 0;
  cursor: pointer;
  color: ${colors.white};
  font-size: 21px;
  font-weight: 500;

  .arrowbg {
    background: ${colors.orange};
    border-radius: 4px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .arrowbg img {
    width: 14px;
    height: 14px;
  }
  &:hover .arrowbg img {
    animation: arrowFlyRight 0.35s ease-in-out forwards;
  }
`;

const Alert = styled.div<{ $type: "ok" | "err" }>`
  margin-top: 24px;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 16px;
  color: ${({ $type }) => ($type === "ok" ? "#9be8b0" : colors.redStar)};
  background: ${({ $type }) =>
    $type === "ok" ? "rgba(25,135,84,0.15)" : "rgba(220,53,69,0.15)"};
`;

interface FormState {
  name: string;
  lname: string;
  email: string;
  phone: string;
  message: string;
}

const initial: FormState = { name: "", lname: "", email: "", phone: "", message: "" };

/** The "Get in touch" contact form. Validates client-side; no live backend. */
export default function ContactForm(): JSX.Element {
  const [values, setValues] = useState<FormState>(initial);
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");

  const update =
    (key: keyof FormState) =>
    (e: { target: { value: string } }): void =>
      setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = (): void => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
    const phoneOk = /^\d{7,15}$/.test(values.phone.replace(/\D/g, ""));
    if (!values.name || !values.lname || !emailOk || !phoneOk) {
      setStatus("err");
      return;
    }
    setStatus("ok");
    setValues(initial);
  };

  return (
    <Form
      onSubmit={(e: { preventDefault: () => void }) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Field>
        <label htmlFor="name">
          First Name <span className="req">*</span>
          <input id="name" name="name" type="text" autoComplete="off" value={values.name} onChange={update("name")} />
        </label>
      </Field>
      <Field>
        <label htmlFor="lname">
          Last Name <span className="req">*</span>
          <input id="lname" name="lname" type="text" autoComplete="off" value={values.lname} onChange={update("lname")} />
        </label>
      </Field>
      <Field>
        <label htmlFor="email">
          Email <span className="req">*</span>
          <input id="email" name="email" type="email" autoComplete="off" value={values.email} onChange={update("email")} />
        </label>
      </Field>
      <Field>
        <label htmlFor="phone">
          Contact Number <span className="req">*</span>
          <input id="phone" name="phone" type="tel" maxLength={15} autoComplete="off" value={values.phone} onChange={update("phone")} />
        </label>
      </Field>
      <Field>
        <label htmlFor="message">
          Message
          <textarea id="message" name="message" value={values.message} onChange={update("message")} />
        </label>
      </Field>

      <Submit type="submit">
        <span>Send request</span>
        <span className="arrowbg" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/rightNewArrow1.svg" alt="" />
        </span>
      </Submit>

      {status === "ok" ? (
        <Alert $type="ok" role="status">
          Thanks — your request has been noted. We&rsquo;ll be in touch shortly.
        </Alert>
      ) : null}
      {status === "err" ? (
        <Alert $type="err" role="alert">
          Please fill in your name, a valid email, and a valid contact number.
        </Alert>
      ) : null}
    </Form>
  );
}
