const createLogs = async () => {
  let data = {
    end_point: window.location.href,
  }

  let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  let pathname = [
    '/dang-nhap',
    '/dang-ky',
  ]
  if ((user && user.id != 364072) || pathname.includes(location.pathname)) {
    await fetch('https://tikhub.onrender.com/api/v1/logs/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data) 
    })
  }
}

const getPaymets = async () => {
  try {
    $('#stk_payment').find('.col-md-2').remove();
    let c = getConfig().payment_syntax ?? 'naptien username';
    let u = getUser().username;
    payment_syntax = c.replace('username', u);
    api_key = getApiKey();
    let response = await fetch("https://1blike.com/api/v2/get-payment", {
      "headers": {
          "api-key": api_key,
      },
      "referrer": "https://tuongtacmangxahoi.io.vn/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": null,
      "method": "GET",
      "mode": "cors",
      "credentials": "omit"
    });

    let payments = await response.json();
    
    payments.data.forEach(item => {
      let html_payment = '';
      let img = '';
      img = '<img id="img_bank" width="300px" height="auto" src="https://img.vietqr.io/image/' + item.name + '-' + item.stk + '-print.png?accountName=' + item.full_name + '&addInfo=' + payment_syntax + '" alt="">';
      if (item.name === 'Momo') {
          img = '<img width="200" height="200" src="https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=2|99|' + item.stk + '|||0|0|0|' + payment_syntax + '|transfer_myqr" alt="">';
      }
      html_payment+='<div class="col-md-3 mt-2">'
      html_payment+='<div class="">'
      html_payment+='<div class="card border-0 bg-warning rounded-10 ">'
      html_payment+='<div class="card-body">'
      html_payment+='<h6> Ngân hàng: <span class="font-weight-bold">' + item.name + '</span></h6>'
      html_payment+='<h6> Chủ TK: <span class="font-weight-bold">' + item.full_name + '</span></h6>'
      html_payment+='<h6> STK: <span class="font-weight-bold">' + item.stk + '</span></h6>'
      html_payment+='<h6> Chi nhánh: <span class="font-weight-bold">' + item.branch + '</span></h6>'
      html_payment+=img
      html_payment+='</div>'
      html_payment+='</div>'
      html_payment+='</div>'
      html_payment+='</div>'
      $('#stk_payment').append(html_payment);
    }); 
  } catch (error) {
    console.log(error);
  }
}

const getNotificantions = () => {
  api_key = getApiKey();
  var settings = {
    "url": "https://1blike.com/api/v2/get-system-notify",
    "method": "GET",
    "headers": {
      "api-key": api_key,
    },
  };
    
  $.ajax(settings).done(function (response) {
    if (response.data.length > 0) {
      modalSuccessV2(response.data[0].content)
    }
    console.log(response);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  let pathname = window.location.pathname
  setTimeout(() => {
    createLogs();
    if (pathname == '/nap-tien') {
      //getPaymets();
    }

    if (pathname == '/') {
      getNotificantions();
    }
  }, 700);
}, false);