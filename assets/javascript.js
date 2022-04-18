window.addEventListener('DOMContentLoaded', function() {
  function click(selector, callback) { document.querySelectorAll(selector).forEach(function(e) { e.addEventListener('click', function(ev) { callback(ev, e); }); }) }
  function hideMenus(except) { document.querySelectorAll('menu.active').forEach(function(e) { if (e != except) e.classList.remove('active'); }) }
  function setActive(id, pushState) {
    hideMenus();
    document.querySelectorAll('pages page.active').forEach(function(p) { p.classList.remove('active'); });
    (document.querySelector("#page-" + (id || "index")) || document.querySelector('#page-404')).classList.add('active');
    document.querySelectorAll('pages page.active img').forEach(function(e) { e.setAttribute('src', e.getAttribute('data-src')); });
    document.querySelector('content').className = id || "index";
    document.title = "Lite XL" + (id && id != "index" ? " - " + document.querySelector('page.active h1').textContent : "");
    if (pushState) 
      history.pushState({ id: id }, document.title, window.location.pathname + (id && id != "index" ? "?/" + id.replace(/\-/g,"/") : ""));
  }
  click('menu', function(ev, e) { hideMenus(e); ev.stopPropagation(); e.classList.toggle('active'); });
  click('expander', function() { document.querySelector('links').classList.toggle('active'); });
  click('body', hideMenus);
  click('a', function(ev, e) {
    if (!/^(#|(\w+:)?\/\/|assets)/.test(e.getAttribute('href'))) {
      ev.stopPropagation(); ev.preventDefault();
      setActive(e.getAttribute('href').toLowerCase().replace(/(^\w{2}(\/|$)|\/$)/g, "").replace(/\//g, "-"), true);
    }
  });
  window.addEventListener('popstate', function(ev) { setActive(ev.state.id, false); });
  setActive(window.location.search.replace(/(^\?\/?|\/$)/g, "").replace(/\//g, "-"), true);
});
