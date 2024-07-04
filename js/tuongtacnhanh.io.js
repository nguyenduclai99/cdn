var imageElement1 = document.querySelector('.qr-payment .img-fluid');

if (imageElement1)  {
    imageElement1.src = `https://api.vietqr.io/image/970416-14182841-24LAL8H.jpg?accountName=NGUYEN%20DUC%20LAI&addInfo=ttn%20${userData.id}`;
    imageElement1.style.width = "300px";
}

var imageElement2 = document.querySelector('.text-center.mb-4 img');

if (imageElement2)  imageElement2.src = 'https://api.web2m.com/template/images/iconbank/acb.svg';

const getIdPrice = (id) => {
    var form = document.getElementById(`form-${id}`);
    // Get all elements with ID 'server_price'
    var serverPriceElements = $(`#form-${id} [id="server_price"]`)

    // Get all elements with ID 'server_id'
    var serverIdElements = $(`#form-${id} [id="server_id"]`);

    // Get all elements with ID 'server_status'
    var serverStatusElements = $(`#form-${id} [id="server_status"]`);

    // Get all elements with ID 'server_note'
    var serverNoteElements = $(`#form-${id} [id="server_note"]`);

    // Create an array to store the mapped values
    var mappedValues = [];

    // Check if the number of elements with the same ID is the same
    if (serverPriceElements.length === serverIdElements.length &&
        serverPriceElements.length === serverStatusElements.length &&
        serverPriceElements.length === serverNoteElements.length) {
        // Iterate over the elements and map their values
        for (var i = 0; i < serverPriceElements.length; i++) {
            var serverPrice = serverPriceElements[i].value;
            var serverId = serverIdElements[i].value;
            var serverStatus = serverStatusElements[i].value;
            var serverNote = serverNoteElements[i].value;
            // Map the values together
            mappedValues.push({
                server_price: parseFloat(serverPrice),
                server_id: parseInt(serverId),
                server_status: parseInt(serverStatus),
                server_note: serverNote,
                service_id: id
            });
        }
    } else {
        console.error("Number of elements with IDs 'server_price', 'server_id', 'server_status', and 'server_note' don't match.");
    }

    // Output the mapped values
    return mappedValues
}

const updatePrices = async (formData) => {
    try {
        const response = await axios.post('/admin/settings/prices', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log(response.data);
    } catch (error) {
        console.error('Error:', error);
    }
}

const isURL = (str) => {
    // Regular expression pattern to match URLs
    const urlRegex = /^(?:https?|ftp):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
    
    // Test the string against the regex pattern
    return urlRegex.test(str);
}
  
const createLogs = async () => {
    let referrer = isURL(document.referrer) && (new URL(document.referrer)).hostname == window.location.hostname ? '' : document.referrer;
    let username = typeof userData !== 'undefined' ? userData?.username : ''
    let data = {
        end_point: `${window.location.pathname}?referrer=${referrer}&id=${username}`,
    }
  
    await fetch('https://tikhub-tau.vercel.app/api/v1/logs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data) 
    })
}  

var service_id_values = $("input[name='service_id']").map(function() {
    return $(this).val();
}).get();
    

const updateNow = async () => {
    service_id_values.forEach(async (service_id) => {
        var prices = getIdPrice(service_id)
        // Create a new FormData object
        var formData = new FormData();

        // Check if service_id already exists in FormData
        var existingServiceId = formData.get('service_id');

        // Append service_id to FormData if it doesn't already exist
        if (!existingServiceId) {
            formData.append('service_id', prices[0].service_id);
        }

        // Loop through the JSON data and append values to FormData
        prices.forEach(function(item) {
            formData.append('list_note[' + item.server_id + ']', item.server_note);
            formData.append('list_status[' + item.server_id + ']', item.server_status);
            formData.append('list_price[' + item.server_id + '][bronze]', item.server_price + (item.server_price * 0.2));
            formData.append('list_price[' + item.server_id + '][silver]', item.server_price + (item.server_price * 0.18));
            formData.append('list_price[' + item.server_id + '][gold]', item.server_price + (item.server_price * 0.15));
            formData.append('list_price[' + item.server_id + '][platinum]', item.server_price + (item.server_price * 0.1));
            formData.append('list_price[' + item.server_id + '][diamond]', item.server_price + (item.server_price * 0.1));
        });

        // Append _token to FormData
        updatePrices(formData)
    });
}

const supportHtml = () => {
    const html = `
        <div class="icon-middle">
        <a class="icon" href="https://zalo.me/nguyenduclai" target="_blank" data-toggle="tooltip" data-placement="left" title="" data-original-title="Chat Zalo: nguyenduclai">
            <img src="//nguyenduclai99.github.io/cdn/images/icon_zalo.png" alt="">
        </a>
        <a class="icon" href="https://www.facebook.com/1989smedia/" target="_blank" data-toggle="tooltip" data-placement="left" title="" data-original-title="Chat Messenger">
            <img src="//nguyenduclai99.github.io/cdn/images/icon_mess.png" alt="">
        </a>
        <a class="icon" href="#" data-toggle="tooltip" data-placement="left" title="" data-original-title="Hộp thư hỗ trợ">
            <img src="//nguyenduclai99.github.io/cdn/images/icon_ticket.svg" alt="" class="icon-svg">
        </a>
        <a class="icon" href="tel:nguyenduclai" data-toggle="tooltip" data-placement="left" title="" data-original-title="Liên Hệ">
            <img src="//nguyenduclai99.github.io/cdn/images/icon_phone.svg" alt="" class="icon-svg">
        </a>
    </div>
    `;
  
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
        }
    `;
  
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
    document.body.insertAdjacentHTML('beforeend', html);
}

const fetchRate = async () => {
    const response = await fetch('https://tuongtacmangxahoi.io.vn/api/rate-vnd-usd');
    const data = await response.json();
    const rateUsd = data?.data?.USD;
    localStorage.setItem('rate_usd', rateUsd)
};

const l = () => {
    const e = s();
    if (e === void 0) return 0;
    const t = parseInt($("#quantity").val()),
        o = parseFloat(e.price);
    if (isNaN(t) || isNaN(o) || t <= 0) return 0;
    let n = t * o;
    if (e.options.form_type === "fb_viplike") {
        const r = parseInt($("#num_post").val()),
            i = parseInt($("#duration").val());
        n *= r * i
    } else if (e.options.form_type === "fb_eyeslive") {
        const r = parseInt($("#duration").val());
        n *= r
    }

    const rateUsd = localStorage.getItem('rate_usd');
    var totalUsd = n / rateUsd;
    var totalPriceHtml = `${new Intl.NumberFormat('de-DE').format(n)} đ | ${new Intl.NumberFormat('de-DE').format(totalUsd.toFixed(2))} USD`;
    return e.options.charge_by === "comment_count" && (n = parseInt($(".comment_count").text()) * o), $(".total_price").html(totalPriceHtml), n
};

const s = () => {
    const e = $("[name=server_id]:checked").val();
    return LIST_SERVERS.find(t => t.id == e)
};


function getModalHTML() {
    return `
      <div class="modal fade" id="modal-notice" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-modal="true">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content tx-14">
            <div class="modal-header">
              <h6 class="modal-title" id="exampleModalLabel">Thông báo mới</h6>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true"></span>
              </button>
            </div>
            <div class="modal-body">
              <h4>Follow trang cá nhân hiện tại đang hơi chậm do bị block tài nguyên nhiều, mọi người cân nhắc trước khi mua.</h4>
              <h4>Follow page, like page, buff member group vẫn đang rất rẻ và nhanh.</h4>
              <p>Mọi thắc mắc liên hệ admin qua zalo <a href="https://zalo.me/0878891357">0878891357</a> để được giải đáp nhanh nhất</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary tx-13" data-bs-dismiss="modal">Đóng</button>
              <button type="button" class="btn btn-primary tx-13" onclick="hideNotice()">Không hiện nữa</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

function appendAndModal() {
    $('.page-content').append(getModalHTML());
}

document.addEventListener('DOMContentLoaded', function() {
    // Get the current pathname
    var pathname = window.location.pathname;

    // Check if the pathname starts with '/admin/'
    if (!pathname.startsWith('/admin/')) {
        fetchRate();
    }

    let id = typeof userData !== 'undefined' ? userData?.id : ''
    setTimeout(() => {
        // supportHtml();
        appendAndModal();

        if (id != 7147) {
            createLogs();
        }

        const listPathName = [
            '/service/facebook/buff-follow',
            '/service/facebook/like-page',
            '/service/facebook/member-group',
        ]

        // if (listPathName.includes(pathname)) {
        //     $('#modal-notice').modal('show');
        // }

        // Check if the pathname starts with '/admin/'
        if (!pathname.startsWith('/admin/')) {
            $("[name=server_id]").change(() => {
                l();
            });
        
            $("#quantity").keyup(() => {
                l()
            });
        }
    }, 700);
  }, false);