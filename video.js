// Paper explainer videos: links with data-video open a lightbox player.
// Wide screens get the 16:9 cut, phones and portrait screens the 4:5 cut.
// Without JavaScript the links simply open the MP4.
(function () {
  var dialog, video, title, download;

  function portraitScreen() {
    return window.matchMedia("(max-width: 720px), (max-aspect-ratio: 1/1)").matches;
  }

  function build() {
    dialog = document.createElement("dialog");
    dialog.className = "player";
    dialog.innerHTML =
      '<video controls playsinline preload="auto"></video>' +
      '<div class="player-bar">' +
        '<p class="player-title"></p>' +
        '<div class="player-actions">' +
          '<a class="player-link" download>Download MP4</a>' +
          '<button class="player-close" type="button" aria-label="Close video">' +
            '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>Close' +
          "</button>" +
        "</div>" +
      "</div>";
    document.body.appendChild(dialog);
    video = dialog.querySelector("video");
    title = dialog.querySelector(".player-title");
    download = dialog.querySelector(".player-link");
    dialog.querySelector(".player-close").addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener("close", function () {
      video.pause();
      video.removeAttribute("src");
      video.load();
    });
  }

  function open(link) {
    if (!dialog) build();
    var name = link.getAttribute("data-video");
    var cut = portraitScreen() ? "-portrait" : "";
    var src = "videos/" + name + cut + ".mp4";
    dialog.classList.toggle("portrait", cut !== "");
    dialog.setAttribute("aria-label", "Video: " + link.getAttribute("data-title"));
    title.textContent = link.getAttribute("data-title");
    download.href = src;
    video.poster = "videos/" + name + cut + ".jpg";
    video.src = src;
    dialog.showModal();
    var play = video.play();
    if (play && play.catch) play.catch(function () {});
  }

  if (typeof HTMLDialogElement !== "function") return;
  document.addEventListener("click", function (e) {
    var link = e.target.closest("a[data-video]");
    if (!link || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    open(link);
  });
})();
