import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const htmlFor = (locale, slug) => readFileSync(join(root, 'dist', locale, ...(slug ? ['projects', slug] : []), 'index.html'), 'utf8');
const projects = [
  ['Catalejo Travel', 'catalejo-travel', 'https://www.catalejotravel.com/es/'],
  ['Quinta Pata', 'quinta-pata', 'https://5tapata.com.ar/'],
  ['Inspira Ingeniería', 'inspira-ingenieria', 'https://www.ingenieriainspira.com/'],
  ['Madryn Buceo', 'madryn-buceo', 'https://madrynbuceo.xenova.com.ar/'],
];

describe('static bilingual portfolio', () => {
  for (const locale of ['es', 'en']) {
    it(`keeps ${locale} content, navigation and downloads available without JavaScript`, () => {
      const html = htmlFor(locale);
      assert.match(html, /<h1\b/);
      assert.ok(html.includes('Ozonas'));
      for (const id of ['main-content', 'experience', 'projects', 'contact']) assert.ok(html.includes(`id="${id}"`));
      for (const text of ['Full Stack Developer', 'Food Partners Patagonia S.A.', 'Gili', 'UTN']) assert.ok(html.includes(text));
      assert.equal((html.match(/<article class="project-card/g) ?? []).length, 4);
      assert.ok(html.includes(`href="/cv-maximo-ozonas-${locale}.pdf"`));
      assert.doesNotMatch(html, /[—–]|repl-input|data-cmd=/);
      assert.match(html, /magic-bento-card/);
      assert.doesNotMatch(html, /data-project-carousel/);
      assert.match(html, /Mi Legajo/);
      assert.match(html, /\/education\/utn.png/);
    });

    for (const [name, slug, url] of projects) {
      it(`generates ${locale}/${slug} with accurate metadata, scope, shared image and return link`, () => {
        const home = htmlFor(locale);
        const detail = htmlFor(locale, slug);
        assert.ok(home.includes(`href="/${locale}/projects/${slug}/"`));
        assert.ok(detail.includes(`<title>${name} | Máximo Ozonas</title>`));
        assert.ok(detail.includes(`href="https://maxiozonas.github.io/${locale}/projects/${slug}/"`));
        assert.ok(detail.includes(`href="/${locale}/#projects"`));
        assert.ok(detail.includes(`href="${url}"`));
        assert.ok(detail.includes(`view-transition-name: project-${slug}`));
        assert.ok(home.includes(`view-transition-name:project-${slug}`));
        assert.match(detail, /Project scope|Alcance del trabajo/);
        for (const ext of ['png', 'webp']) assert.ok(existsSync(join(root, 'public', 'projects', `${slug}.${ext}`)));
        assert.ok(statSync(join(root, 'public', 'projects', `${slug}.webp`)).size < 200000);
        assert.doesNotMatch(detail, /[—–]/);
      });
    }
  }

  it('describes implemented company work and preserves accurate inquiry and affiliation scope', () => {
    assert.match(htmlFor('es', 'catalejo-travel'), /consulta|consultas/);
    assert.match(htmlFor('es', 'quinta-pata'), /afiliaci[oó]n/);
    assert.match(htmlFor('es'), /ecosistema ERP|ecommerce/);
    assert.match(htmlFor('en'), /Mi Legajo|freight/);
    assert.doesNotMatch(htmlFor('es'), /en desarrollo|en curso/i);
    assert.doesNotMatch(htmlFor('en'), /ongoing development|rollout is ongoing/i);
    assert.doesNotMatch(htmlFor('es', 'catalejo-travel'), /se procesa el pago online|reserva pagada/i);
  });

  it('publishes valid CV PDFs and the supporting image', () => {
    for (const locale of ['es', 'en']) {
      const pdf = readFileSync(join(root, 'public', `cv-maximo-ozonas-${locale}.pdf`));
      assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
      assert.ok(pdf.length > 10000);
    }
    assert.ok(existsSync(join(root, 'public', 'images', 'systems-study.webp')));
  });
});
