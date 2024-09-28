import { ButtonHTMLAttributes, InputHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';

export interface IField extends InputHTMLAttributes<HTMLInputElement> {
	placeholder?: string;
	error?: FieldError;
}

export interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'default' | 'outline';
	size?: 'sm' | 'md';
}
