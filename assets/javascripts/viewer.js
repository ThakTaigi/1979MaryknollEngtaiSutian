(function(){
  let imgSources = [];
  const imgSourcesMin = 1;
  const imgSourcesMax = 1007;
  for (i = imgSourcesMin; i < imgSourcesMax + 1; i++) {
    imgSources.push({
      type: 'image',
      url:  `../chheh/1979MaryknollEngtaiSutian_Page_${('000' + i).slice(-4)}.jpg`
    })
  }
  const viewer = OpenSeadragon({
    id: 'viewer-block',
    prefixUrl: '../assets/images/openseadragon/',
    tileSources: imgSources,
    sequenceMode: true,
    preload: true,
    minZoomImageRatio: 1,
    maxZoomPixelRatio: 4,

    zoomInButton:   'viewer-zoom-in',
    zoomOutButton:  'viewer-zoom-out',
    homeButton:     'viewer-home',
    nextButton:     'viewer-next',
    previousButton: 'viewer-prev',
  });

  let loadingImg = document.createElement('div');
  loadingImg.className = 'viewer__loading';
  loadingImg.id = 'loading-img';

  function replaceQueryParam(param, newval, search) {
    var regex = new RegExp("([?;&])" + param + "[^&;]*[;&]?");
    var query = search.replace(regex, "$1").replace(/&$/, '');

    return (query.length > 2 ? query + "&" : "?") + (newval ? param + "=" + newval : '');
  }

  function pageValid(page) {
    if (page < imgSourcesMin || page > imgSourcesMax) {
      return false;
    }
    else {
      return true;
    }
  }

  function modifyUrl(page) {
    const state = {'page': page};
    window.history.pushState(state, '', replaceQueryParam('page', page, window.location.search));
  }

  function displayCurrentPage(currentPage){
    document.getElementById('current-page').innerHTML = "第 "+ currentPage + " 頁／總算 " + (imgSourcesMax - imgSourcesMin + 1) + " 頁。";
  }
  displayCurrentPage(imgSourcesMin);
  document.getElementById('viewer-block').append(loadingImg);

  document.getElementById('viewer-block').querySelector('.openseadragon-canvas').focus();

  // get page from url
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  if (params.page) {
    if (pageValid(params.page)) {
      const pageIndex = parseInt(params.page, 10) - 1;
      viewer.goToPage(pageIndex); 
      displayCurrentPage(params.page);
    }
    else {
      viewer.goToPage(imgSourcesMin - 1); 
      displayCurrentPage(imgSourcesMin);
      modifyUrl(imgSourcesMin);
    }
  }
  viewer.addOnceHandler('open', function() {
    document.getElementById('loading-img').remove();
  });

  // flip pages
  viewer.addHandler('page', function (data) {
    const pageNum = parseInt(data.page, 10) + 1;
    displayCurrentPage(pageNum);
    modifyUrl(pageNum);

    document.getElementById('viewer-block').append(loadingImg);
    viewer.addOnceHandler('open', function() {
      document.getElementById('loading-img').remove();
    });
  });

  // browser history
  window.onpopstate = function(e){
    // nice to have
  };

  // go to page
  function pageClamp(page) {
    return Math.min(imgSourcesMax, Math.max(imgSourcesMin, page));
  }

  document.getElementById('goto-page').addEventListener('keyup', function(e){
    if (!e) e = window.event;
    var keyCode = e.code || e.key;
    if (keyCode === 'Enter' || keyCode === 'NumpadEnter'){
      viewer.goToPage(pageClamp(this.value) - 1); 
      this.value = '';
      return false;
    }
  });
  document.getElementById('goto-page__go').addEventListener('click', function(){
    viewer.goToPage(pageClamp(document.getElementById('goto-page').value) - 1); 
  });
})();
