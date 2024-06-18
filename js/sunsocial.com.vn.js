document.addEventListener('DOMContentLoaded', function() {
    changeDocumentApi();
    fetchRate();

    let id = typeof user !== 'undefined' ? user?.id : ''

    setTimeout(() => {
        if (id !== 4353) {
            createLogs();
        }

        $('input[name="radio_seeding"]').change(function() {
            calculatePriceUsd();
        });
    
        $('#quantity').change(function() {
            calculatePriceUsd();
        });
    
        $('#quantity').keyup(function() {
            calculatePriceUsd();
        });

        selfCalculatePrice = calculatePriceUsd
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

const fetchRate = async () => {
    const response = await fetch('https://tuongtacmangxahoi.io.vn/api/rate-vnd-usd');
    const data = await response.json();
    const rateUsd = data?.data?.USD;
    localStorage.setItem('rate_usd', rateUsd)
};

const calculatePriceUsd = () => {
    var price = $('#price').val();
    var quantity = $('#quantity').val();

    var total = price * quantity;
    if (type === services.FACEBOOK_LIVESTREAM)
        total *= $('#live_time').val();
    if (type.match(/vip/) && $('#days').length) {
        total *= $('#days').val();
    }

    if (type === services.FACEBOOK_VIP_LIKE) {
        var hasMaxPost = !!seedingData.post_max;
        if (hasMaxPost) total *= $('#max_post').val();
    } else if (type === services.FACEBOOK_VIP_LIKE_GROUP) {
        total *= ($('#max_post').val() / 5);
    } else if (type === services.FACEBOOK_VIP_CMT) {
        var hasMaxPost = !!seedingData.post_max;
        if (hasMaxPost) total *= $('#max_post').val();
    } else if (type === services.FACEBOOK_VIP_SHARE) {
        total *= $('#max_post').val();
    } else if (type === services.TIKTOK_LIVE) {
        total *= $('#duration').val();
    }
    if($('#is_multi_order').is(':checked')){
        total *= parseInt($('#total_order').text());
    }

    const rateUsd = localStorage.getItem('rate_usd');
    var totalUsd = total / rateUsd;
    var totalPriceHtml = `${new Intl.NumberFormat('de-DE').format(total)} coin | ${new Intl.NumberFormat('de-DE').format(totalUsd.toFixed(2))} USD`;
    $('.total_price').html(totalPriceHtml);
}