import React, { useState, useEffect, useRef } from "react";
import { Check, ChevronDown, X } from "lucide-react";

export interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string | number | (string | number)[];
  onChange: (value: any) => void;
  multiple?: boolean;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  multiple = false,
  placeholder = "Select option...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionToggle = (optionValue: string | number) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const isSelected = currentValues.includes(optionValue);
      let newValue: (string | number)[];

      if (isSelected) {
        newValue = currentValues.filter((v) => v !== optionValue);
      } else {
        newValue = [...currentValues, optionValue];
      }
      onChange(newValue);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const handleRemoveValue = (
    e: React.MouseEvent,
    optionValue: string | number
  ) => {
    e.stopPropagation();
    if (multiple && Array.isArray(value)) {
      onChange(value.filter((v) => v !== optionValue));
    }
  };

  const isOptionSelected = (optionValue: string | number) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return value === optionValue;
  };

  const getTriggerContent = () => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const selectedOptions = options.filter((opt) =>
        currentValues.includes(opt.value)
      );

      if (selectedOptions.length === 0) {
        return <span className="text-muted-foreground">{placeholder}</span>;
      }

      return (
        <div className="flex flex-wrap gap-1">
          {selectedOptions.map((opt) => (
            <span
              key={opt.value}
              className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full font-medium"
            >
              {opt.label}
              <button
                type="button"
                onClick={(e) => handleRemoveValue(e, opt.value)}
                className="hover:bg-black/20 dark:hover:bg-white/20 rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${opt.label}`}
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      );
    } else {
      const selectedOption = options.find((opt) => opt.value === value);
      if (!selectedOption) {
        return <span className="text-muted-foreground">{placeholder}</span>;
      }
      return <span className="text-foreground font-semibold">{selectedOption.label}</span>;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full text-sm">
      {/* Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`min-h-[42px] w-full bg-input border border-border rounded-md px-3 py-2 pr-10 flex flex-wrap gap-1.5 items-center cursor-pointer select-none transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary ${
          isOpen ? "ring-2 ring-primary/30 border-primary" : "hover:border-neutral-400"
        }`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        {getTriggerContent()}

        {/* Chevron Icon */}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none transition-transform duration-200">
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </span>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-card border border-border rounded-md shadow-lg z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-muted-foreground italic text-center">
              No options available
            </div>
          ) : (
            <div className="py-1">
              {options.map((opt) => {
                const isSelected = isOptionSelected(opt.value);
                return (
                  <div
                    key={opt.value}
                    onClick={() => handleOptionToggle(opt.value)}
                    className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check size={16} className="text-primary" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Select;
