/**
 * Where a video tile's link points decides how it plays: a file we host goes in
 * a <video> element, anything else is treated as a YouTube/Vimeo embed.
 */
export const isPlayableFile = (href: string) =>
  href.startsWith("/") || /\.(mp4|webm|mov)(\?|$)/i.test(href);
