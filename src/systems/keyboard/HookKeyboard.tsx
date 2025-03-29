import { useHookKeyboard } from '@/systems/keyboard/Keyboard';
import React from 'react';
import { TextInput } from 'react-native';

export function HookKeyboard() {
  useHookKeyboard();

  return <HiddenTextInput />;
}

export function HiddenTextInput() {
  return (
    <TextInput
      className="absolute left-[-1000px] h-0 w-0 opacity-0"
      onBlur={(e) => {
        e.preventDefault();
        // Refocus the input to ensure keyboard events are captured
        e.target.focus();
      }}
      autoFocus
    />
  );
}
