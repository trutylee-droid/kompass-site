// 5korea.uk/app — камера навелась на код, и человек сразу в нужном магазине.
//
// ВАЖНО, ПОЧЕМУ ИМЕННО ТАК. Первая попытка выбирала магазин скриптом на самой
// странице — iOS считает переход, начатый скриптом, попыткой открыть чужое
// приложение и спрашивает разрешение. Лишний диалог на пути к установке.
//
// Теперь магазин выбирает сервер и отвечает обычным перенаправлением: для
// браузера это переход по ссылке, а apps.apple.com и play.google.com система
// открывает в своих приложениях сама, без вопросов.
//
// Кэш выключен намеренно: страница отдаёт разное разным устройствам, и
// закэшированный ответ увёл бы половину людей не туда.
const IOS = 'https://apps.apple.com/app/id6787089751';
const ANDROID = 'https://play.google.com/store/apps/details?id=kr.korea5.kompass_app';

export async function onRequest(context) {
  const ua = context.request.headers.get('user-agent') || '';
  const url = new URL(context.request.url);

  // ?page=1 — открыть саму страницу с телефона, не улетая в магазин
  if (!url.searchParams.has('page')) {
    const to = /iPad|iPhone|iPod/i.test(ua) ? IOS
             : /Android/i.test(ua) ? ANDROID : null;
    if (to) {
      return new Response(null, {
        status: 302,
        headers: {
          'Location': to,
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Vary': 'User-Agent',
        },
      });
    }
  }
  const res = await context.next();
  const out = new Response(res.body, res);
  out.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  out.headers.set('Vary', 'User-Agent');
  return out;
}
