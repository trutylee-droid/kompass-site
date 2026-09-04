// 5korea.uk/app — переход в нужный магазин БЕЗ вопроса «открыть в App Store?».
//
// Раньше выбор магазина делал скрипт на странице. Safari считает переход,
// начатый скриптом, попыткой открыть чужое приложение и спрашивает разрешение —
// человек видел лишний диалог. Решение: отвечать сразу перенаправлением от
// сервера. Для браузера это обычный переход по ссылке, диалога нет.
//
// Компьютер и всё непонятное получают обычную страницу с двумя кнопками и QR.
const IOS = 'https://apps.apple.com/app/id6787089751';
const ANDROID = 'https://play.google.com/store/apps/details?id=kr.korea5.kompass_app';

export async function onRequest(context) {
  const ua = context.request.headers.get('user-agent') || '';
  const url = new URL(context.request.url);

  // ?page=1 — посмотреть саму страницу с телефона, не улетая в магазин
  if (url.searchParams.has('page')) return context.next();

  if (/iPad|iPhone|iPod/i.test(ua)) return Response.redirect(IOS, 302);
  if (/Android/i.test(ua)) return Response.redirect(ANDROID, 302);
  return context.next();
}
