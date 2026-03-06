export const generateTyping = (lines, duration = 3000, pause = 1000) => {
  // Ensure lines is an array
  const linesArray = Array.isArray(lines) ? lines : [lines || 'Hello World'];
  const validLines = linesArray.filter(line => line && line.trim().length > 0);

  // duration = total ms to type one full line
  // pause    = ms to hold the line before erasing
  const typeTime = Math.max(500, duration);        // at least 500ms to type
  const eraseTime = Math.max(300, duration * 0.4); // erase slightly faster
  const totalLineTime = typeTime + pause + eraseTime;
  const totalTime = totalLineTime * validLines.length;

  return {
    lines: validLines,
    duration,
    pause,
    typeTime,
    eraseTime,
    totalLineTime,
    totalTime,
  };
};