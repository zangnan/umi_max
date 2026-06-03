import { useState, useCallback } from 'react';

export default () => {
  const [fullscreen, setFullscreen] = useState(false);
  const changeFullscreen = useCallback(setFullscreen, []);
  return { fullscreen, setFullscreen, changeFullscreen };
};