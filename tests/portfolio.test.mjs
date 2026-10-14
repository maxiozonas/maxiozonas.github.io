import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const htmlFor = (locale, slug) => readFileSync(join(root, 'dist', locale, ...(slug ? ['projects', slug] : []), 'index.html'), 'utf8');
const projects = [
  ['Food Partners Patagonia S.A.', 'food-partners', undefined],
  ['Catalejo Travel', 'catalejo-travel', 'https://www.catalejotravel.com/es/'],
  ['Yogur Griego Rey', 'yogur-griego-rey', 'https://yogurgriegorey.com.ar/'],
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
      for (const text of ['Tech Lead', 'Food Partners Patagonia S.A.', 'Yogur Griego Rey', 'Gili', 'UTN']) assert.ok(html.includes(text));
      assert.equal((html.match(/<article[^>]*class="project-card/g) ?? []).length, projects.length);
      assert.doesNotMatch(html, /Full Stack Developer/);
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
        if (url) assert.ok(detail.includes(`href="${url}"`));
        assert.match(detail, new RegExp(`view-transition-name:\\s*project-${slug}`));
        assert.ok(home.includes(`view-transition-name:project-${slug}`));
        assert.match(detail, /Project scope|Alcance del trabajo/);
        if (slug !== 'food-partners') {
          for (const ext of ['png', 'webp']) assert.ok(existsSync(join(root, 'public', 'projects', `${slug}.${ext}`)));
          assert.ok(statSync(join(root, 'public', 'projects', `${slug}.webp`)).size < 200000);
          assert.match(detail, /project-devices--detail/);
          assert.ok(detail.includes(`/projects/${slug}-mobile.webp`));
          assert.ok(existsSync(join(root, 'public', 'projects', `${slug}-mobile.webp`)));
          assert.ok(existsSync(join(root, 'public', 'projects', `${slug}-mobile-390.webp`)));
        }
        assert.match(detail, /Mi participación|My contribution/);
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

  for (const locale of ['es', 'en']) {
    it(`separates ${locale} Xenova experience from the featured Food Partners case`, () => {
      const home = htmlFor(locale);
      const detail = htmlFor(locale, 'food-partners');
      assert.match(home, /id="experience-xenova"/);
      assert.doesNotMatch(home, /id="experience-food-partners"|cofounder|cofundador/i);
      assert.ok(home.includes(`href="/${locale}/projects/food-partners/"`));
      assert.match(home, /data-project="food-partners"[^>]*project-card-featured md:col-span-12/);
      assert.doesNotMatch(home, /erp-diagram|featured-project-copy/);
      assert.match(detail, /Mi Legajo/);
      assert.match(detail, /Centinela/);
      assert.match(detail, /Desarrollado en|Built at/);
      assert.doesNotMatch(detail, /class="button button-primary"/);
      assert.match(detail, /project-overview-areas/);
      assert.doesNotMatch(home + detail, /\/projects\/food-partners[^"\s]*\.(?:png|webp)/);
      assert.match(home, /\/companies\/xenova\.png/);
      assert.match(home, /Tech Lead · Developer/);
      assert.doesNotMatch(home, /Technical Director|Dirección técnica/);
      assert.doesNotMatch(detail, /Un ecosistema|One shared ecosystem/);
      const yogur = htmlFor(locale, 'yogur-griego-rey');
      assert.match(yogur, /WhatsApp/);
      assert.match(yogur, /consignaci[oó]n|consignment/i);
      assert.match(yogur, /recetas|recipes/i);
      assert.match(yogur, /finanzas|finances/i);
    });
  }

  it('publishes valid CV PDFs and the supporting image', () => {
    for (const locale of ['es', 'en']) {
      const pdf = readFileSync(join(root, 'public', `cv-maximo-ozonas-${locale}.pdf`));
      assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
      assert.ok(pdf.length > 10000);
    }
    assert.ok(existsSync(join(root, 'public', 'images', 'systems-study.webp')));
  });
});
