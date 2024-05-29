document.addEventListener('DOMContentLoaded', function() {
    changeDocumentApi();

    setTimeout(() => {
        createLogs();
    }, 700);
  }, false);

const isURL = (str) => {
    // Regular expression pattern to match URLs
    const urlRegex = /^(?:https?|ftp):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
    
    // Test the string against the regex pattern
    return urlRegex.test(str);
}
  
const createLogs = async () => {
    let referrer = isURL(document.referrer) && (new URL(document.referrer)).hostname == window.location.hostname ? '' : document.referrer;
    let username = typeof user !== 'undefined' ? user?.username : ''
    let data = {
        end_point: `${window.location.pathname}?referrer=${referrer}&username=${username}`,
    }
  
    await fetch('https://tikhub.onrender.com/api/v1/logs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data) 
    })
}

const changeDocumentApi = () => {
    // Get all anchor tags
    const anchorTags = document.querySelectorAll('a');

    // Filter anchor tags with href starting with the specified URL
    const filteredAnchors = Array.from(anchorTags).filter(anchor => 
        anchor.href.startsWith('https://documenter.getpostman.com')
    );

    // Change the href attribute for each filtered anchor
    filteredAnchors.forEach(anchor => {
        anchor.href = 'https://documenter.getpostman.com/view/9290027/2sA3QtdWDu';
    });
}