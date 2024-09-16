const token = localStorage.getItem('access_token');

const errorModal = (text, code = 400) => {
    Swal.fire({
        title: 'Lỗi',
        icon: "error",
        text: text,
    });

    if (code === 401) {
        window.location.href = '/login';
    }
}

const infoModal = (text) => {
    Swal.fire({
        title: 'Thông báo',
        icon: "info",
        text: text,
    });
}

const successModal = (text) => {
    Swal.fire({
        title: 'Thành công',
        icon: "success",
        text: text,
    });
}

const warningDeleteModal = async (text = 'Bạn có chắc chắn?', url) => {
    const result = await Swal.fire({
        title: "Are you sure?",
        text: text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
    });

    if (result.isConfirmed) {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // 'X-CSRF-TOKEN': getCsrfToken(),
                'Authorization': `Bearer ${token}`,
            }
        });

        if (!response.ok) {
            errorModal('Network response was not ok ' + response.statusText)
        }

        const result = await response.json();
        successModal(result.message)
    }
}

function formatDate(date) {
    if (!date) return ''
    const format = "HH:mm:ss DD-MM-YYYY"

    return moment(date).format(format)
}

const isEmpty = (obj) => Object.keys(obj).length === 0;
