'use client';

import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { validatePassword, PasswordValidation } from '@/lib/auth/password';

interface PasswordStrengthProps {
  password: string;
  showRequirements?: boolean;
}

export function PasswordStrength({ password, showRequirements = true }: PasswordStrengthProps) {
  const [validation, setValidation] = useState<PasswordValidation | null>(null);

  useEffect(() => {
    if (password) {
      setValidation(validatePassword(password));
    } else {
      setValidation(null);
    }
  }, [password]);

  if (!validation) return null;

  const strengthColors = {
    weak: 'bg-red-500',
    medium: 'bg-yellow-500',
    strong: 'bg-green-500',
  };

  const strengthText = {
    weak: 'Weak',
    medium: 'Medium',
    strong: 'Strong',
  };

  return (
    <div className="space-y-3">
      {/* Strength Meter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Password Strength:</span>
          <span className={`text-sm font-semibold ${
            validation.strength === 'strong' ? 'text-green-600' :
            validation.strength === 'medium' ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {strengthText[validation.strength]}
          </span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strengthColors[validation.strength]}`}
            style={{ width: `${validation.score}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      {showRequirements && (
        <div className="space-y-1.5 text-sm">
          <RequirementItem
            met={validation.requirements.minLength}
            text="At least 8 characters"
          />
          <RequirementItem
            met={validation.requirements.hasUppercase}
            text="One uppercase letter (A-Z)"
          />
          <RequirementItem
            met={validation.requirements.hasLowercase}
            text="One lowercase letter (a-z)"
          />
          <RequirementItem
            met={validation.requirements.hasNumber}
            text="One number (0-9)"
          />
          <RequirementItem
            met={validation.requirements.hasSpecialChar}
            text="One special character (!@#$%^&*)"
          />
        </div>
      )}
    </div>
  );
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
        met ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
      }`}>
        {met ? (
          <Check className="w-3 h-3 text-white" />
        ) : (
          <X className="w-3 h-3 text-gray-500" />
        )}
      </div>
      <span className={met ? 'text-foreground' : 'text-muted-foreground'}>
        {text}
      </span>
    </div>
  );
}

