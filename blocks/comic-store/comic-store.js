import { createOptimizedPicture } from '../../scripts/aem.js';

function getStatusVariant(text) {
  const normalized = text.toLowerCase();
  if (normalized.includes('sold')) return 'sold-out';
  if (normalized.includes('pre')) return 'preorder';
  return 'available';
}

function decorateStatus(cardBody) {
  const statusCandidate = [...cardBody.querySelectorAll('p, li')]
    .find((el) => {
      const text = el.textContent.trim();
      return text
        && text.length <= 36
        && !el.querySelector('a')
        && /(in stock|available|sold out|pre-?order)/i.test(text);
    });

  if (!statusCandidate) return;

  statusCandidate.classList.add('comic-store-status');
  statusCandidate.classList.add(`comic-store-status-${getStatusVariant(statusCandidate.textContent)}`);
}

export default function decorate(block) {
  const list = document.createElement('ul');

  [...block.children].forEach((row) => {
    const item = document.createElement('li');
    const cols = [...row.children];

    cols.forEach((col) => {
      const picture = col.querySelector('picture');
      const wrapper = document.createElement('div');
      wrapper.className = picture ? 'comic-store-card-image' : 'comic-store-card-body';
      while (col.firstElementChild) wrapper.append(col.firstElementChild);
      item.append(wrapper);
    });

    const image = item.querySelector('.comic-store-card-image img');
    if (image) {
      image.closest('picture').replaceWith(
        createOptimizedPicture(image.src, image.alt, false, [{ width: '750' }]),
      );
    }

    const body = item.querySelector('.comic-store-card-body');
    if (body) decorateStatus(body);

    list.append(item);
  });

  block.replaceChildren(list);
}
