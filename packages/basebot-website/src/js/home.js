jQuery(document).ready(function ($) {
  if (document.body.className.includes('index')) {
    // dots in the hero
    createCols()
    plotDots()
    setInterval(plotDots, 300)
    $(window).on('resize', createCols)
    // scroll anchor
    $('#quickStartButton').on('click', () => {
      document.getElementById('quickStart').scrollIntoView({behavior: 'smooth'})
    })
    $('#learnMoreButton').on('click', () => {
      document.getElementById('learnMore').scrollIntoView({behavior: 'smooth'})
    })
  }
})

function createCols () {
  const $base = $('#eq')
  const colTotal = $base.width() / 10
  $base.html('')
  for (let i = 0; i < colTotal; i++) {
    $base.append(`<div class="col">`)
  }
}

function plotDots () {
  const $cols = $('#eq .col')
  $cols.each((i, col) => {
    $(col).html('')
    const dotTotal = getRandomInt(3, 13)
    for (let i = 0; i < dotTotal; i++) {
      $(col).append(`<div class="dot variation-${getRandomInt(1,4)}">`)
    }
  })
}

function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}
