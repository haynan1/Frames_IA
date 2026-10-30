import {movements} from './content.js';

export function buildPrompt(values){
  const mode = values.mode === 'image' ? 'image' : 'video';
  const subject = String(values.subject || 'the approved product in the reference image').trim();
  const environment = String(values.environment || 'a quiet sandstone studio').trim();
  const movement = movements.find(m=>m.id === values.movement) || movements[0];
  const framing = {full:'full-body or entire-product shot',medium:'medium shot',close:'close-up',macro:'extreme close-up of a visible detail'}[values.framing] || 'medium shot';
  const light = {window:'large soft window light from camera left',hard:'hard grazing light from camera left with defined shadows',back:'controlled backlight with subtle front fill',overcast:'soft neutral overcast daylight'}[values.light] || 'large soft window light from camera left';
  const rhythm = {slow:'slow and controlled',moderate:'moderate and fluid',fast:'brisk but readable'}[values.rhythm] || 'slow and controlled';
  const format = ['9:16','4:5','16:9','1:1'].includes(values.format) ? values.format : '9:16';
  const duration = Math.max(2,Math.min(10, Number(values.duration) || 4));
  const base = `Reference attachment: referencia-aprovada.png controls the visible subject identity and design. Subject: ${subject}. Setting: ${environment}. Framing: ${framing}, eye-level view. Lighting: ${light}, consistent natural color and physically plausible shadows.`;
  const invariants = 'Preserve the approved face when present, product geometry, proportions, garment construction, colors and visible label characters. Keep grounded contact, plausible hands and material behavior. Do not invent hidden details, branding or product claims. No generated overlay text.';
  if(mode === 'image') return `${base}\n\nCreate one photographic still. Stable composition with clear subject separation and space for layout. ${invariants}\n\nTarget composition: ${format}. Set actual dimensions in the image tool. Human reference comparison required before approval.`;
  const moveInstructions = {
    'dolly-in':'Camera travels physically forward with a fixed focal length; start in the stated framing and finish closer. Foreground parallax is stronger than background parallax.',
    'dolly-out':'Camera travels physically backward with a fixed focal length; start in the stated framing and reveal more of the approved environment.',
    zoom:'Camera position stays fixed. Increase lens magnification smoothly; no dolly or perspective change.',
    pan:'Rotate the camera slowly right from a fixed position, revealing the subject near the center at the end. No lateral camera translation.',
    tilt:'Tilt the camera upward from a fixed height, ending on the visible upper subject. No pedestal movement.',
    truck:'Translate the camera laterally left. Keep the subject stationary. Foreground passes faster than the distant background.',
    orbit:'Move the camera clockwise along a short 25-degree arc around the stationary subject, keeping it centered. The object does not rotate.',
    pedestal:'Raise the camera vertically while keeping the lens approximately horizontal. No tilt.',
    tracking:'Track laterally alongside the subject as it takes two natural steps, maintaining a stable medium distance.',
    crane:'Raise and retreat the camera on a gentle crane path to reveal the approved surrounding space.',
    roll:'Rotate the camera 12 degrees clockwise around the optical axis and settle. Keep the subject centered and rigid.',
    'dolly-zoom':'Dolly backward and zoom in simultaneously to keep subject size similar while the background perspective changes. Preserve rigid straight lines.',
    'rack-focus':'Camera stays locked. Shift focus from a visible foreground detail to a second visible plane. Keep geometry unchanged.',
    static:'Keep the camera locked and the subject stationary. Only a restrained natural highlight changes.'
  };
  return `${base}\n\nOne continuous ${duration}-second shot, ${rhythm}. ${moveInstructions[movement.id]} End with a brief stable hold. ${invariants}\n\nTarget composition: ${format}. No dialogue or music; add cleared sound in editing. Configure actual duration and resolution in the video tool. Review start, middle and end frames before approval.`;
}
