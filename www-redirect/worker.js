// www.wiserrise.com → wiserrise.com. Statik site host'a göre yönlendiremediği için ayrı Worker; yol ve sorgu korunur.
export default {
  fetch(request) {
    const url = new URL(request.url);
    url.hostname = "wiserrise.com";
    return Response.redirect(url.toString(), 308);
  },
};
