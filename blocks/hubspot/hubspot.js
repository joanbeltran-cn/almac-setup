import { loadScript } from '../../scripts/aem.js';

export default async function decorate(block) {
  // Placeholder while block behavior is defined.
  const portalId = '742105';
  const formId = block.textContent.trim();
  block.textContent = '';
  block.innerHTML = '<div class="hubspot-form"></div>';
  await loadScript('https://js.hsforms.net/forms/v2.js');
  console.log(window.hbspt);
  if (window.hbspt) {
    console.log('hbspt');
    window.hbspt.forms.create({
      region: 'na1',
      portalId,
      formId,
      target: '.hubspot-form',
    });
  }
}
