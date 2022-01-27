chrome.devtools.panels.create(
  'Interceptor',
  '',
  'static/index.html',
  (panel) => {
    panel.onShown.addListener((window) => {
      console.log(chrome.devtools.panels);
    });
  }
);
