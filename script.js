const sun = document.getElementById("sun");
const son = document.getElementById("son");
const halo = document.getElementById("halo");

const grow = () => {
    sun.classList.toggle("grow-big");
    son.classList.toggle("grow-med");
    halo.classList.toggle("grow-margin");
}

sun.addEventListener("click", grow);
son.addEventListener("click", grow);