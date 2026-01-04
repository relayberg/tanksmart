import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface Street {
  name: string;
  postalCode: string;
  locality: string;
}

interface StreetAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (street: Street) => void;
  streets: Street[];
  isLoading: boolean;
  error?: string | null;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function StreetAutocomplete({
  value,
  onChange,
  onSelect,
  streets,
  isLoading,
  error,
  disabled = false,
  placeholder = 'Straße eingeben...',
  className,
}: StreetAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Show dropdown when there are streets
  useEffect(() => {
    if (streets.length > 0 && value.length >= 2) {
      setIsOpen(true);
      setHighlightedIndex(-1);
    } else {
      setIsOpen(false);
    }
  }, [streets, value]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('li');
      items[highlightedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < streets.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && streets[highlightedIndex]) {
          handleSelect(streets[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleSelect = (street: Street) => {
    onSelect(street);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleBlur = () => {
    // Delay closing to allow click on dropdown items
    setTimeout(() => {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }, 200);
  };

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (streets.length > 0 && value.length >= 2) {
              setIsOpen(true);
            }
          }}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(error && 'border-destructive')}
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && streets.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {streets.map((street, index) => (
            <li
              key={`${street.name}-${street.postalCode}-${index}`}
              onClick={() => handleSelect(street)}
              className={cn(
                'px-3 py-2 cursor-pointer text-sm transition-colors',
                highlightedIndex === index
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-muted'
              )}
            >
              <span className="font-medium">{street.name}</span>
              <span className="text-muted-foreground ml-2 text-xs">
                {street.postalCode} {street.locality}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Error message */}
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
}
