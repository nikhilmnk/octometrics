import { escapeSVG } from "../utils/sanitize.js";

export const generateTypingCard = ({
  typingData,
  font = "Fira Code",
  size = 28,
  width = 700,
  color = "00F7FF"
}) => {

  const { lines, typeTime, pause = 1000, totalLineTime } = typingData;

  const svgHeight = 90;
  const totalMs = lines.length * totalLineTime;
  const totalS = (totalMs / 1000).toFixed(3);
  const pct = (ms) => ((ms / totalMs) * 100).toFixed(4);

  const htmlLines = lines.map((line, i) => {
    const chars = line.length;
    const t0 = i * totalLineTime;        // typing starts
    const t1 = t0 + typeTime;            // typing ends
    const t2 = t1 + (pause || 0);        // hold ends / erase starts
    const t3 = (i + 1) * totalLineTime;  // erase ends

    // Build one keyframe that covers the whole cycle (totalMs).
    // border-right-width: 0 hides the cursor on inactive lines;
    // blink animation handles color toggling while active.
    let kf = `@keyframes kf${i} {\n`;

    if (i === 0) {
      kf += `  0% { width:0; border-right-width:3px; animation-timing-function:steps(${chars},end); }\n`;
    } else {
      kf += `  0% { width:0; border-right-width:0; }\n`;
      kf += `  ${pct(t0)}% { width:0; border-right-width:3px; animation-timing-function:steps(${chars},end); }\n`;
    }

    kf += `  ${pct(t1)}% { width:calc(${chars}*1ch); border-right-width:3px; animation-timing-function:steps(1,end); }\n`;

    if (pause > 0) {
      kf += `  ${pct(t2)}% { width:calc(${chars}*1ch); border-right-width:3px; animation-timing-function:steps(${chars},end); }\n`;
    }

    kf += `  ${pct(t3)}% { width:0; border-right-width:0; }\n`;

    if (i !== lines.length - 1) {
      kf += `  100% { width:0; border-right-width:0; }\n`;
    }

    kf += `}`;

    return `
      <div class="line line${i}">${escapeSVG(line)}</div>
      <style>
      .line${i} {
        animation: kf${i} ${totalS}s linear 0s infinite, blink 1s step-end infinite;
      }
      ${kf}
      </style>
    `;
  }).join("");

  return `
<svg width="${width}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
<foreignObject width="100%" height="100%">
<div xmlns="http://www.w3.org/1999/xhtml" class="wrapper">
<style>
.wrapper{
  display:flex;
  align-items:center;
  justify-content:center;
  height:100%;
  font-family:'${font}', monospace;
  font-size:${size}px;
  color:#${color};
}
.line{
  overflow:hidden;
  white-space:nowrap;
  border-right:3px solid #${color};
  border-right-width:0;
  width:0;
  min-width:0;
}
@keyframes blink{
  50%{border-right-color:transparent}
}
</style>
${htmlLines}
</div>
</foreignObject>
</svg>
`;
};