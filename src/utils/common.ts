import type { InputNumberProps } from "antd";

export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const numberFormatter: InputNumberProps['formatter'] = (value) => {
  const [start, end] = `${value}`.split('.') || [];
  const v = `${start}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${end ? `${v}.${end}` : `${v}`}`;
};
