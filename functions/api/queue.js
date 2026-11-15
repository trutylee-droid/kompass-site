// 5korea.uk/api/queue — очередь в офисе (форма по QR, страница /queue).
// Прокси на панель (app.5korea.uk/api/q → служба перерасчёта): форма ходит на свой домен, без CORS.
// Проверка кода офиса из QR, пределы по числу запросов и размер фото — на стороне службы.
// Адрес клиента передаём явно: за Cloudflare служба иначе видела бы только адрес Cloudflare.
const DST = 'https://app.5korea.uk/api/q';

export async function onRequestPost(context) {
  const req = context.request;
  const len = Number(req.headers.get('content-length') || 0);
  const json = (o, s) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
  if (len > 6.5e6) return json({ error: 'Фото слишком большое' }, 413);
  try {
    const body = await req.text();
    const r = await fetch(DST, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-client-ip': req.headers.get('cf-connecting-ip') || '' },
      body,
    });
    return new Response(await r.text(), { status: r.status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
  } catch (e) {
    return json({ error: 'Сервис временно недоступен. Подойдите к сотруднику.' }, 502);
  }
}

export async function onRequest() {
  return new Response('{"error":"method"}', { status: 405, headers: { 'Content-Type': 'application/json' } });
}
