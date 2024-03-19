
/*

early attempt at "jock script" dark mode --
it worked, but didn't maintain state.
at the time, we didn't even know
what a function was.

--cr 3:18AM 3.19.24

bc, canada

function myFunction() {
    var element = document.body;
    element.classList.toggle("dark-mode");
}

*/

const sun = document.getElementById("sun");
const halo = document.getElementById("halo");

const grow = () => {
  sun.classList.add("grow");
  halo.classList.add("grow-margin");
}

sun.addEventListener("click", grow);