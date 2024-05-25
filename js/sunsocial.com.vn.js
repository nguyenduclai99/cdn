document.addEventListener('DOMContentLoaded', function() {
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