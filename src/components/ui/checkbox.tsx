import * as React from 'react';

import {cn} from '@/lib/utils';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import {CheckIcon} from 'lucide-react';

function Checkbox({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <label
      htmlFor="terms"
      className={cn('flex items-center space-x-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)}
    >
      <CheckboxPrimitive.Root
        data-slot="checkbox"
        className="peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className="flex items-center justify-center text-current transition-none"
        >
          <CheckIcon className="size-3.5" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <span>
        {children}
      </span>
    </label>
  );
}

export {
  Checkbox,
};
