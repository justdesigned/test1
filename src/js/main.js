import $ from "jquery";
import slick from "slick-carousel";
$(document).ready(function () {
  $(".slider").slick({
    arrows: false,
    slidesToShow: 1,
    autoplay: true,
    dots: true,
    appendDots: ".slider-dots",
  });
  $(".slider-arrow--prev").on("click", function (event) {
    $(".slider").slick("slickPrev");
  });
  $(".slider-arrow--next").on("click", function (event) {
    $(".slider").slick("slickNext");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#copyright").textContent =
    "Copyright " + new Date().getFullYear();
});
