const isURL = (str) => {
  // Regular expression pattern to match URLs
  const urlRegex = /^(?:https?|ftp):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
  
  // Test the string against the regex pattern
  return urlRegex.test(str);
}

const createLogs = async () => {
  let referrer = isURL(document.referrer) && (new URL(document.referrer)).hostname == window.location.hostname ? '' : document.referrer;
  let data = {
    end_point: `${window.location.pathname}?referrer=${referrer}`,
  }

  await fetch('https://tikhub-tau.vercel.app/api/v1/logs/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data) 
    })
}

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    createLogs();
  }, 700);
}, false);
