import type React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    type: string,
    label: string

}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    type: "button" | "reset" | "submit" | undefined,
    text: string
}