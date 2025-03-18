import React from 'react';
import { TextInput } from 'react-native';
import { useHookKeyboard } from './Keyboard';

export function HookKeyboard() {
  useHookKeyboard();

  return (
    <TextInput
      style={{
        position: 'absolute',
        left: -1000,
        height: 0,
        width: 0,
        opacity: 0,
      }}
      onBlur={(e) => {
        e.preventDefault();
        // Refocus the input to ensure keyboard events are captured
        e.target.focus();
      }}
      autoFocus
    />
  );
}
