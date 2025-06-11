console.log('Email Spam Classifier Extension is active');

const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
      const emailRows = document.querySelectorAll('tr.zA');
    } 
  });
});


const config = { childList: true, subtree: true };
observer.observe(document.body, config);

