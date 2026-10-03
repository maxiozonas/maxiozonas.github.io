import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { describe, it } from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));

function htmlFor(locale) {
  return readFileSync(join(root, "dist", locale, "index.html"), "utf8");
}

describe("portfolio routes", () => {
  for (const locale of ["es", "en"]) {
    it(`renders the full ${locale} portfolio as visible server HTML`, () => {
      const html = htmlFor(locale);
      assert.match(html, /<main\b/);
      assert.match(html, /id="experience"/);
      assert.match(html, /id="projects"/);
      assert.match(html, /Food Partners Patagonia S\.A\./);
      assert.match(html, /Gili/);
      assert.match(html, /<h1\b[^>]*>[\s\S]*Máximo[\s\S]*Ozonas[\s\S]*<\/h1>/);
      assert.match(html, /Full Stack Developer/);
      assert.doesNotMatch(html, /Software que conecta|Software that connects/);
      assert.doesNotMatch(html, /class="seo"/);
      assert.doesNotMatch(html, /repl-input|repl-toolbar|data-cmd=/);
      assert.match(html, new RegExp(`href="/cv-maximo-ozonas-${locale}\\.pdf"`));
      assert.doesNotMatch(html, /<title>[^<]*[—–]/);
    });
  }

  it("closes the mobile navigation after an internal destination and moves focus out of the closed panel", () => {
    const source = readFileSync(join(root, "src", "components", "Portfolio.astro"), "utf8");
    assert.match(source, /navCapsule\?\.addEventListener\(["']click["']/);
    assert.match(source, /window\.matchMedia\(["']\(max-width: 760px\)["']\)/);
    assert.match(source, /\.site-nav a\[href\^=["']#["']\]/);
    assert.match(source, /navCapsule\.open\s*=\s*false/);
    assert.match(source, /destination\.focus\(\{\s*preventScroll:\s*true\s*\}\)/);
  });

  it("declares a text monogram favicon and a title without dash punctuation", () => {
    const html = htmlFor("es");
    const href = html.match(/<link rel="icon"[^>]*href="([^"]+)"/)?.[1];
    assert.ok(href?.startsWith("data:image/svg+xml,"), "favicon should be an inline SVG data URI");
    const svg = decodeURIComponent(href.slice(href.indexOf(",") + 1));
    assert.match(svg, /<svg\b/);
    assert.match(svg, /<text\b[^>]*>MO<\/text>/);
    assert.doesNotMatch(html, /<title>[^<]*[—–]/);
  });
});

describe("verified client portfolio", () => {
  const projects = [
    ["Catalejo Travel", "https://www.catalejotravel.com/es/", "catalejo-travel.png"],
    ["Quinta Pata", "https://5tapata.com.ar/", "quinta-pata.png"],
    ["Inspira Ingeniería", "https://www.ingenieriainspira.com/", "inspira-ingenieria.png"],
    ["Madryn Buceo", "https://madrynbuceo.xenova.com.ar/", "madryn-buceo.png"],
  ];

  it("shows exactly four authentic client links with local screenshots", () => {
    const html = htmlFor("es");
    for (const [name, href, image] of projects) {
      assert.ok(html.includes(name), `${name} should be rendered`);
      assert.ok(html.includes(href), `${name} should link to its public site`);
      assert.ok(html.includes(image), `${name} should use its authentic screenshot`);
      assert.ok(existsSync(join(root, "public", "projects", image)), `${image} should exist`);
    }
    assert.equal((html.match(/<article class="project-card"/g) ?? []).length, 4);
  });

  it("provides a keyboard-operable featured-project rotator and no-JS details for all cases", () => {
    const html = htmlFor("es");
    assert.match(html, /class="project-carousel"/);
    assert.match(html, /data-project-prev/);
    assert.match(html, /data-project-next/);
    assert.match(html, /aria-live="polite"/);
    assert.equal((html.match(/<details\b[^>]*class="project-details"/g) ?? []).length, 4);
    assert.match(html, /Project scope|Alcance del trabajo/i);
  });

  it("keeps inquiry, affiliation, and ongoing-work wording honest", () => {
    const es = htmlFor("es");
    const en = htmlFor("en");
    assert.match(es, /consulta|consultas/i);
    assert.match(es, /afiliaci[oó]n/i);
    assert.match(es, /en desarrollo|en curso/i);
    assert.doesNotMatch(es, /(?:se|ya) (?:entregaron|implementaron) planes|se procesa el pago online|reserva pagada/i);
    assert.doesNotMatch(en, /plans? (?:have been|were) delivered|online payment is processed|paid reservations? (?:are|were) available/i);
  });
});

describe("public CV assets", () => {
  it("publishes both verified one-page CVs and links each locale to its version", () => {
    for (const locale of ["es", "en"]) {
      const file = `cv-maximo-ozonas-${locale}.pdf`;
      assert.ok(existsSync(join(root, "public", file)), `${file} should exist`);
      assert.ok(htmlFor(locale).includes(`href="/${file}"`));
    }
  });
});
