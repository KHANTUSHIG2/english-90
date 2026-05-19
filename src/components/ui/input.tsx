import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-text-primary mb-1.5">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={cn(
            "w-full px-3 py-2 rounded-lg border border-border bg-white text-text-primary placeholder-text-secondary",
            "focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent",
            "transition-colors duration-150",
            error && "border-danger focus:ring-danger",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text-primary mb-1.5">
          {label}
        </label>
      )}
      <textarea
        id={id}
        ref={ref}
        className={cn(
          "w-full px-3 py-2 rounded-lg border border-border bg-white text-text-primary placeholder-text-secondary",
          "focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent",
          "transition-colors duration-150 resize-y",
          error && "border-danger focus:ring-danger",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
);
Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text-primary mb-1.5">
          {label}
        </label>
      )}
      <select
        id={id}
        ref={ref}
        className={cn(
          "w-full px-3 py-2 rounded-lg border border-border bg-white text-text-primary",
          "focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent",
          "transition-colors duration-150",
          error && "border-danger focus:ring-danger",
          className
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
);
Select.displayName = "Select";
