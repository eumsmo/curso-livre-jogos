const bodyEl = document.querySelector('body');

export function showList() {
    bodyEl.classList.remove('showing-detail');
}

export function showDetail() {
    bodyEl.classList.add('showing-detail');
}
