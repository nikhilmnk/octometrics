/**
 * Parse all banner parameters from raw query values.
 */
export const generateBanner = (name, title, tech, options = {}) => {
  const techStack = tech
    ? tech.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  return {
    name: name.trim(),
    title: title ? title.trim() : null,
    subtitle: options.subtitle ? options.subtitle.trim() : null,
    location: options.location ? options.location.trim() : null,
    social: options.social ? options.social.split(',').map(s => s.trim()).filter(Boolean) : [],
    techStack,
    wave: options.wave !== 'false',      // animated wave on by default
    pattern: options.pattern || 'dots',     // 'dots' | 'grid' | 'none'
    align: options.align || 'center',   // 'center' | 'left'
  };
};