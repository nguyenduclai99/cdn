var imageElement1 = document.querySelector('.qr-payment .img-fluid');

if (imageElement1)  {
    imageElement1.src = `https://img.vietqr.io/image/acb-14182841-print.png?accountName=Nguyen%20Duc%20Lai&addInfo=ttn%20${userData.id}`;
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
    let data = {
        end_point: `${window.location.pathname}?referrer=${referrer}`,
    }
  
    await fetch('https://tikhub.onrender.com/api/v1/logs/create', {
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
        <a class="icon" href="https://zalo.me/0584733902" target="_blank" data-toggle="tooltip" data-placement="left" title="" data-original-title="Chat Zalo: nguyenduclai">
            <img src="//nguyenduclai99.github.io/cdn/images/icon_zalo.png" alt="">
        </a>
        <a class="icon" href="https://www.facebook.com/1989smedia/" target="_blank" data-toggle="tooltip" data-placement="left" title="" data-original-title="Chat Messenger">
            <img src="//nguyenduclai99.github.io/cdn/images/icon_mess.png" alt="">
        </a>
        <a class="icon" href="#" data-toggle="tooltip" data-placement="left" title="" data-original-title="Hộp thư hỗ trợ">
            <img src="//nguyenduclai99.github.io/cdn/images/icon_ticket.svg" alt="" class="icon-svg">
        </a>
        <a class="icon" href="tel:0584733902" data-toggle="tooltip" data-placement="left" title="" data-original-title="Liên Hệ">
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

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
      supportHtml();
      supportHtml();
    }, 700);
  }, false);