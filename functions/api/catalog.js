// 5korea.uk/api/catalog — каталог услуг, прайс и график офисов для главной.
// Источник — Cloud Function siteCatalog (читает те же документы, что правят в
// панели). Здесь только прокси с кэшем Cloudflare на 10 минут: сайт ходит на
// свой домен (без CORS), а Firestore почти не читается при любой посещаемости.
// Если функция недоступна — 502, и страница остаётся со статичным текстом.
const SRC = 'https://us-central1-kompass-sandbox.cloudfunctions.net/siteCatalog';

export async function onRequest() {
  try {
    const r = await fetch(SRC, { cf: { cacheTtl: 600, cacheEverything: true } });
    if (!r.ok) throw new Error('src ' + r.status);
    return new Response(await r.text(), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (e) {
    return new Response('{"error":"unavailable"}', {
      status: 502,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  }
}
